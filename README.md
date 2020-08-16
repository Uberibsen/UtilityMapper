# UtilityMapper
*This project is currently under development. Stay tuned for updates.*
This project is focused around the mapping of utility usage from CS:GO demo files. Feel free to contribute!

## Current functionality
The program currently reads a `.dem` demofile from the directory `/demo` in the `demoData.js` file. This file listens and extracts predefined game events. In this case, it is whenever a HE grenade is detonated. This event has multiple attributes. For now, the code only extracts `x`, `y`, and `z` coordinates from which the HE grenade was detonated. These coordinates are then sequentially pushed into an array, and exported to a `json` file.

The exported `json` file is then read by the `heatmapExport.py` file. This file reads the nested json file and appends the data into separate arrays containing the `x` and `y` coordinates. These two arrays values are then converted into values that can be mapped onto a 1024px x 1024pw wide image of the map of which the data originates. The converted values are finally read by `seaborn`, which maps the image with dots representing the coordinates in which the grenades were detonated. The final result is exported to a `.png` image in the `/export` folder.

### Planned features:
- Heatmap generator of utility usage
	- Grenade damage
	- Grenade hits
	- Effective flashes
- Export to image files

### Checklist
-  [x] Demo data extraction using [demofile](https://github.com/saul/demofile)
	- [x] Grenade coordinates
	- [ ] HE grenade damage
	- [ ] Time flashbanged
-  [x] JSON parsing from JS
-  [x] JSON data extraction in Python
-  [x] Image export
- [x] Multi map support
	- [x] de_inferno
	- [x] de_dust2
	- [x] de_train
	- [x] de_mirage
	- [x] de_overpass
	- [x] de_cache
- [ ] Multi grenade type support
	- [x] HE Grenade
	- [ ] Flashbang
	- [ ] Smoke
	- [ ] Molotov/Fire
- [ ] Grenade damage mapping

### Special thanks
Thank you to Bill Freeman for providing the values for converting global coordinates to the range of the image resolution. See his project [here](https://www.kaggle.com/billfreeman44/finding-classic-smokes-by-t-side-on-mirage)