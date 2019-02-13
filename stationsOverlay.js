class StationsOverlay extends google.maps.OverlayView{

  constructor(map) {
    super();
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
  }

  onAdd() {
    this.div_ = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "grid");
  }

  draw() {
    let projection = this.getProjection(),
      padding = 35;

    let grid = this.div_.append("svg")
      .attr("width", map_width)
      .attr("height", map_height)
      .style("left", ((-map_width/2 + padding)+ "px"))
      .style("top", ((-map_height/2 + padding)+ "px"))

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

    grid.selectAll("line")
      .data(station_data)
      .enter().append("line")
        .attr("class", "arrows")
        .attr("x1", transform)
        .attr("x2", function(d) { 
          return ((d.x + d.speed * 6) + "px") 
        })
        .attr("y1", 0 + padding)
        //.attr("y2", 10 + padding)
        .attr("y2", function(d) {
          return ((d.speed * 6) + "px")
        })
        .style("visibility", function(d, i) {
          if (i%10 != 0) {
            return "hidden";
          }
        })
        .attr("stroke-width", "2.5px")
        .attr("stroke", "red")
        .attr("marker-end", "url(#arrowhead)")
  }

  onRemove() {
    this.div_.parentNode.removeChild(this.div_);
  }
  
  // Set the visibility to 'hidden' or 'visible'.
  hide() {
    if (this.div_) {
      // The visibility property must be a string enclosed in quotes.
      this.div_.selectAll("svg").attr("visibility", "hidden");
      this.div_.style.visibility = 'hidden';
    }
  }
  
  show() {
    if (this.div_) {
      this.div_.selectAll("svg").attr("visibility", "visible");
      this.div_.style.visibility = 'visible';
    }
  }
  
  toggle() {
    if (this.div_) {
      if (this.div_.style.visibility === 'hidden') {
        this.show();
      } else {
        this.hide();
      }
    }
  }
}