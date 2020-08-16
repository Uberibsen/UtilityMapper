import os
import json
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("CS:GO Grenade Heatmap Plotter")

    # Checks if the 'json' folder is empty
    if len(os.listdir('data/') ) == 0:
        print("Input folder is empty. Please insert JSON file")
        exit()
    else:    
        pass
        print("JSON file located.")

    x_coor = []
    y_coor = []
    playedMap = []
    supportedMaps = ["de_inferno", "de_mirage", "de_dust2", "de_train", "de_overpass", "de_cache", "de_cbble"]
    
    # Opens JSON data file
    with open('data/data.json') as json_file:
        data = json.load(json_file)
        print("JSON file loaded. Parsing data...")
        for demoMap in data["map"]:
            playedMap.append(demoMap) # Appends map object
        for coordinate in data["grenades"]:
            x_coor.append(coordinate['position']['x']) # Appends x coordinates
            y_coor.append(coordinate['position']['y']) # Appends y coordinates
    currentMap = ''.join(playedMap) # Concises map name

    # Checks if the data is from a supported map
    if currentMap in supportedMaps:
        pass
    else:
        print("Map not supported. Closing program")
        exit()
    print("Data parsed.")

    # Used to convert absolute x coordinates to for minimap image resolution
    def pointx_to_resolutionx(xinput, startX, endX, resX):
        sizeX = endX - startX
        if startX < 0:
            xinput += startX *(-1.0)
        else:
            xinput += startX
        xoutput = ((xinput / abs(sizeX)) * resX)
        return xoutput

    # Used to convert absolute y coordinates to for minimap image resolution
    def pointy_to_resolutiony(yinput, startY, endY, resY):
        sizeY = endY - startY
        if startY < 0:
            yinput += startY *(-1.0)
        else:
            yinput += startY
        youtput = ((yinput / abs(sizeY)) * resY)
        return resY - youtput

    def coordinateProcessor(mapOrder): # Rounds every element in coordinate array to nearest whole and converts coordinate to number in range of the image resolution 
        for i in range (0, len(x_coor)):
            x_coor[i] = pointx_to_resolutionx(int(float(x_coor[i])),(mapsInfo["data"][mapOrder]["values"]["startX"]),(mapsInfo["data"][mapOrder]["values"]["endX"]),(mapsInfo["data"][mapOrder]["values"]["resX"]))
        for i in range (0, len(y_coor)):
            y_coor[i] = pointy_to_resolutiony(int(float(y_coor[i])),(mapsInfo["data"][mapOrder]["values"]["startY"]),(mapsInfo["data"][mapOrder]["values"]["endY"]),(mapsInfo["data"][mapOrder]["values"]["resY"]))

    with open('json/maps.json') as map_file: # Loads values used for coordinate conversion
        mapsInfo = json.load(map_file)

    if currentMap == "de_mirage":
        img = plt.imread('maps/de_mirage.png')
        print("Plotting data...")
        mapOrder = 0 # Matches the chronological order of the maps in the 'maps.json' file
        coordinateProcessor(mapOrder)

    elif currentMap == "de_inferno":
        img = plt.imread('maps/de_inferno.png')
        print("Plotting data...")
        mapOrder = 1
        coordinateProcessor(mapOrder)

    elif currentMap == "de_dust2":
        img = plt.imread('maps/de_dust2.png')
        print("Plotting data...")
        mapOrder = 2
        coordinateProcessor(mapOrder)

    elif currentMap == "de_train":
        img = plt.imread('maps/de_train.png')
        print("Plotting data...")
        mapOrder = 3
        coordinateProcessor(mapOrder)

    elif currentMap == "de_overpass":
        img = plt.imread('maps/de_overpass.png')
        print("Plotting data...")
        mapOrder = 4
        coordinateProcessor(mapOrder)

    elif currentMap == "de_cache":
        img = plt.imread('maps/de_cache.png')
        print("Plotting data...")
        mapOrder = 5
        coordinateProcessor(mapOrder)

    elif currentMap == "de_cbble":
        img = plt.imread('maps/de_cbble.png')
        print("Plotting data...")
        mapOrder = 6
        coordinateProcessor(mapOrder)

    # Initiate plots and draw
    print("Plotting complete.")
    sns.kdeplot(x_coor, y_coor, n_levels = 45, cmap="OrRd", alpha = 0.5, shade=True, shade_lowest=False)
    sns.scatterplot(x = x_coor, y = y_coor, marker = "o", s = 20, color ="Blue")
    plt.imshow(img)
    plt.savefig("export/export.png", bbox_inches='tight', pad_inches=0)
    print("Image exported.")
    
if __name__ == '__main__':
    main()