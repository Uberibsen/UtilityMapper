import os
import json
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("CS:GO Grenade Heatmap Plotter")
    while True:
        path = ('data/')
        acceptedFileExtension = (".json")
        input("Press Enter to continue.")

        if len(os.listdir(path)) == 0: # Checks if the 'data' folder is empty
            print("Input folder is empty. Please run the 'demoData.js' file")
            input("Press Enter to retry.")
            continue
        else:    
            pass

        for path, dirs, files in os.walk(path):
            for filename in files:
                filename, file_extension = os.path.splitext(filename)          
        try:
            if file_extension in acceptedFileExtension:
                break
            else:
                print("\nWrong file format.")
        except NameError:
            pass

    x_coor = []
    y_coor = []
    supportedMaps = ["de_inferno", "de_mirage", "de_dust2", "de_train", "de_overpass", "de_cache", "de_cbble"]
    
    # Opens JSON data file
    with open('data/data.json') as json_file:
        data = json.load(json_file)
        grenadeSelectArray = ["HE Grenade", "Flashbang", "Smoke"]  
        playedMap = data["map"]

        if playedMap in supportedMaps: # Checks if the data is from a supported map
            pass
        else:
            input("Map not supported. Press Enter to close program.")
            exit()

        while True:
            try:
                print("\n1. HE grenades\n2. Flashbangs\n3. Smoke grenades\n")
                userInput = int(input("Please select the grenade type you want to map (1, 2, 3) "))   
            except ValueError:
                print("Not an integer! Try again.\n")
                continue
            if userInput < 1 or userInput > 3:
                print("Input out of range! Try again.\n")
                continue
            else:
                break 
        print("Plotting grenade type: " + grenadeSelectArray[userInput - 1])

        for coordinate in data["grenades"]:
            if grenadeSelectArray[userInput - 1] in coordinate["type"]: # Plots the grenade type selected
                x_coor.append(coordinate['position']['x']) # Appends x coordinates
                y_coor.append(coordinate['position']['y']) # Appends y coordinates

    # Used to convert absolute x coordinates to minimap image resolution
    def pointx_to_resolutionx(xinput, startX, endX, resX):
        sizeX = endX - startX
        if startX < 0:
            xinput += startX *(-1.0)
        else:
            xinput += startX
        xoutput = ((xinput / abs(sizeX)) * resX)
        return xoutput

    # Used to convert absolute y coordinates to minimap image resolution
    def pointy_to_resolutiony(yinput, startY, endY, resY):
        sizeY = endY - startY
        if startY < 0:
            yinput += startY *(-1.0)
        else:
            yinput += startY
        youtput = ((yinput / abs(sizeY)) * resY)
        return resY - youtput

    def coordinateProcessor(mapCount): # Rounds every element in coordinate array to nearest whole and converts coordinate to number in range of the image resolution 
        for i in range (0, len(x_coor)):
            x_coor[i] = pointx_to_resolutionx(int(float(x_coor[i])),
                (mapsInfo["data"][mapCount]["values"]["startX"]),
                (mapsInfo["data"][mapCount]["values"]["endX"]),
                (mapsInfo["data"][mapCount]["values"]["resX"]))
        for i in range (0, len(y_coor)):
            y_coor[i] = pointy_to_resolutiony(int(float(y_coor[i])),
                (mapsInfo["data"][mapCount]["values"]["startY"]),
                (mapsInfo["data"][mapCount]["values"]["endY"]),
                (mapsInfo["data"][mapCount]["values"]["resY"]))

    with open('json/maps.json') as map_file: # Loads values used for coordinate conversion
        mapsInfo = json.load(map_file)

    mapCount = 0
    for currentMap in supportedMaps:
        if currentMap in supportedMaps[mapCount]:
            img = plt.imread('maps/' + str(currentMap) + '.png')
            coordinateProcessor(mapCount + 1)
            break
        else:
            mapCount = mapCount + 1
            continue

    ### Initiate plots and draw ###
    totalGrenades = len(x_coor) # Total amount of grenades
    matchTime = (int(data["totalTime"] / 60)) # Converts matchtime in second to minutes
    tickRate = data["tickRate"] # Server tickrate

    heatmap = sns.kdeplot(x_coor, y_coor,
        levels = 100, 
        cmap ="OrRd", 
        alpha = 0.75, 
        shade = True, 
        shade_lowest = False,
        antialiased = True)

    grenadePlot = sns.scatterplot(x_coor, y_coor,
        marker = "o", 
        s = 20, 
        color ="Blue")

    # Limits plot axes
    plt.ylim(1024, 0)
    plt.xlim(0, 1024)

    # Text box properties
    props = dict(boxstyle='round', facecolor='wheat', alpha = 0.75)

    # Text box text
    textstr = '\n'.join((
        "Map: " + str(playedMap), # Map
        "Time: " + str(matchTime) + " min", # Match time
        "Tick: " + str(tickRate), # Server tickrate
        "Type: " + grenadeSelectArray[userInput - 1], # Grenade type
        "No.: " + str(totalGrenades) # Total number of grenades
    ))

    # Plot text box
    grenadePlot.text(0.02, 0.98, textstr,
        transform = grenadePlot.transAxes,
        fontsize = 10,
        verticalalignment = 'top',
        bbox = props)

    plt.imshow(img)
    plt.savefig("export/export.png", bbox_inches = 'tight', pad_inches = 0, dpi = 100)
    #plt.show()
    input("Image exported. Press Enter to exit program.")
    
if __name__ == '__main__':
    main()