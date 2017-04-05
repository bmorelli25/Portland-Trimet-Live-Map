var express = require('express'),
    request = require('request');

var ProcessData = require('./ProcessData');

var app = express();
const PORT = process.env.PORT || 3000;
const URL = 'http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B';

//tell it which folder we want to serve
app.use(express.static('public'));

request(URL, function(err, res, body){
  if(err){
    console.log('Error fetching data from Trimet: ',err);
  } else {
    let vehicleData = JSON.parse(body).resultSet.vehicle;
    let vehicles = ProcessData.go(vehicleData);
  }
});

app.get('/', function(req,res){
  res.send('It works');
});

//start the server
app.listen(PORT, function() {
  console.log('Express Server is up on port ' + PORT);
});
