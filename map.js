/*  Alfred Lam
 *  aylam@ucsc.edu
 *  CMPS 161 - Prog 1
 *  
 *  map.js: this file creates the initial google map, as well as 
 *          the heatmap, grid, and station overlays that go on
 *          top of it.
 */

let map;
let gridOverlay;
let heatOverlay;
let stationsOverlay;
let streamOverlay;

// Create a new Google Map with locked zoom and pan, centered in the Bay Area
map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8.9,
  center: new google.maps.LatLng(37.710322, -122.191684),
  gestureHandling: 'none',
  zoomControl: false
});

// Create the 4 overlays needed to complete the assignment
heatOverlay = new HeatOverlay(map);
stationsOverlay = new StationsOverlay(map);
gridOverlay = new GridOverlay(map);
streamOverlay = new StreamOverlay(map);
