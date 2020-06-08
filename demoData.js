var fs = require("fs");
var demofile = require("demofile");
var uuid = require("uuid/v4");

const events = {
  demo: {
    GAME_END: "end",
    GAME_START: "start"
  },

  game: {
    PLAYER_HURT: "player_hurt",
    PLAYER_BLIND: "player_blind",
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
    };

    for (i = 0; i < fileAmount.length; i++) { // For each file in the array...
      if (fileAmount[i].includes(allowedFile)){ // ...check if the file is the correct file type
        console.log("Demo file loaded.");
      } else {
        console.log("Wrong fileformat. Use .dem files only.")
        process.exit();
      };
    };
  });
});

fs.readFile('demo/test.dem', (err, buffer) => {
	const demoFile = new demofile.DemoFile();
	if (err) {
		console.log(err);
		return;
  };

	// JSON variables
  let unique_grenade_ID = null;
  let grenadeCount = 0;
  let utilityData = {};
  let demoInfo = {};

	// Demo start
	demoFile.on(events.demo.GAME_START, function(e) {
    console.log('=> parsing...');

    demoInfo = {
      'Header': demoFile.header
    };
  });

	// Grenade detonations
	demoFile.gameEvents.on(events.detonations.HEGRENADE_DETONATE, function(e) {
    grenadeCount++; // Add one to the grenade count
    unique_grenade_ID = uuid(); // Random generated ID
    
    // Data array
		utilityData[unique_grenade_ID] = {
      'grenade_count': '' [{
        'grenade_type': '',
        'coordinates': {},
        'damage': {}
      }]
    };
    
    utilityData[unique_grenade_ID]['grenade_count'] = grenadeCount; // Adds grenade count
    utilityData[unique_grenade_ID]['grenade_type'] = 'hegrenade'; // Adds grenade type
    utilityData[unique_grenade_ID]['coordinates'] = {x: e.x, y: e.y, z: e.z}; // Adds coordinates for detonation
    utilityData[unique_grenade_ID]['damage'] = {health: 0, armor: 0}; // Dummy data for damage done. Remains zero of no damage is done

    demoFile.gameEvents.on(events.game.PLAYER_HURT, function(e){
      if (e.weapon = 'weapon_hegrenade'){
        utilityData[unique_grenade_ID]['damage'] = {health: e.dmg_health, armor: e.dmg_armor}; // Replaces dummy data, if the grenade did any damage
      };
    });
  });

  // Match over
  demoFile.on(events.demo.GAME_END, function(err) {
    console.log("<= Parsed");

    var utilityExport = JSON.stringify(utilityData, null, '\t'); // Prepares the utility array for JSON export
    var demoExport = JSON.stringify(demoInfo, null, '\t'); // Prepares the demo info array for JSON export
    
    fs.writeFile("json/utility.json", utilityExport, function() { // Writes JSON  
      fs.writeFile("json/demo.json", demoExport, function(err) {
        if(err) {
          return console.log(err);
        } else {
          console.log("Files saved successfully!");
        };
      });   
    });
  });

  demoFile.parse(buffer);

});