class GridOverlay extends google.maps.OverlayView{

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

    if(calculated_grid_data == null) { 
      calculated_grid_data = calc_grid(projection, station_data, grid_width, grid_height);
    }

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

    let lines = grid.selectAll("g")
      .data(calculated_grid_data)
      .enter().append("g")
      .style("visibility", function(d, i) {
        if (i%gridY_increment!= 0) {
          return "hidden";
        }
      })
      .attr("transform", function (d, i) {
        return "translate(" + 0 + " " + d[i].y + ")"
      })
      .selectAll("line")
      .data(function(d) {return d;})
      .enter()
    
    lines.append("line")
      .attr("class", "arrows")
      .attr("x1", function(d) { return (d.x + "px") })
      .attr("x2", function(d) { 
        let baseLineSize = 10;
        if(d.dirX < 0) {
          baseLineSize *= -1;  
        }
        return ((d.x + d.speed * d.dirX * 10 + baseLineSize) + "px") 
      })
      .attr("y1", padding)
      .attr("y2", function(d) {
        let baseLineSize = 10;
        if(d.dirY > 0) {
          baseLineSize *= -1;  
        }
        return ((padding + d.speed * -d.dirY * 10 + baseLineSize) + "px")
      })
      .style("visibility", function(d, i) {
        if (i%gridX_increment != 0) {
          return "hidden";
        }
      })
      .attr("stroke-width", "4.5px")
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrowhead)")

    lines.insert("line")
      .attr("class", "arrows")
      .attr("x1", function(d) { return (d.x + "px") })
      .attr("x2", function(d) { 
        let baseLineSize = 10;
        if(d.dirX < 0) {
          baseLineSize *= -1;  
        }
        return ((d.x + d.speed * d.dirX * 10 + baseLineSize) + "px") 
      })
      .attr("y1", 0 + padding)
      .attr("y2", function(d) {
        let baseLineSize = 10;
        if(d.dirY > 0) {
          baseLineSize *= -1;  
        }
        return ((padding + d.speed * -d.dirY * 10 + baseLineSize) + "px")
      })
      .style("visibility", function(d, i) {
        if (i%6 != 0) {
          return "hidden";
        }
      })
      .attr("stroke-width", "3.5px")
      .attr("stroke", function(d) { return("rgba(255, " + (Math.pow((13.8-d.speed), 1.6) * 10.3)+ ", 0, 1") })
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