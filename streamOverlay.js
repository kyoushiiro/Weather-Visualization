/*  Alfred Lam
 *  aylam@ucsc.edu
 *  CMPS 161 - Prog 1
 *  
 *  streamOverlay.js: defines the streamline overlay, which integrates forwards
 *                    and backwards from each grid point, using bilinear interpolation
 *                    to find the velocity vectors between grid points.
 */

class StreamOverlay extends google.maps.OverlayView{

  constructor(map) {
    super();
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
    this.hide();
  }

  onAdd() {
    this.div_ = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "stream");
  }

  draw() {
    let projection = this.getProjection(),
      padding = 35;

    if(short_grid_data == null) {
      console.error("Short grid data not initialized before stream overlay!")
      return;
    }

    let grid = this.div_.append("svg")
      .attr("width", map_width)
      .attr("height", map_height)
      .style("left", ((-map_width/2 + padding)+ "px"))
      .style("top", ((-map_height/2 + padding)+ "px"))

    // step = dt used in Euler integration of grid points
    let step = 2.5;

    // integrate using each grid point in short_grid_data as a seedpoint
    for(let row = 0; row < short_grid_data.length - 1; row++) {
      for(let col = 0; col < short_grid_data[row].length - 1; col++) {

        // Pn is the current point, VPn is the x and y components of velocity at Pn
        let Pn = short_grid_data[row][col]
        let VPn = {x: Pn.speed * Pn.dirX, y: Pn.speed * Pn.dirY};

        for(let i = 0; i < 50; i++) {
          // Pn_1 represents the next point, reached after "step" seconds
          let Pn_1x = step * VPn.x + Pn.x;
          let Pn_1y = -step * VPn.y + Pn.y;

          // Draw line from (Pn.x, Pn.y) to (Pn_1x, Pn_1y)
          grid.append("line")
            .attr("x1", Pn.x)
            .attr("y1", Pn.y)
            .attr("x2", Pn_1x)
            .attr("y2", Pn_1y)
            .attr("stroke", "black");

          Pn = {x: Pn_1x, y: Pn_1y};

          // Calculate the row/col numbers of this points in short_grid_data
          let TLx = Math.floor(Pn.x / (tileX * gridX_increment));
          let TLy = Math.floor(Pn.y / (tileY * gridY_increment));

          // If TLx or TLy are out of bounds, stop.
          if(TLx < 0 || TLx > short_grid_data[row].length - 1 || TLy < 0 || TLy > short_grid_data.length - 1) {
            break;
          }
          
          let TL = short_grid_data[TLy][TLx]
          let TR = short_grid_data[TLy][TLx + 1]
          let BL = short_grid_data[TLy + 1][TLx]
          let BR = short_grid_data[TLy + 1][TLx + 1]

          VPn = biterpolate(Pn.x, Pn.y, TL, TR, BL, BR)
        }

        // Repeat the same integration process in the backwards direction
        Pn = short_grid_data[row][col]
        VPn = {x: Pn.speed * Pn.dirX, y: Pn.speed * Pn.dirY};

        for(let i = 0; i < 50; i++) {
          let Pn_1x = -step * VPn.x + Pn.x;
          let Pn_1y = step * VPn.y + Pn.y;

          // Draw line from Pn to (Pn_1x, Pn_1y)
          grid.append("line")
            .attr("x1", Pn.x)
            .attr("y1", Pn.y)
            .attr("x2", Pn_1x)
            .attr("y2", Pn_1y)
            .attr("stroke", "black");

          Pn = {x: Pn_1x, y: Pn_1y};

          // Calculate the row/col numbers of this points in short_grid_data
          let TLx = Math.floor(Pn.x / (tileX * gridX_increment));
          let TLy = Math.floor(Pn.y / (tileY * gridY_increment));

          // If TLx or TLy are out of bounds, stop.
          if(TLx < 0 || TLx > short_grid_data[row].length - 1 || TLy < 0 || TLy > short_grid_data.length - 1) {
            break;
          }
          
          let TL = short_grid_data[TLy][TLx]
          let TR = short_grid_data[TLy][TLx + 1]
          let BL = short_grid_data[TLy + 1][TLx]
          let BR = short_grid_data[TLy + 1][TLx + 1]

          VPn = biterpolate(Pn.x, Pn.y, TL, TR, BL, BR)
        }
      }
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
  
  // Hide the other overlays if this one is shown.
  show() {
    if (this.div_) {
      this.div_.selectAll("svg").attr("visibility", "visible");
      this.div_.style.visibility = 'visible';
      stationsOverlay.hide();
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

// Returns the linearly interpolated velocity value at P(x, y) from known points
// TL - top left
// TR - top right
// BL - bot left
// BR - bot right
// Each of TL,TR,BL,BR must have a .x, .y, .speed, .dirX, and .dirY component.
function biterpolate(x, y, TL, TR, BL, BR) {
  let xDist = TR.x - TL.x;
  let yDist = BR.y - TR.y;

  // First interpolate the x values, with TM = top middle, and BM = bottom middle, relative to the 4 corners
  let TMx = ((x - TL.x) * (TR.speed * TR.dirX) / xDist) +
    ((TR.x - x) * (TL.speed * TL.dirX) / xDist);
  let TMy = ((x - TL.x) * (TR.speed * TR.dirY) / xDist) +
    ((TR.x - x) * (TL.speed * TL.dirY) / xDist);

  let BMx = ((x - BL.x) * (BR.speed * BR.dirX) / xDist) +
    ((BR.x - x) * (BL.speed * BL.dirX) / xDist);
  let BMy = ((x - BL.x) * (BR.speed * BR.dirY) / xDist) +
    ((BR.x - x) * (BL.speed * BL.dirY) / xDist);

  // Now interpolate the calculated Middle values by Y. 
  let newVx = ((y - TL.y) * BMx / yDist) + ((BL.y - y) * TMx / yDist);
  let newVy = ((y - TL.y) * BMy / yDist) + ((BL.y - y) * TMy / yDist);

  // Return the interpolated Vx and Vy components, located at P(x, y)
  return {x: newVx, y: newVy};
}