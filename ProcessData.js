var google = require('googleapis');
let busArray = [];
var processData = {
  go: function(vehicleData){
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
          let marker = new google.maps.Marker({
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

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
        }
      };

    vehicleData.forEach(function(vd){
      if(vd.nextStopSeq === null) return;

      let bus = new Vehicle(vd);
      busArray.push(bus);
      bus.createMarker();
    });

    console.log(busArray);
  }
};

module.exports = processData;
