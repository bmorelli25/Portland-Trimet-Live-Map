# Portland-Trimet-Live-Map
### **[Visit the Website](https://portland-trimet-live-map.herokuapp.com/)**
---

A real time bus and rail map for public transportation in Portland, Oregon. The server consumes the [TriMet API](https://developer.trimet.org/) and utilizes web sockets to send data in real time to the client. Buses and Rail cars are populated on a map using the [Googe Maps API](https://developers.google.com).



### Important information for users:
* Buses are shown in grey and have the route number overlayed on their respective icons.
* Railcars are shown in their respective colors (Orange, Green, Red, Blue, and Yellow Lines).
* A white border indicates a South/West bound bus/train
* A black border indicates a North/East bound bus/train
* Clicking on a bus/rail icon opens an alert that displays route, direction, and scheduling information

### Technologies & Resources
**Node.js, Express, Socket.io, Javascript, CSS, HTML, Google Maps API, TriMet Developer API, Heroku**

### How it Works
* Server
  * Serves public directory on the index route via express
  * Pulls all data from TriMet's API (Every 5 seconds)
  * Loops through data, only saving what we need
  * Sends completed array via web sockets to the client

* Client
  * Upon receipt of inital data the client builds a Google Maps Marker for each and assigns it to the map
  * Markers are saved to a markers object so they can be edited later
  * Upon receipt of new data, client checks for changes in Latitude/Longitude
    * If there are changes, the markers object is updated with the new data and the location on the map is changed
