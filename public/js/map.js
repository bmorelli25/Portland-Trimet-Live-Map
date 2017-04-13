let localBusses = [];
let markers = {};
let railNumbers = [90,100,190,200,290];

//creates the map in the div"map" using the map options
//Sets up and adds transit layer which displays transit routes (for rail)
function initMap(){
  //center map in middle of Portland, zoom to level 11
  let pdxCoords = new google.maps.LatLng(45.521190, -122.629835)
  let mapZoomLevel = 11;

  map = new google.maps.Map(document.getElementById("map"), {
    center: pdxCoords,
    zoom: mapZoomLevel
  });

  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
}

var socket = io.connect('https://portland-trimet-live-map.herokuapp.com/');

socket.on('busses_moved', function(busses){
  if(localBusses.length === 0 && busses.length > 0){
    busses.forEach(function(bus){
      localBusses.push(bus);
      createMarker(bus);
    });
  } else if (busses.length > 0){
    busses.forEach(function(bus){
      localBusses.forEach(function(localBus){
        if(bus.id !== localBus.id) return;
        if(bus.longitude !== localBus.longitude || bus.latitude !== localBus.latitude){
          updateMarker(bus);
        }
      });
    });
  }
});

function updateMarker(bus){
  markers[bus.id].setPosition(new google.maps.LatLng(bus.latitude, bus.longitude));
}

function createMarker(bus){
  markers[bus.id] = new google.maps.Marker({
    position: function(){ //latlngTemp
      return new google.maps.LatLng(bus.latitude, bus.longitude);
    }(),
    label: {
      text: railNumbers.indexOf(bus.routeNum) > -1 ? ' ' : bus.routeNum.toString(),
      color: 'black',
      fontFamily: 'Sans-Serif',
      fontSize: '12px',
      fontWeight: '800'
    },
    map: map,
    icon: function(){
      return {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: fillColor(bus.routeNum, bus.direction),
        fillOpacity: 0.8,
        strokeColor: bus.direction ? '#ffffff' : '#000000' ,
        strokeWeight: 2,
        strokeOpacity: 0.8,
        scale: 0.5,
        text: ""
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

  markers[bus.id].addListener('click', function() {
    infowindow.open(map, markers[bus.id]);
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

//ensures the google map resizes with the browser
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 30; // Calculate the top offset

    $('#map').css('height', h-offsetTop);
}).resize();
