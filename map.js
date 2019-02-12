let map;
let overlay;

GridOverlay.prototype = new google.maps.OverlayView();
    
map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8.9,
  center: new google.maps.LatLng(37.710322, -122.191684),
  gestureHandling: 'none',
  zoomControl: false
});

overlay = new GridOverlay(map);

function GridOverlay(map) {
  // Now initialize all properties.
  this.map_ = map;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;

  // Explicitly call setMap on this overlay
  this.setMap(map);
}

GridOverlay.prototype.onAdd = function() {
  this.div_ = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "grid");
};

GridOverlay.prototype.draw = function() {
  let projection = this.getProjection(),
      padding = 35;

  let grid = this.div_.append("svg")
    .attr("width", 1920)
    .attr("height", 720)
    .style("left", (-460 + "px"))
    .style("top", (-360 + "px"))

  let defs = grid.append("defs");
  defs.append("marker")
    .attr("id","arrowhead")
    .attr("viewBox","0 -5 10 10")
    .attr("refX", 5).attr("refY", 0)
    .attr("markerWidth", 4).attr("markerHeight", 4)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0, -5L10,0L0,5")
    .attr("fill", "red");

  grid.selectAll("g")
    .data(grid_data)
    .enter().append("g")
    .attr("transform", function (d, i) {
      return "translate(" + 0 + " " + d[i].y + ")"
    })
    .selectAll("line")
    .data(function(d) {return d;})
    .enter()
    .append("line")
      .attr("class", "arrows")
      .attr("x1", function(d) { return (d.x + "px") })
      .attr("x2", function(d) { return ((d.x + 20) + "px") })
      .attr("y1", 0 + padding)
      .attr("y2", 10 + padding)
      .attr("stroke-width", "2.5px")
      .attr("stroke", "red")
      .attr("marker-end", "url(#arrowhead)")
}

GridOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
};

// Set the visibility to 'hidden' or 'visible'.
GridOverlay.prototype.hide = function() {
  if (this.div_) {
    // The visibility property must be a string enclosed in quotes.
    this.div_.selectAll("svg").attr("visibility", "hidden");
    this.div_.style.visibility = 'hidden';
  }
};

GridOverlay.prototype.show = function() {
  if (this.div_) {
    this.div_.selectAll("svg").attr("visibility", "visible");
    this.div_.style.visibility = 'visible';
  }
};

GridOverlay.prototype.toggle = function() {
  if (this.div_) {
    if (this.div_.style.visibility === 'hidden') {
      this.show();
    } else {
      this.hide();
    }
  }
};
/*
let overlay = new google.maps.OverlayView();

overlay.onAdd = function() {
  let layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "grid");

  overlay.draw =  function() {
    let projection = this.getProjection(),
      padding = 35;

    let grid = layer.append("svg")
      .attr("width", 1920)
      .attr("height", 720)
      .style("left", (-460 + "px"))
      .style("top", (-360 + "px"))

    let defs = grid.append("defs");
    defs.append("marker")
      .attr("id","arrowhead")
      .attr("viewBox","0 -5 10 10")
      .attr("refX", 5).attr("refY", 0)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0, -5L10,0L0,5")
      .attr("fill", "red");

    grid.selectAll("g")
      .data(grid_data)
      .enter().append("g")
      .attr("transform", function (d, i) {
        return "translate(" + 0 + " " + d[i].y + ")"
      })
      .selectAll("line")
      .data(function(d) {return d;})
      .enter()
      .append("line")
        .attr("class", "arrows")
        .attr("x1", function(d) { return (d.x + "px") })
        .attr("x2", function(d) { return ((d.x + 20) + "px") })
        .attr("y1", 0 + padding)
        .attr("y2", 10 + padding)
        .attr("stroke-width", "2.5px")
        .attr("stroke", "red")
        .attr("marker-end", "url(#arrowhead)")
*/
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
//  };
//};

function addOverlay() {
  overlay.setMap(map);
}

function removeOverlay() {
  overlay.setMap(null);
}