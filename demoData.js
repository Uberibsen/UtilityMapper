var fs = require("fs");
var demofile = require("demofile");

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
    
  let mapData = {};
  let grenadeCount = 0;

  // Gets rewritten for every round
  let roundData = generateNewRoundData();

  demoFile.on("start", () => {
    console.log('=> parsing...');

    mapData.map = demoFile.header.mapName;
    mapData.totalTime = demoFile.header.playbackTime;
    mapData.tickRate = demoFile.tickRate;
  });

  demoFile.gameEvents.on("hegrenade_detonate", function(e) {
    grenadeCount++; // Add one to the grenade count
    roundData.grenades.push({
      ID: grenadeCount, // Unique grenade ID
      type: "HE Grenade", // Grenade type
      position: {x: e.x, y: e.y, z: e.z}, // Detonation coordinates
    });
  });
  
  demoFile.gameEvents.on("flashbang_detonate", function(e) {
    grenadeCount++; // Add one to the grenade count
    roundData.grenades.push({
      ID: grenadeCount, // Unique grenade ID
      type: "Flashbang", // Grenade type
      position: {x: e.x, y: e.y, z: e.z} // Detonation coordinates
    });
  });

  demoFile.gameEvents.on("smokegrenade_detonate", function(e) {
    grenadeCount++; // Add one to the grenade count
    roundData.grenades.push({
      ID: grenadeCount, // Unique grenade ID
      type: "Smoke", // Grenade type
      position: {x: e.x, y: e.y, z: e.z} // Detonation coordinates
    });
  });

  demoFile.on("end", function(err) {

    let combinedData = Object.assign(mapData, roundData)
    console.log("<= Parsed");

    var utilityExport = JSON.stringify(combinedData, null, '\t'); // Prepares the utility array for JSON export
    fs.writeFile("data/data.json", utilityExport, function(err) {
      if(err) {
        return console.log(err);
      } else {
        console.log("Files saved successfully!");
      };  
    });
  });
  demoFile.parse(buffer);
});

function generateNewRoundData() {
  return {
    grenades: []
  };
};