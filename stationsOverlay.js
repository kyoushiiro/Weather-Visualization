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

    console.log(new_station_data);
    let projection = this.getProjection(),
      padding = map_padding;

    let grid = this.div_.append("svg")
      .attr("width", map_width)
      .attr("height", map_height)
      .style("left", ((-map_width/2 + padding)+ "px"))
      .style("top", ((-map_height/2 + padding)+ "px"))

    let defs = grid.append("defs");
    defs.append("marker")
      .attr("id","arrowhead2")
      .attr("viewBox","0 -5 10 10")
      .attr("refX", 5).attr("refY", 0)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0, -5L10,0L0,5")
      .attr("fill", "black");
    
    let lines = grid.selectAll("line")
      .data(d3.entries(station_data)).enter()

    lines.append("line").each(transform)
      .attr("stroke-width", "3.5px")
      .attr("marker-end", "url(#arrowhead2)")

    lines.insert("text").each(transformText)
      .attr("dy", ".15em")
      .text(function(d) { return d.key; });

    function transform(d) {
      let b = Math.pow((16-d.value[2]), 1.6) * 10.3;
      d = new google.maps.LatLng(d.value[0], d.value[1]);
      d = projection.fromLatLngToDivPixel(d);
      return d3.select(this)
        .attr("x1", (d.x + map_width/2 - padding))
        .attr("y1", (d.y + map_height/2 - padding))
        .attr("x2", (d.x + map_width/2 + 20 - padding))
        .attr("y2", (d.y + map_height/2 + 20 - padding))
        .attr("stroke", ("rgba(255, " + b + ", 0, 1") )
    }

    function transformText(d) {
      d = new google.maps.LatLng(d.value[0], d.value[1]);
      d = projection.fromLatLngToDivPixel(d);
      return d3.select(this)
        .attr("x", (d.x + map_width/2 - padding))
        .attr("y", (d.y + map_height/2 - padding + 35))
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
      heatOverlay.hide();
      gridOverlay.hide();
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