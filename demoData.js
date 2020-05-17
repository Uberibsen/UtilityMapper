var fs = require("fs");
var demofile = require("demofile");

fs.readFile("demo/test.dem", (err, buffer) => {
  const demoFile = new demofile.DemoFile();

  demoFile.on("start", () => {

    // Shows the demo files map
    console.log("Map:", demoFile.header.mapName);

    // Stop parsing
    demoFile.cancel();
  });

  var grenades = 0;
  
  demoFile.gameEvents.on("hegrenade_detonate", e => {
    
    // Event listeners for X and Y coordinates for HE Grenades
    grenadesx = e.x;
    grenadesy = e.y;

    // Adds 1 to grenade count
    grenades++;

    // Debug
    console.log("Grenades thrown: " + grenades);
    console.log("X: " + parseFloat(grenadesx).toFixed(2));
    console.log("Y: " + parseFloat(grenadesy).toFixed(2) + "\n");
  });

  demoFile.parse(buffer);

});