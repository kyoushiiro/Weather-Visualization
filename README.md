User Documentation

Alfred Lam

This program utilizes D3.js and Google Maps API to present a visualization of the wind field in the Bay Area on February 3 at 7am, based off of data collected from weather stations from the Bay Area Air Quality Management.

The user may interact with the program by selecting 1 of 3 displays through the buttons at the top of the webpage:
  1) Station Data: This displays an arrow glyph at each station that data was gathered from, with its color and size representing the wind speed magnitude.
  2) Interpolated Grid: This displays an arrow glyph at each grid point on a variably sized grid, with each point having data calculated using Shepard's interpolation on the known data points.
  3) Streamlines: This displays streamlines that show the predicted path of a given particle over time, calculated using Euler integration on each grid point as seedpoints.

The user may also choose to toggle a heatmap, colored from yellow to red, representing lower to higher wind speed magnitudes respectively. This heatmap may be turned on along with 1 of the 3 displays above simultaneously.

Comments:

The initial webpage starts out with all 4 displays on, and may take a bit of time to load. Please click on one of the buttons after loading to see 1 visualization clearly.

Opening the developer console while on the program page may cause strange artifacts to appear. 

If the map shows a black screen, please reload the page.


