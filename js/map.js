var _ = require('underscore');

/**
POTENTIAL UPGRADES:

1)
http://underscorejs.org/
Use Underscore to simplify array searching and hopefully remove nested for loops

2)
When dynamically creating the DOM checkboxes, add children to div tags and use bootstrap to specify how many checkboxes per row depending on the size of the screen

3)
xxxDONExxx
Master Checkbox:
Instead of looping through all of the bus numbers when this is checked/unchecke, create a new function that instantly turns on/off all busses.

4)
Add Trains to an array like this for easier testing and determing if train or bus

var trains = [90,100,190,200,290];
var testValue = 100;

if (trains.indexOf(testValue) >= 0){
    alert("true");
}


5)
xxxDONExxx
Utilize cached values for loop optimization

6)

Utilize array destructuring to assign multiple values from an array to local variables:
Example:
let users = ["Sam", "tyler", "brook"];
let [a,b,c] = users;
console.log(a) = "Sam"

values can also be discarded: let [a,,b] would discard middle value.
Can also use rest variables: let [first, ...rest]; console.log(first, rest) = Sam["Tyler", "Brook"]



6)

Use a document fragment to add all DOM checkbox elements at the same time

**/


//center map in middle of Portland, zoom to level 11
var pdxCoords = new google.maps.LatLng(45.521190, -122.629835)
var mapZoomLevel = 11;
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
    trimetData = webData["resultSet"];

//var icon = 'http://i.imgur.com/imuR74T.png'; - 40px .png
//var icon = 'http://i.imgur.com/SHyzGIk.png'; - 20px .png

//creates the vehicles array from the JSON dataset 'currently above'
    for (var i = 0, iLength = trimetData["vehicle"].length; i < iLength; i++) {
        let iCurrentVehicle = trimetData.vehicle[i];

        var long = iCurrentVehicle.longitude;
        var lat = iCurrentVehicle.latitude;
        var latlngTemp = new google.maps.LatLng(lat, long);
        var routeNum = iCurrentVehicle.routeNumber;
        var signMessage = iCurrentVehicle.signMessage;
        var busDirection = iCurrentVehicle.direction;
        var vehicleID = iCurrentVehicle.vehicleID;
        var delayV = iCurrentVehicle.delay;
            vehicles.push([lat,long,latlngTemp,routeNum,signMessage,busDirection,vehicleID,delayV]);
    }

    //logs vehicle array for testing
    console.log("Vehicle Array ", vehicles);

    //load the map options
    var mapOptions = {
        center: pdxCoords,
        zoom: mapZoomLevel
    };

    //creates the map in the div"map" using the map options
    map = new google.maps.Map(document.getElementById("map"), mapOptions);



    //loop to create  the vehicles
    for (var i = 0, iLength = vehicles.length; i < iLength; i++) {

        let iCurrentVehicle = vehicles[i];
        let vehiclePosition = iCurrentVehicle[2];
        let signMessageForThisMarker = iCurrentVehicle[4] + "";
        let tempDirection = iCurrentVehicle[5];
        let vehicleNum = "" + (iCurrentVehicle[3]);
        let vehicleNumNum = iCurrentVehicle[3];
        let vehicleIDID = iCurrentVehicle[6];
        let vehicleDelay = iCurrentVehicle[7];

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
            position: vehiclePosition,
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

    // creating checkboxes dynamically.
    /**
    Create dynamic bootrap useable grid system for boxes:

    <div class="row">
  <div class="col-sm-3"></div>
  <div class="col-sm-3"></div>
  <div class="col-sm-3"></div>
  <div class="col-sm-3"></div>
</div>


    **/

    var veRouteNum,
        busFragment = document.createDocumentFragment(),
        railFragment = document.createDocumentFragment(),
        label,
        node,
        bootstrapItemNumber = 1,
        fourCounter = 1;


    /**
    ATTEMPT TO REDO CHECKBOXES LEADS TO PAIN.

    for (let ch = 0; ch < 291; ch++){
        for (let ve = 0, veLength = vehicles.length; ve < veLength; ve++){
            veRouteNum = vehicles[ve][3];
            if ( ch == veRouteNum){


                checkboxes[ch] = document.createElement('input');
                checkboxes[ch].id = "bus" + veRouteNum;
                checkboxes[ch].value = veRouteNum;
                checkboxes[ch].type = "checkbox";
                checkboxes[ch].checked = "checked";
                checkboxes[ch].name = "bus" + veRouteNum;
                checkboxes[ch].addEventListener('click', function(){
                    addRemoveBus(veRouteNum);
                })

                label = document.createElement('label');
                label.htmlFor = "bus" + veRouteNum;

                switch (veRouteNum){
                    case 90:
                        label.appendChild(document.createTextNode("Red Line" + "\u00A0"));
                        railFragment.appendChild(checkboxes[ch]);
                        railFragment.appendChild(label);
                        railFragment.appendChild(document.createElement('br'));
                        break;
                    case 100:
                        label.appendChild(document.createTextNode("Blue Line" + "\u00A0"));
                        railFragment.appendChild(checkboxes[ch]);
                        railFragment.appendChild(label);
                        railFragment.appendChild(document.createElement('br'));
                        break;
                    case 190:
                        label.appendChild(document.createTextNode("Yellow Line" + "\u00A0"));
                        railFragment.appendChild(checkboxes[ch]);
                        railFragment.appendChild(label);
                        railFragment.appendChild(document.createElement('br'));
                        break;
                    case 200:
                        label.appendChild(document.createTextNode("Green Line" + "\u00A0"));
                        railFragment.appendChild(checkboxes[ch]);
                        railFragment.appendChild(label);
                        railFragment.appendChild(document.createElement('br'));
                        break;
                    case 290:
                        label.appendChild(document.createTextNode("Orange Line" + "\u00A0"));
                        railFragment.appendChild(checkboxes[ch]);
                        railFragment.appendChild(label);
                        railFragment.appendChild(document.createElement('br'));
                        break;
                    default:

                        var colTag = document.createElement('div');
                        colTag.className = "col-sm-3";

                        label.appendChild(document.createTextNode(veRouteNum));
                        colTag.appendChild(checkboxes[ch]);
                        colTag.appendChild(label);

                        switch (fourCounter){
                            case 1:
                            case 2:
                            case 3:
                                var colCurrent = document.getElementById("r" + bootstrapItemNumber);
                                console.log('colcur', colCurrent);
                                colCurrent.appendChild(colTag);
                                fourCounter++;
                                break;
                            case 4:
                                var colCurrent = document.getElementById("r" + bootstrapItemNumber);
                                console.log('colcur', colCurrent);
                                colCurrent.appendChild(colTag);

                                fourCounter = 1;
                                bootstrapItemNumber++;
                                break;
                        }



                        if (bootstrapItemNumber <= 4){

                            //bootstrapItemNumber++;
                        }
                        //busFragment.appendChild(colCurrent);

                        //console.log("busfrag",busFragment);

                        break;
                }



                //exits the second for loop so we don't get multiple checkboxes for the same bus route
                break;
            }
        }
    }
    node = document.getElementById("railButtonsHere");
    node.appendChild(railFragment);
    node2 = document.getElementById("buttonsHere");
    node2.appendChild(busFragment);

    **/





    // creating checkboxes dynamically.

    for (let ch = 0; ch < 291; ch++){
        for (let ve = 0, veLength = vehicles.length; ve < veLength; ve++){

            let veRouteNum = vehicles[ve][3];
            if ( ch == veRouteNum){

                checkboxes[ch] = document.createElement('input');
                checkboxes[ch].id = "bus" + veRouteNum;
                checkboxes[ch].value = veRouteNum;
                checkboxes[ch].type = "checkbox";
                checkboxes[ch].checked = "checked";
                checkboxes[ch].name = "bus" + veRouteNum;

                checkboxes[ch].addEventListener('click', function(){
                    addRemoveBus(veRouteNum);
                })

                let label = document.createElement('label');
                label.htmlFor = "bus" + veRouteNum;

                var node;
                switch (veRouteNum){
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


//checkboxes = element
//label = label
//node -> website

//node -> checkboxes -> label



//temp variable for testing purposes
var timeCounter = 1;

setInterval(function updateLocation() {

    $.getJSON('http://developer.trimet.org/ws/v2/vehicles?APPID=155EA63E56014EC522C98433B', function(webData) {
    trimetData = webData;

        for (key in trimetData.resultSet.vehicle){
            for (var c = 0, cLength = vehicles.length; c < cLength; c++){
                let newTrimetData = trimetData.resultSet.vehicle[key];
                let currentVehicle = vehicles[c];
                if (newTrimetData["vehicleID"] == currentVehicle[6]){
                    for ( var d = 0, dLength = markers.length; d < dLength; d++) {
                        if (markers[d]["uniqueID"] == currentVehicle[6]){


                            var tempLatF = newTrimetData.latitude;
                            var tempLongF = newTrimetData.longitude;
                            var tempLatLongF = new google.maps.LatLng(tempLatF, tempLongF);
                            vehicles[c][0] = tempLatF;
                            vehicles[c][1] = tempLongF;
                            vehicles[c][2] = tempLatLongF;
                            vehicles[c][3] = newTrimetData.routeNumber;
                            vehicles[c][4] = newTrimetData.signMessage;
                            vehicles[c][5] = newTrimetData.direction;
                            vehicles[c][6] = newTrimetData.vehicleID;
                            vehicles[c][7] = newTrimetData.delay;

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

// THESE TWO FUNCTIONS WATCH FOR CLICKS ON THE MASTER CHECKBOX AND RUN 'addRemoveAll' IF THEY ARE CLICKED
 $("#checkAllBus").click(function () {
     $('#buttonsHere input:checkbox').not(this).prop('checked', this.checked);
     addRemoveAll("checkAllBus", true);
 });

 $("#checkAllRail").click(function () {
     $('#railButtonsHere input:checkbox').not(this).prop('checked', this.checked);
     addRemoveAll("checkAllRail", false);
 });

// THIS IS THE FUNCTION THAT ADDS OR REMOVES ALL BUS/RAIL. MUCH QUICKER THAN THE LOOP I HAD BEFORE
function addRemoveAll(domElement, isBus){
    if (document.getElementById(domElement).checked) {
        for (let bb = 0, bbLength = markers.length; bb < bbLength; bb++){
            let markerNum = markers[bb]["busNum"];
            if (isBus){
                if (markerNum != 90 && markerNum != 100 && markerNum != 190 && markerNum != 200 && markerNum !=290){
                markers[bb].setMap(map);
                }
            } else {
                if (markerNum == 90 || markerNum == 100 || markerNum == 190 || markerNum == 200 || markerNum ==290){
                markers[bb].setMap(map);
                }
            }
        }
    } else {
        for (let bb = 0, bbLength = markers.length; bb < bbLength; bb++){
            let markerNum = markers[bb]["busNum"];
            if (isBus){
                if (markerNum != 90 && markerNum != 100 && markerNum != 190 && markerNum != 200 && markerNum != 290){
                markers[bb].setMap(null);
                }
            } else {
                if (markerNum == 90 || markerNum == 100 || markerNum == 190 || markerNum == 200 || markerNum == 290){
                markers[bb].setMap(null);
                }
            }
        }
    }
}

//THIS FUNCTION IS CALLED WHEN A SINGULAR ROUTE IS CHECKED OR UNCHECKED. IT THEN CALLS 'clearMarkers' or 'showMarkers'
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
}

//THIS FUNCTION CLEARS INDIVIDUAL MARKERS BY LOOPING THROUGH THE ARRAY
function clearMarkers(routeToClear) {
    for (let a = 0, aLength = markers.length; a < aLength; a++){
        if (markers[a]["busNum"] == routeToClear){
            markers[a].setMap(null);
            //setMapOnAll(null);
        }
    }
}

//THIS FUNCTION SHOWS INDIVIDUAL MARKERS BY LOOPING THROUGH THE ARRAY
function showMarkers(routeToAdd) {
    for (var b = 0, bLength = markers.length; b < bLength; b++){
        if (markers[b]["busNum"] == routeToAdd){
            markers[b].setMap(map);
            //setMapOnAll(null);
        }
        //setMapOnAll(map);
    }
}



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
