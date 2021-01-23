var fs = require("fs");
var demofile = require("demofile");

// File valdiation declarations
var file_amount = [];
const allowed_file = ".dem";
const demofile_path = "demo/";

fs.readdir(demofile_path, function (err, files) {
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

    file_amount.push(file);

    if (file_amount.length > 1){ // Checks if there is multiple files in the folder
      console.log("Too many files. Only use one file.") 
      process.exit();
    };

    for (i = 0; i < file_amount.length; i++) { // For each file in the array...
      if (file_amount[i].includes(allowed_file)){ // ...check if the file is the correct file type
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
    
  let map_data = {};
  let grenade_count = 0;

  // Gets rewritten for every round
  let round_data = generateNewround_data();

  demoFile.on("start", () => {
    console.log('=> parsing...');

    map_data.map = demoFile.header.mapName;
    map_data.totalTime = demoFile.header.playbackTime;
    map_data.tickRate = demoFile.tickRate;
  });

  demoFile.gameEvents.on("hegrenade_detonate", function(e) {
    grenade_count++; // Add one to the grenade count
    round_data.grenades.push({
      ID: grenade_count, // Unique grenade ID
      type: "HE Grenade", // Grenade type
      position: {x: e.x, y: e.y, z: e.z}, // Detonation coordinates
    });
  });
  
  demoFile.gameEvents.on("flashbang_detonate", function(e) {
    grenade_count++; // Add one to the grenade count
    round_data.grenades.push({
      ID: grenade_count, // Unique grenade ID
      type: "Flashbang", // Grenade type
      position: {x: e.x, y: e.y, z: e.z} // Detonation coordinates
    });
  });

  demoFile.gameEvents.on("inferno_startburn", function(e) {
    grenade_count++; // Add one to the grenade count
    round_data.grenades.push({
      ID: grenade_count, // Unique grenade ID
      type: "Molotov", // Grenade type
      position: {x: e.x, y: e.y, z: e.z} // Detonation coordinates
    });
  });

  demoFile.gameEvents.on("smokegrenade_detonate", function(e) {
    grenade_count++; // Add one to the grenade count
    round_data.grenades.push({
      ID: grenade_count, // Unique grenade ID
      type: "Smoke", // Grenade type
      position: {x: e.x, y: e.y, z: e.z} // Detonation coordinates
    });
  });

  demoFile.on("end", function(err) {

    let combined_data = Object.assign(map_data, round_data)
    console.log("<= Parsed");

    var utility_export = JSON.stringify(combined_data, null, '\t'); // Prepares the utility array for JSON export
    fs.writeFile("data/data.json", utility_export, function(err) {
      if(err) {
        return console.log(err);
      } else {
        console.log("Files saved successfully!");
      };  
    });
  });
  demoFile.parse(buffer);
});

function generateNewround_data() {
  return {
    grenades: []
  };
};