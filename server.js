var express = require('express');

//Create our App
var app = express();

//set enviornment variable, if there isn't one (aka locally) use 3000
const PORT = process.env.PORT || 3000;

//tell it which folder we want to serve
app.use(express.static('public'));

//start the server
app.listen(PORT, function() {
  console.log('Express Server is up on port ' + PORT);
});
