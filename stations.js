let station_data = null;
let calculated_grid_data = null;
let short_grid_data = null;
let new_station_data = null;
let map_padding = 40;
let map_width = window.outerWidth + map_padding, map_height = window.outerHeight + map_padding;
let gridX_increment = 6, gridY_increment = 10;

// Loads station data into global variable station_data.
d3.json("STATION_JSON.json", function(error, data) {
  if (error) throw error;
  station_data = data;
});

// Returns a 2 dimensional array with wind speeds/directions for a grid
// of size grid_height x grid_width, using Shephards interpolation on data.
// Also stores a shortened version of the grid in short_grid_data.
// Finally, converts station_data to pixel units in new_station_data.
function calc_grid(projection, data, grid_width, grid_height) {

  let stepX = parseInt(map_width/grid_width);
  let stepY = parseInt(map_height/grid_height);
  let new_data = new Array();
  short_grid_data = new Array();
  let lowest = 100, highest = 0;

  new_station_data = [];

  // Calculate the pixel x/y coordinates of the stations, and converts
  // direction in degrees to an x and y component. 
  for(let station in data) {
    let latlng = new google.maps.LatLng(data[station][0], data[station][1]);
    let pxStation = projection.fromLatLngToDivPixel(latlng);
    pxStation.x += map_width/2;
    pxStation.y += map_height/2;

    let direction = data[station][3];

    let dirX = Math.cos((270 - direction) / Math.PI * 180);
    let dirY = Math.sin((270 - direction) / Math.PI * 180);

    // key : name of station
    // value: x/y position in pixels
    // direction: x/y components of the wind angle
    new_station_data.push({
      key: station,
      value: pxStation,
      speed: data[station][2],
      direction: {x: dirX, y: dirY}
    })
  }

  for(let row = 0; row < grid_height; row++) {
    new_data.push(new Array());
    
    if(row%gridY_increment == 0) {
      short_grid_data.push(new Array());
    }

    for(let col = 0; col < grid_width; col++) {
      let pxX = col * stepX;
      let pxY = row * stepY;

      let invDistSum = 0;
      let numeratorSum = 0;
      let dirXSum = 0, dirYSum = 0;
      
      for(let station in new_station_data) {
        let distance = Math.sqrt(Math.pow((pxX - new_station_data[station].value.x), 2) + Math.pow((pxY - new_station_data[station].value.y), 2));
        let invDist = 1 / distance;
        invDistSum += invDist;
        numeratorSum += invDist * new_station_data[station].speed;

        let direction = new_station_data[station].direction;
        dirXSum += invDist * direction.x;
        dirYSum += invDist * direction.y;
      }

      new_data[row].push({
        x: pxX,
        y: pxY,
        speed: numeratorSum / invDistSum,
        dirX: dirXSum / invDistSum,
        dirY: dirYSum / invDistSum 
      });

      if(col % gridX_increment == 0 && row % gridY_increment == 0) {
        short_grid_data[row/gridY_increment].push({
          x: pxX,
          y: pxY,
          speed: numeratorSum / invDistSum,
          dirX: dirXSum/invDistSum,
          dirY: dirYSum/invDistSum
        });
      }
    }
  }
  console.log(short_grid_data);
  return new_data;
}