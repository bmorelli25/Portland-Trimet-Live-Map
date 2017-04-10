var express = require('express'),
    app = express(),
    request = require('request'),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var busses = [];
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';
const URL = 'http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B';

//tell it which folder we want to serve
app.use(express.static('public'));

//CORS middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function fetchTriMet(){
  request(URL, function(err, res, body){
    if(err){
      console.log('Error fetching data from Trimet: ',err);
    } else {
      let tempArr = [];
      let vehicles = JSON.parse(body).resultSet.vehicle;
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
          let bus = new Vehicle(vehicles[i]);
          tempArr.push(bus);
        }
      }
      busses = tempArr.slice();
      // console.log(busses);
      io.emit('busses_moved', busses);
    }
  });
}
setInterval(fetchTriMet, 5000);

app.get('/', function(req,res){
  res.send(busses);
});

io.on('connection', function(socket){
  socket.emit('initial_data', busses);
  console.log('a user connected');
});

//start the server
http.listen(PORT, IP, function() {
  console.log('Express Server is up on port ' + PORT);
});
