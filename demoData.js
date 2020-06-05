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
  let grenade_number = 0;
  let data = {};

	// Demo start
	demoFile.on(events.demo.GAME_START, function(e) {
    console.log('=> parsing...');
  });

	// Grenade detonations
	demoFile.gameEvents.on(events.detonations.HEGRENADE_DETONATE, function(e) {
    grenade_number++; // Add one to the grenade count
    
    // Data array
		data[grenade_number] = {
      'grenade_type': '',
      'coordinates': {},
      'damage': {}
    };
    
    data[grenade_number]['coordinates'] = {x: e.x, y: e.y, z: e.z}; // Adds coordinates for detonation
    data[grenade_number]['damage'] = {health: 0, armor: 0}; // Dummy data for damage done. Remains zero of no damage is done

    demoFile.gameEvents.on(events.game.PLAYER_HURT, function(e){
      if (e.weapon = 'weapon_hegrenade'){
        data[grenade_number]['grenade_type'] = e.weapon; // Adds grenade type
        data[grenade_number]['damage'] = {health: e.dmg_health, armor: e.dmg_armor}; // Replaces dummy data, if the grenade did any damage
      };
    });
  });

  // Match over
  demoFile.on(events.demo.GAME_END, function(err) {
    console.log("<= Parsed");

    var jsonExport = JSON.stringify(data, null, '\t'); // Prepares the data array for JSON export

    fs.writeFile("json/demoData.json", jsonExport, function(err) { // Writes JSON
      if(err) {
          return console.log(err);
      } else {
        console.log("File saved successfully!");
      };
    });
  });

  demoFile.parse(buffer);

});