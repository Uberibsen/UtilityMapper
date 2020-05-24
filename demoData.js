var fs = require("fs");
var demofile = require("demofile");

const events = {
  demo: {
    GAME_END: "end",
    GAME_START: "start"
  },

  game: {
    PLAYER_HURT: "player_hurt",
    PLAYER_BLIND: "player_blind",
    PLAYER_DAMAGED: "e.dmg_health"
  },

  detonations: {
    HEGRENADE_DETONATE: "hegrenade_detonate",
    FLASHBANG_DETONATE: "flashbang_detonate",
    SMOKE_DETONATE: "smokegrenade_detonate",
    MOLOTOV_DETONATE: "molotov_detonate"
  },

  grenades: {
    HEGRENADE: "weapon_hegrenade",
    FLASHBANG: "weapon_flashbang",
    SMOKE: "weapon_smokegrenade",
    MOLOTOV: "weapon_molotov"
  }
}

// File valdiation declarations
var fileAmount = [];
const allowedFile = ".dem";
const demoFilepath = "demo/";

fs.readdir(demoFilepath, function (err, files) {
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
    console.log("Demo file failed to load: " + err);
    return;
  }

  // Variables for JSON export
  var grenadesThrown = 0;
  const current_nade = null;
  let nades = {};

  // Demo start
  demoFile.on("start", () => {
    console.log('=> Parsing...');
    var mapID = demoFile.header.mapName;

    // Main data array
    nades[current_nade] = {
      'map': '',
      'type': '',
      'grenadeid': grenadesThrown,
      'damage': {},
      'coordinates': {}
    }
    nades[current_nade]['map'] = mapID; // Write current map
  });

  // HE grenade detonation
  demoFile.gameEvents.on(events.detonations.HEGRENADE_DETONATE, function(e) {

    // Adds 1 to grenade count and pushes
    grenadesThrown++;
    nades[current_nade]['grenadeid'] = grenadesThrown;

    // Write coordinates
    nades[current_nade]['coordinates'] = {x: e.x, y: e.y};
  });

  // Grenade damage
  demoFile.gameEvents.on(events.game.PLAYER_HURT, function(e) {
    if (e.weapon = 'weapon_hegrenade'){
      nades[current_nade]['damage'] = {health: e.dmg_health, armor: e.dmg_armor}; // Write damage done
      nades[current_nade]['type'] = e.weapon; // Write grenade type
    }
  });

  // Match over
  demoFile.on(events.demo.GAME_END, function() {
    console.log('<= Parsed');

    var jsonExport = JSON.stringify(nades, null, '\t'); // Prepares the data array for JSON export

    fs.writeFile("json/demoData.json", jsonExport, function(err) { // Writes JSON
      if(err) {
          return console.log(err);
      } else {
        console.log("File saved successfully!");
      }
    });
  });

  demoFile.parse(buffer);

});