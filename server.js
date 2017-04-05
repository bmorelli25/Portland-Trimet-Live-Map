var express = require('express'),
    request = require('request');

var busArray = [];

var app = express();
const PORT = process.env.PORT || 3000;
const URL = 'http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B';

//tell it which folder we want to serve
app.use(express.static('public'));

//CORS middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

fetchTriMet();
setInterval(fetchTriMet, 5000);

app.get('/', function(req,res){
  res.send(busArray);
});

//start the server
app.listen(PORT, function() {
  console.log('Express Server is up on port ' + PORT);
});


function fetchTriMet(){
  request(URL, function(err, res, body){
    if(err){
      console.log('Error fetching data from Trimet: ',err);
    } else {
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

      vehicles.forEach(function(vehicle){
        if(vehicle.nextStopSeq === null) return;
        let bus = new Vehicle(vehicle);
        busArray.push(bus);
      });

    }
  });

}
