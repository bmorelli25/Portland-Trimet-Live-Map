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
