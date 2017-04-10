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

$.getJSON('http://localhost:3000', function(trimetData) {
let vehicleData = trimetData;

  vehicleData.forEach(function(vd){
    createMarker(vd);
  //busArray.push(vd);
  });
});

//still need to refactor
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 10; // Calculate the top offset

    $('#map').css('height', h-offsetTop);
}).resize();

function createMarker(bus){
  let marker = new google.maps.Marker({
    position: function(){ //latlngTemp
      return new google.maps.LatLng(bus.latitude, bus.longitude);
    }(),
    map: map,
    icon: function(){
      return {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: fillColor(bus.routeNum, bus.direction),
        fillOpacity: 0.6,
        strokeColor: bus.direction ? '#ffffff' : '#000000' ,
        strokeWeight: 2,
        strokeOpacity: 0.6,
        scale: 0.5,
        text: "57"
      };
    }(),
    title: bus.title,
    busNum: bus.routeNum,
    uniqueID: bus.id
    //title: titleTemp
  });

  let content = (
    '<div class="popup_container">' +
      bus.title +
      '<br>' +
      ( bus.delay > 0 ? 'Ahead of schedule by ' : 'Behind schedule by ') +
      Math.abs(bus.delay) +
      ' seconds. </div>'
  );

  let infowindow = new google.maps.InfoWindow({
    content,
    maxWidth: 300
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function fillColor(routeNum,direction){
  switch (routeNum){
    case 90://red
      return direction ? '#F44336' : '#F44336';
    case 100://blue
      return direction ? '#2196F3' : '#2196F3';
    case 190://yellow
      return direction ? '#FFEB3B' : '#FFEB3B';
    case 200://green
      return direction ? '#4CAF50' : '#4CAF50';
    case 290://orange
      return direction ? '#FF9800' : '#FF9800';
    default://bus
      return direction ? '#607D8B' : '#607D8B';
  }
}
