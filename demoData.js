var fs = require("fs");
var demofile = require("demofile");

const events = {
  demo: {
    GAME_END: "cs_win_panel_match"
  },

  game: {
    PLAYER_HURT: "player_hurt",
    PLAYER_BLIND: "player_blind"
  },

  entities: {
    GRENADE_DETONATE: "hegrenade_detonate",
    FLASHBANG_DETONATE: "flashbang_detonate",
    SMOKE_DETONATE: "smokegrenade_detonate",
    MOLOTOV_DETONATE: "molotov_detonate"
  }
}

var fileAmount = [];
const allowedFile = ".dem";
const filepath = "demo/";

fs.readdir(filepath, function (err, files) {
  if (err) {
    console.log(err);
    return;
  } else {
    if (!files.length) { // Checks if the demo folder is empty
      console.log("Demo folder empty. Please insert demofile and try again");
      process.exit();
    }
  }

  files.forEach(file => { // For each file found, push them into an array

    fileAmount.push(file);

    if (fileAmount.length > 1){ // Checks if there is multiple files in the folder
      console.log("Too many files. Only use one file.") 
      process.exit();
    }

    for (i = 0; i < fileAmount.length; i++) { // For each file in the array
      if (fileAmount[i].includes(allowedFile)){ // check if the file is the correct format
        console.log("Demo file loaded.");
      } else {
        console.log("Wrong fileformat. Use .dem files only.")
        process.exit();
      }
    }
  });
});

fs.readFile("demo/test.dem", (err, buffer) => {
  let demoFile = new demofile.DemoFile();

  if (err) {
    console.log(err);
    return;
  }

  // Demo start
  demoFile.on("start", () => {

    // Shows the demo files map
    console.log("Map:", demoFile.header.mapName + "\n");

    // Stop parsing
    demoFile.cancel();
  });

  var grenades = 0;
  
  // Grenade detonate event
  demoFile.gameEvents.on(events.entities.GRENADE_DETONATE, e => {
    
    // Event listeners for X and Y coordinates for HE Grenades
    var grenadesx = e.x;
    var grenadesy = e.y;

    // Adds 1 to grenade count
    grenades++;

    // Debug
    console.log("Grenades thrown: " + grenades);
    console.log("X: " + parseFloat(grenadesx).toFixed(2));
    console.log("Y: " + parseFloat(grenadesy).toFixed(2) + "\n");

  });

  // Match over
  demoFile.gameEvents.on(events.demo.GAME_END, e => {
    process.exit()
  });

  demoFile.parse(buffer);

});