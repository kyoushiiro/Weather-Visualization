let station_data;

// Load station data
d3.json("STATION_JSON.json", function(error, data) {
  if (error) throw error;

  station_data = data;
  console.log("Original Station Data: ");
  console.log(station_data);
});

let tileSizeX = 60;
let tileSizeY = 50;

// Creates a 100 x 100 grid
let grid_data = new Array();
let xPos = 0;
let yPos = 0;
for(let row = 0; row < 15; row++) {
  grid_data.push( new Array() );
  for(let col = 0; col < 15; col++) {
    grid_data[row].push({
      x : xPos,
      y : yPos
    });
    xPos += tileSizeX;
  }
  xPos = 0;
  yPos += tileSizeY;
}
console.log(grid_data);