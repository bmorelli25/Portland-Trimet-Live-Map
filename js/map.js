//simplified JSON data
var vehicles = [];
//holds are markers, contents, and info winders
var markers=[];
var contents = [];
var infowindows = [];

//holds our checkboxes
var checkboxes = [];


//get JSON from Trimet.com
var trimetData;
$.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(webData) {
    trimetData = webData;
      console.log("trimetdata: ", trimetData);


//var icon = 'http://i.imgur.com/imuR74T.png'; - 40px .png
//var icon = 'http://i.imgur.com/SHyzGIk.png'; - 20px .png


//creates the vehicles array from the JSON dataset 'currently above'
 for (var i = 0; i < trimetData["resultSet"]["vehicle"].length; i++) {
    
    var long = trimetData["resultSet"].vehicle[i].longitude;
    var lat = trimetData["resultSet"].vehicle[i].latitude;
    var latlngTemp = new google.maps.LatLng(lat, long);
    var routeNum = trimetData["resultSet"].vehicle[i].routeNumber;
    var signMessage = trimetData["resultSet"].vehicle[i].signMessage;
    var busDirection = trimetData["resultSet"].vehicle[i].direction;
    var vehicleID = trimetData["resultSet"].vehicle[i].vehicleID;
    var delayV = trimetData["resultSet"].vehicle[i].delay;
		vehicles.push([lat,long,latlngTemp,routeNum,signMessage,busDirection,vehicleID,delayV]);
 }
//logs vehicle array for testing
console.log("Vehicle Array ", vehicles);

//load the map options
var mapOptions = {
	center: new google.maps.LatLng(45.521190, -122.629835),
	zoom: 11			
};
          
//creates the map in the div"map" using the map options          
map = new google.maps.Map(document.getElementById("map"), mapOptions);



//loop to create  the vehicles
for (i = 0; i < vehicles.length; i++) { 

    //create latlng
  let longlatTemp = vehicles[i][2];     
    //creating title. 
  let signMessageForThisMarker = vehicles[i][4] + "";
  let tempDirection = vehicles[i][5];
  let vehicleNum = "" + (vehicles[i][3]);
  let vehicleNumNum = vehicles[i][3];
  let vehicleIDID = vehicles[i][6];
  let vehicleDelay = vehicles[i][7];
       
    //var icon = '../Portland-Trimet-Live-Map/images/' + vehicleNumNum + '-' + (tempDirection ? 'g' : 'b') + '.png';
    
    // SET FILL COLOR BASED ON VEHICLE AND DIRECTION
    var fillColor;
    var strokeColor = tempDirection ? '#ffffff' : '#000000' ;
    switch (vehicleNumNum){
                case 90:
                    //red
                    fillColor = tempDirection ? '#F44336' : '#F44336';
                    break;
                case 100:   
                    //blue
                    fillColor = tempDirection ? '#2196F3' : '#2196F3';
                    break;
                case 190:
                    //yellow
                    fillColor = tempDirection ? '#FFEB3B' : '#FFEB3B';
                    break;
                case 200:
                    //green
                    fillColor = tempDirection ? '#4CAF50' : '#4CAF50';
                    break;
                case 290:
                    //orange
                    fillColor = tempDirection ? '#FF9800' : '#FF9800';
                    break;
                default:
                    //bus
                    fillColor = tempDirection ? '#607D8B' : '#607D8B';
                    break;
            }
    
         var icon = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: fillColor,
            fillOpacity: .6,
            strokeColor: strokeColor,
            strokeWeight: 1,
            strokeOpacity: .6,
            scale: .5,
            text: "57"
        }
    
    /** STILL A WORK IN PROGRESS
    //tests if img doesn't exist. If it doesn't, use SVG instead.
    $.get(icon).fail(function() {
        icon = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: (tempDirection ? '#FF0000' : '#ff8000'),
            fillOpacity: .6,
            strokeWeight: 1,
            scale: .5,
            text: "57"
        }
    });
    **/
    
	markers[i] = new google.maps.Marker({
  	position: longlatTemp,
    map: map,
    icon: icon,
    title: vehicleNum,
    busNum: vehicleNumNum,
    uniqueID: vehicleIDID
        //title: titleTemp
  });

    //activate so that no markers show up initially
    //markers[i].setMap(null);
    
  markers[i].index = i;
  contents[i] = '<div class="popup_container">' + signMessageForThisMarker + '<br>' + ( vehicleDelay > 0 ? 'Ahead of schedule by ' : 'Behind schedule by ') + Math.abs(vehicleDelay) + ' seconds. </div>';

	
  infowindows[i] = new google.maps.InfoWindow({
    content: contents[i],
    maxWidth: 300
  });

  google.maps.event.addListener(markers[i], 'click', function() {
		console.log(this.index); // this will give correct index
		console.log(i); //this will always give 10 for you
    infowindows[this.index].open(map,markers[this.index]);
    map.panTo(markers[this.index].getPosition());
  });  
}

console.log(markers);
console.log("Markers title", markers[0]["title"])


    // creating checkboxes dynamically. Huh, it actually works. Cool.
   
for (let ch = 0; ch < 291; ch++){
    for (let ve = 0; ve < vehicles.length; ve++){
        if ( ch == vehicles[ve][3]){
            
            let tempvariable = vehicles[ve][3];
            
            checkboxes[ch] = document.createElement('input');
            checkboxes[ch].id = "bus" + vehicles[ve][3];
            //checkboxes[ch].onclick = ("addRemoveBus(" + vehicles[ve][3] + ")");
            //checkboxes[ch].onclick = "addRemoveBus(57)";
            checkboxes[ch].value = vehicles[ve][3];
            checkboxes[ch].type = "checkbox";
            checkboxes[ch].checked = "checked";
            checkboxes[ch].name = "bus" + vehicles[ve][3];

            checkboxes[ch].addEventListener('click', function(){
                addRemoveBus(tempvariable);
            })
            
            let label = document.createElement('label')
            label.htmlFor = "bus" + vehicles[ve][3];
            
            var node;
            switch (vehicles[ve][3]){
                case 90:
                    label.appendChild(document.createTextNode("Red Line" + "\u00A0")); 
                    node = document.getElementById("railButtonsHere");
                    break;
                case 100:                   
                    label.appendChild(document.createTextNode("Blue Line" + "\u00A0"));  
                    node = document.getElementById("railButtonsHere");
                    break;
                case 190:
                    label.appendChild(document.createTextNode("Yellow Line" + "\u00A0"));
                    node = document.getElementById("railButtonsHere");
                    break;
                case 200:
                    label.appendChild(document.createTextNode("Green Line" + "\u00A0"));
                    node = document.getElementById("railButtonsHere");
                    break;
                case 290:
                    label.appendChild(document.createTextNode("Orange Line" + "\u00A0"));
                    node = document.getElementById("railButtonsHere");
                    break;
                default:
                    label.appendChild(document.createTextNode("" + vehicles[ve][3] + "\u00A0"));
                    node = document.getElementById("buttonsHere");
                    break;
            }
            
            node.appendChild(checkboxes[ch]);
            node.appendChild(label);
            //exits the second for loop so we don't get multiple checkboxes for the same bus route
            break;
        }
    }    
}
    
    
    
});

//hide bus when clicked
function clearMarkers(routeToClear) {
    for (let a = 0; a < markers.length; a++){
        if (markers[a]["busNum"] == routeToClear){
                    console.log("Marker GOS: ", markers[a][3]);
            markers[a].setMap(null);
            //setMapOnAll(null);
        } 
                console.log("Marker STAYS: ", markers[a][3]);

    }
}

// Shows any markers currently in the array.
function showMarkers(routeToAdd) {
    for (var b = 0; b < markers.length; b++){
        if (markers[b]["busNum"] == routeToAdd){
            console.log("Marker Added: ", markers[b][3]);
            markers[b].setMap(map);
            //setMapOnAll(null);
        } 
        //setMapOnAll(map);
    }
}

//function is called when a route is checked or unchecked
function addRemoveBus(busRoute){
    //if checked, we add the bus route to the map by calling showMarkers(busRoute);
    if (document.getElementById("bus"+busRoute).checked) {
        showMarkers(busRoute);
    }
    //if unchecked, we remove the bus route by calling clearMarkers();
    else {
    	console.log("Box is NOT checked");
        clearMarkers(busRoute);
        //alert("Checkbox wasn't checked.");
    }
};




//temp variable for testing purposes
var timeCounter = 1;

setInterval(function updateLocation() {
    
    $.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(webData) {
    trimetData = webData;
        
        for (key in trimetData.resultSet.vehicle){
            for (var c = 0; c < vehicles.length; c++){
                if (trimetData.resultSet.vehicle[key]["vehicleID"] == vehicles[c][6]){
                    for ( var d = 0; d < markers.length; d++) {
                        if (markers[d]["uniqueID"] == vehicles[c][6]){
                            
                            var tempLatF = trimetData["resultSet"].vehicle[key].latitude;
                            var tempLongF = trimetData["resultSet"].vehicle[key].longitude;
                            var tempLatLongF = new google.maps.LatLng(tempLatF, tempLongF);
                            vehicles[c][0] = tempLatF;
                            vehicles[c][1] = tempLongF;
                            vehicles[c][2] = tempLatLongF;
                            vehicles[c][3] = trimetData["resultSet"].vehicle[key].routeNumber;
                            vehicles[c][4] = trimetData["resultSet"].vehicle[key].signMessage;
                            vehicles[c][5] = trimetData["resultSet"].vehicle[key].direction;
                            vehicles[c][6] = trimetData["resultSet"].vehicle[key].vehicleID;
                            vehicles[c][7] = trimetData["resultSet"].vehicle[key].delay;
                            
                            markers[d].setPosition(tempLatLongF);
                            
                            //doesn't work - contents isn't updated. 
                            //contents[d] = '<div class="popup_container">' + vehicles[c][4] + '<br>' + ( vehicles[c][7] > 0 ? 'Ahead of schedule by ' : 'Behind schedule by ') + Math.abs(vehicles[c][7]) + ' seconds. </div>';
                            
                        }
                    }  
                }   
            }
        }
    });  
}, 5000);


 $("#checkAllBus").click(function () {
     $('#buttonsHere input:checkbox').not(this).prop('checked', !this.checked).click();
 });

 $("#checkAllRail").click(function () {
     $('#railButtonsHere input:checkbox').not(this).prop('checked', !this.checked).click();
 });



//necessary for boostrap??
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 10; // Calculate the top offset

    $('#map').css('height', h-offsetTop);
}).resize();

//.css("width", 400) add after height above if necessary

/** Trying to get the stupid check all button to work is difficult...
$('input:checkbox').change(
    function(){
        if ($(this).is(':checked')) {
            //alert('checked');
            var currentVal  = $(this).val();
            console.log("CV", currentVal);
            addRemoveBus(currentVal);
            console.log("test");
        }
    });

**/

/**
for (var ch = 0; ch < vehicles.length; ch++){
    
    checkboxes[ch] = document.createElement('input');
    checkboxes[ch].id = "bus" + vehicles[ch][3];
    checkboxes[ch].onclick = "addRemoveBus(" + vehicles[ch][3] + ")";
    checkboxes[ch].value = vehicles[ch][3];
    checkboxes[ch].type = "checkbox";
    checkboxes[ch].checked = "checked";

    var label = document.createElement('label')
    label.htmlFor = "id";
    label.appendChild(document.createTextNode("" + vehicles[ch][3]));

    container.appendChild(checkboxes[ch]);
    container.appendChild(label);
    
    
}

**/



/** 
// This will rinse and repeat every 5 seconds
setInterval(function() {
        position = new google.maps.LatLng(purple[i][1], purple[i][2]);
        marker.setPosition(position);
    }, 5000); 
**/ 

/** attempting to close infowindows
google.maps.event.addListener(map, 'click', function() {
    for (var j; j < infowindows.length; j++){
        infowindows[j].close();
    }
  });
**/  