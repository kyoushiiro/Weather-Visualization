class StationsOverlay extends google.maps.OverlayView{

  constructor(map) {
    super();
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
  }

  onAdd() {
    this.div_ = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "stations");
  }

  draw() {
    if(station_data == null) {
      console.error("Station data not initialized before overlay!");
      return;
    }

    let projection = this.getProjection(),
      padding = map_padding;

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
      .attr("fill", "black");
    
    let lines = grid.selectAll("line")
      .data(d3.entries(station_data)).enter().append("line").each(transform)
      .attr("class", "arrows")
      .attr("stroke-width", "4.5px")
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrowhead)")

    function transform(d) {
      d = new google.maps.LatLng(d.value[0], d.value[1]);
      d = projection.fromLatLngToDivPixel(d);
      console.log("x:" + (d.x-padding));
      console.log("y:" + (d.y-padding));
      return d3.select(this)
        .attr("x1", (d.x + map_width/2 - padding))
        .attr("y1", (d.y + map_height/2 - padding))
        .attr("x2", (d.x + map_width/2 + 10 - padding))
        .attr("y2", (d.y + map_height/2 + 10 - padding))
        //.attr("transform", ("translate(" + d.x + map_width/2 + "," + d.y + map_height/2 + ")"))
    }
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