//center map in middle of Portland, zoom to level 11
var pdxCoords = new google.maps.LatLng(45.521190, -122.629835)
var mapZoomLevel = 11;

//Create empty Bus Array:
let busArray = [];

//load the map options
var mapOptions = {
    center: pdxCoords,
    zoom: mapZoomLevel
};

//creates the map in the div"map" using the map options
map = new google.maps.Map(document.getElementById("map"), mapOptions);

//get JSON from Trimet.com
$.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(trimetData) {
let vehicleData = trimetData.resultSet.vehicle;

  //Create Vehicle Class
  let Vehicle = function(bus){
    this.longitude = bus.longitude;
    this.latitude = bus.latitude;
    this.routeNum = bus.routeNumber;
    this.title = bus.signMessageLong;
    this.direction = bus.direction; //busDirection
    this.id = bus.vehicleID; //vehicleID
    this.delay = bus.delay; //delayV
    this.type = bus.type; // rail or bus
    this.marker = null; //marker placeholder
  };

  Vehicle.prototype = {
    createLatLng: function(){ //latlngTemp
      return new google.maps.LatLng(this.latitude, this.longitude);
    },
    fillColor: function(){
      switch (this.routeNum){
        case 90:
          //red
          return this.direction ? '#F44336' : '#F44336';
        case 100:
          //blue
          return this.direction ? '#2196F3' : '#2196F3';
        case 190:
          //yellow
          return this.direction ? '#FFEB3B' : '#FFEB3B';
        case 200:
          //green
          return this.direction ? '#4CAF50' : '#4CAF50';
        case 290:
          //orange
          return this.direction ? '#FF9800' : '#FF9800';
        default:
          //bus
          return this.direction ? '#607D8B' : '#607D8B';
        }
      },
      createIcon: function(){
        return {
          path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
          fillColor: this.fillColor(),
          fillOpacity: 0.6,
          strokeColor: this.direction ? '#ffffff' : '#000000' ,
          strokeWeight: 2,
          strokeOpacity: 0.6,
          scale: 0.5,
          text: "57"
        };
      },
      createMarker: function(){
        this.marker = new google.maps.Marker({
          position: this.createLatLng(),
          map: map,
          icon: this.createIcon(),
          title: this.title,
          busNum: this.routeNum,
          uniqueID: this.id
          //title: titleTemp
        });

        let content = (
          '<div class="popup_container">' +
            this.title +
            '<br>' +
            ( this.delay > 0 ? 'Ahead of schedule by ' : 'Behind schedule by ') +
            Math.abs(this.delay) +
            ' seconds. </div>'
        );

        let infowindow = new google.maps.InfoWindow({
          content,
          maxWidth: 300
        });

        this.marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }
    };

  vehicleData.forEach(function(vd){
    if(vd.vehicleID === null) return;

    let bus = new Vehicle(vd);
    busArray.push(bus);
    bus.createMarker();
  });

  console.log(busArray);
});

setInterval(function(){
  $.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(trimetData) {
    let vehicleData = trimetData.resultSet.vehicle;

    busArray.forEach(function(bus,i){
      vehicleData.forEach(function(newBus){
        if(newBus.vehicleID === bus.id){
          if(newBus.longitude !== bus.longitude || newBus.latitude !== bus.latitude){
            busArray[i].longitude = newBus.longitude;
            busArray[i].latitude = newBus.latitude;
            busArray[i].routeNum = newBus.routeNumber;
            busArray[i].title = newBus.signMessageLong;
            busArray[i].direction = newBus.direction; //busDirection
            busArray[i].id = newBus.vehicleID; //vehicleID
            busArray[i].delay = newBus.delay; //delayV
            busArray[i].type = newBus.type; // rail or bus
            busArray[i].marker.setPosition(busArray[i].createLatLng());
          }
        }
      });
    });
  });
}, 5000);

//still need to refactor
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 10; // Calculate the top offset

    $('#map').css('height', h-offsetTop);
}).resize();
