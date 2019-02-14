let map;
let gridOverlay;
let heatOverlay;
let stationsOverlay;

map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8.9,
  center: new google.maps.LatLng(37.710322, -122.191684),
  gestureHandling: 'none',
  zoomControl: false
});

heatOverlay = new HeatOverlay(map);
stationsOverlay = new StationsOverlay(map);
gridOverlay = new GridOverlay(map);
