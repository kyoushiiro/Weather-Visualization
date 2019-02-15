/*  Alfred Lam
 *  aylam@ucsc.edu
 *  CMPS 161 - Prog 1
 *  
 *  stationsOverlay.js: this file defines the weather stations overlay, displaying
 *                      an arrow glyph for every weather station we have data for.
 */

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

    // Define the arrowhead for arrow glyphs (with a unique ID from the arrows used for gridOverlay)
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
      .data(new_station_data).enter()
    
    // Create 2 arrows per data point, one for a border and one for the actual arrow
    lines.append("line").each(transform)
      .attr("stroke-width", "4.5px")
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrowhead2)")

    lines.append("line").each(transform)
      .attr("stroke-width", "3.5px")
      .attr("marker-end", "url(#arrowhead2)")

    // Label each point with its location name
    lines.insert("text").each(transformText)
      .attr("dy", ".15em")
      .text(function(d) { return d.key; });

    // these transform functions make it easier to position the arrows/text accordingly
    function transform(d) {
      let b = Math.pow((16-d.speed), 1.6) * 10.3;
      let baseLineSizeX = 10;
      if(d.value.x < 0) {
        baseLineSizeX *= -1;  
      }
      let baseLineSizeY = 10;
      if(d.value.y > 0) {
        baseLineSizeY *= -1;  
      }
      return d3.select(this)
        .attr("x1", (d.value.x + map_width/2 - padding - map_width/2))
        .attr("y1", (d.value.y + map_height/2 - padding - map_height/2))
        .attr("x2", (d.value.x + map_width/2 + d.speed * d.direction.x * 10 + baseLineSizeX - padding - map_width/2))
        .attr("y2", (d.value.y + map_height/2 + d.speed * d.direction.y * 10 + baseLineSizeY- padding - map_height/2))
        .attr("stroke", ("rgba(255, " + b + ", 0, 1") )
    }

    function transformText(d) {
      //d = new google.maps.LatLng(d.value[0], d.value[1]);
      //d = projection.fromLatLngToDivPixel(d);
      return d3.select(this)
        .attr("x", (d.value.x + map_width/2 - padding - map_width/2))
        .attr("y", (d.value.y + map_height/2 - padding + 15 - map_height/2))
    }
  }

  onRemove() {
    this.div_.parentNode.removeChild(this.div_);
  }
  
  hide() {
    if (this.div_) {
      this.div_.selectAll("svg").attr("visibility", "hidden");
      this.div_.style.visibility = 'hidden';
    }
  }
  
  // Hide the other overlays if this one is displayed.
  show() {
    if (this.div_) {
      this.div_.selectAll("svg").attr("visibility", "visible");
      this.div_.style.visibility = 'visible';
      gridOverlay.hide();
      streamOverlay.hide();
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