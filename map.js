let map;
let gridOverlay;
let heatOverlay;

map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8.9,
  center: new google.maps.LatLng(37.710322, -122.191684),
  gestureHandling: 'none',
  zoomControl: false
});

heatOverlay = new HeatOverlay(map);
gridOverlay = new GridOverlay(map);

/*
marker.append("text")
  .attr("x", padding + 7)
  .attr("y", padding)
  .attr("dy", ".31em")
  .text(function(d) { return d.key; });

function transform(d) {
  console.log(d.key);
  d = new google.maps.LatLng(d.value[0], d.value[1]);
  d = projection.fromLatLngToDivPixel(d);
  console.log("px:" + (d.x - padding));
  console.log("py:" + (d.y - padding));
  return d3.select(this)
    .style("left", (d.x - padding) + "px")
    .style("top", (d.y - padding) + "px");
*/