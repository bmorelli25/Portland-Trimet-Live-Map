//get JSON from Trimet.com
let trimetData;
$.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(webData) {
    trimetData = webData;
      console.log("trimetdata: ", trimetData);

});


//using this variable as a temporary way to get the data
var trimetDataTest = JSON.parse('{"resultSet":{"queryTime":1463954308185,"vehicle":[{"expires":1463954749000, "signMessage":"Blue to Hillsboro","serviceDate":1463900400000,"loadPercentage":null,"latitude":45.5043592,"nextStopSeq":3,"type":"rail","blockID":9023,"signMessageLong":"MAX  Blue Line to Hillsboro","lastLocID":8360,"nextLocID":8361,"locationInScheduleDay":53841,"newTrip":false,"longitude":-122.432547,"direction":1,"inCongestion":null,"routeNumber":100,"bearing":300,"garage":"ELMO","tripID":"6409814","delay":-19,"extraBlockID":null,"messageCode":891,"lastStopSeq":2,"vehicleID":104,"time":1463954260579,"offRoute":false},{"expires":1463954694000,"signMessage":"Blue to Gresham","serviceDate":1463900400000,"loadPercentage":null,"latitude":45.5189944,"nextStopSeq":22,"type":"rail","blockID":9018,"signMessageLong":"MAX  Blue Line to Gresham","lastLocID":8333,"nextLocID":8334,"locationInScheduleDay":53606,"newTrip":false,"longitude":-122.681098,"direction":0,"inCongestion":null,"routeNumber":200,"bearing":110,"garage":"ELMO","tripID":"6409203","delay":-264,"extraBlockID":null,"messageCode":892,"lastStopSeq":21,"vehicleID":106,"time":1463954271028,"offRoute":false},{"expires":1463954520000,"signMessage":"57 To Forest Grove","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.4913823,"nextStopSeq":1,"type":"bus","blockID":5771,"signMessageLong":"57  TV Hwy to Forest Grove","lastLocID":9984,"nextLocID":9984,"locationInScheduleDay":53820,"newTrip":false,"longitude":-122.801167,"direction":0,"inCongestion":false,"routeNumber":57,"bearing":33,"garage":"MERLO","tripID":"6402500","delay":-60,"extraBlockID":null,"messageCode":637,"lastStopSeq":70,"vehicleID":3214,"time":1463954282660,"offRoute":false},{"expires":1463954541000,"signMessage":"57 To Forest Grove","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.5199675,"nextStopSeq":48,"type":"bus","blockID":5770,"signMessageLong":"57  TV Hwy to Forest Grove","lastLocID":268,"nextLocID":10129,"locationInScheduleDay":53835,"newTrip":false,"longitude":-123.00073,"direction":0,"inCongestion":false,"routeNumber":57,"bearing":270,"garage":"MERLO","tripID":"6402497","delay":-66,"extraBlockID":null,"messageCode":637,"lastStopSeq":47,"vehicleID":3220,"time":1463954303937,"offRoute":false},{"expires":1463954540000,"signMessage":"57 To Beaverton TC","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.5201008,"nextStopSeq":9,"type":"bus","blockID":5767,"signMessageLong":"57  TV Hwy to Beaverton TC","lastLocID":4294,"nextLocID":4298,"locationInScheduleDay":53699,"newTrip":false,"longitude":-123.0912828,"direction":1,"inCongestion":false,"routeNumber":57,"bearing":59,"garage":"MERLO","tripID":"6402766","delay":-201,"extraBlockID":null,"messageCode":641,"lastStopSeq":8,"vehicleID":3221,"time":1463954303927,"offRoute":false},{"expires":1463954535000,"signMessage":"57 To Forest Grove","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.4953669,"nextStopSeq":19,"type":"bus","blockID":5776,"signMessageLong":"57  TV Hwy to Forest Grove","lastLocID":5633,"nextLocID":5635,"locationInScheduleDay":53940,"newTrip":false,"longitude":-122.8818013,"direction":0,"inCongestion":false,"routeNumber":57,"bearing":278,"garage":"MERLO","tripID":"6402499","delay":45,"extraBlockID":null,"messageCode":637,"lastStopSeq":18,"vehicleID":3227,"time":1463954297916,"offRoute":false},{"expires":1463954431000,"signMessage":"58 To Beaverton TC","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.4914072,"nextStopSeq":25,"type":"bus","blockID":5867,"signMessageLong":"58  Canyon Rd to Beaverton TC","lastLocID":8435,"nextLocID":9976,"locationInScheduleDay":53510,"newTrip":false,"longitude":-122.8006072,"direction":0,"inCongestion":false,"routeNumber":58,"bearing":186,"garage":"MERLO","tripID":"6402953","delay":0,"extraBlockID":null,"messageCode":659,"lastStopSeq":24,"vehicleID":3230,"time":1463954192736,"offRoute":false},{"expires":1463954527000,"signMessage":"62 To Sunset TC","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.5023386,"nextStopSeq":37,"type":"bus","blockID":6269,"signMessageLong":"62  Murray Blvd to Sunset TC","lastLocID":3062,"nextLocID":3063,"locationInScheduleDay":53929,"newTrip":false,"longitude":-122.8207995,"direction":1,"inCongestion":false,"routeNumber":62,"bearing":290,"garage":"MERLO","tripID":"6403225","delay":42,"extraBlockID":null,"messageCode":693,"lastStopSeq":36,"vehicleID":3232,"time":1463954289339,"offRoute":false},{"expires":1463954540000,"signMessage":"54 Downtown Only","serviceDate":1463900400000,"loadPercentage":0,"latitude":45.5134662,"nextStopSeq":43,"type":"bus","blockID":5470,"signMessageLong":"54  Downtown Only","lastLocID":13305,"nextLocID":11486,"locationInScheduleDay":53806,"newTrip":false,"longitude":-122.681652,"direction":1,"inCongestion":false,"routeNumber":54,"bearing":20,"garage":"MERLO","tripID":"6402085","delay":-94,"extraBlockID":null,"messageCode":621,"lastStopSeq":42,"vehicleID":3234,"time":1463954303795,"offRoute":false}]}}');

  console.log("trimetdatatest: ", trimetDataTest);


//simplified JSON data
var vehicles = [];
//holds are markers, contents, and info winders
var markers=[];
var contents = [];
var infowindows = [];

//holds our checkboxes
var checkboxes = [];

//var icon = 'http://i.imgur.com/imuR74T.png'; - 40px .png
//var icon = 'http://i.imgur.com/SHyzGIk.png'; - 20px .png


//creates the vehicles array from the JSON dataset 'currently above'
 for (var i = 0; i < trimetDataTest["resultSet"]["vehicle"].length; i++) {
    
    var long = trimetDataTest["resultSet"].vehicle[i].longitude;
    var lat = trimetDataTest["resultSet"].vehicle[i].latitude;
    var latlngTemp = new google.maps.LatLng(lat, long);
    var routeNum = trimetDataTest["resultSet"].vehicle[i].routeNumber;
    var signMessage = trimetDataTest["resultSet"].vehicle[i].signMessage;
    var busDirection = trimetDataTest["resultSet"].vehicle[i].direction;
    var vehicleID = trimetDataTest["resultSet"].vehicle[i].vehicleID;
    var delayV = trimetDataTest["resultSet"].vehicle[i].delay;
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
    
         var icon = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: (tempDirection ? '#FF0000' : '#ff8000'),
            fillOpacity: .6,
            strokeWeight: 1,
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
    for (var c = 0; c < vehicles.length; c++) {
        for ( var d = 0; d < markers.length; d++) {
            if (markers[d]["uniqueID"] == vehicles[c][6]){
                //code to update LATLNG
                console.log("update: ", c, d);
                
                //the below is all test code and should be deleted prior to production or when you figure shit out
                var tempLat = vehicles[c][0];
                var tempLong = vehicles[c][1];
                
                tempLat += .0001 * timeCounter;
                tempLong -= .0001 * timeCounter;
                timeCounter++;
                //vehicles[c][3] = new google.maps.LatLng(tempLat, tempLong);
                var tempLatLng = new google.maps.LatLng(tempLat, tempLong);
                markers[d].setPosition(tempLatLng);
                
            } else {
                //no match
                //code to create new marker and push to marker array
                //console.log("no match: ", c, d);

            }
        }
        
    }
    
    
}, 5000);


// creating checkboxes dynamically. Huh, it actually works. Cool.


for (let ch = 0; ch < 201; ch++){
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

            checkboxes[ch].addEventListener('click', function(){
                addRemoveBus(tempvariable);
            })
            
            let label = document.createElement('label')
            label.htmlFor = "id";
            label.appendChild(document.createTextNode("" + vehicles[ve][3]));

            var node = document.getElementById("buttonsHere");
            node.appendChild(checkboxes[ch]);
            node.appendChild(label);
            //exits the second for loop so we don't get multiple checkboxes for the same bus route
            break;
        }
    }    
}



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