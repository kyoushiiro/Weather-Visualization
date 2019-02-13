let calculated_grid_data = null;
let grid_width = 100, grid_height = 100;

class HeatOverlay extends google.maps.OverlayView{
  constructor(map) {
    super();
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
  }

  onAdd() {
    this.div_ = d3.select(this.getPanes().mapPane).append("div").attr("class", "heatmap");
  }

  draw() {
    let projection = this.getProjection(),
      padding = 35;

    if(calculated_grid_data == null) { 
      calculated_grid_data = calc_grid(projection, station_data, grid_width, grid_height);
    }

    let grid = this.div_.append("svg")
      .attr("width", map_width)
      .attr("height", map_height)
      .style("left", ((-map_width/2 + map_padding) + "px"))
      .style("top", ((-map_height/2 + map_padding)+ "px"))

    grid.selectAll("g")
      .data(calculated_grid_data)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + 0 + " " + d[i].y + ")"
      })
      .selectAll("square")
      .data(function(d) { return d; })
      .enter()
      .append("rect").attr("class", "square")
        .attr("x", function(d) { return d.x })
        .attr("width", parseInt(map_width/grid_width))
        .attr("height", parseInt(map_height/grid_height))
        .style("fill", function(d) { return ("rgba(255, " + (Math.pow((13.8-d.speed), 1.6) * 10.3)+ ", 0, 0.35") });
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