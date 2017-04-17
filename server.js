var express = require('express'),
    app = express(),
    request = require('request'),
    rp = require('request-promise'),
    http = require('http').Server(app),
    io = require('socket.io')(http);

let busses = [];
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '0.0.0.0';
const APPID = process.env.APPID;
let options = {
    uri: 'http://developer.trimet.org/ws/v2/vehicles',
    qs: {
      APPID
    },
    json: true
};

app.use(express.static('public'));

function fetchTriMet(){
  rp(options)
    .then(function (data) {
      let tempArr = [];
      let vehicles = data.resultSet.vehicle;
      let Vehicle = function(bus){
        this.longitude = bus.longitude;
        this.latitude = bus.latitude;
        this.routeNum = bus.routeNumber;
        this.title = bus.signMessageLong;
        this.direction = bus.direction; //busDirection
        this.id = bus.vehicleID; //vehicleID
        this.delay = bus.delay; //delayV
        this.type = bus.type; // rail or bus
      };

      if(vehicles.length > 0){
        for(let i = 0, len = vehicles.length; i < len; i++){
          if(vehicles[i].nextStopSeq === null) continue;
          tempArr.push(new Vehicle(vehicles[i]));
        }
      }

      busses = tempArr.slice();
      io.emit('busses_moved', busses);
    })
    .catch(function (err) {
      console.log('Error fetching data from Trimet: ',err);
    });
}
setInterval(fetchTriMet, 5000);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('busses_moved', busses);
  console.log('a user connected');
});

//start the server
http.listen(PORT, IP, function() {
  console.log(`Server is up on ${PORT}:${IP}`);
});
