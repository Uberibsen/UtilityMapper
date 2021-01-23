import os
import json
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("CS:GO Grenade Heatmap Plotter")
    while True:
        path = ('data/')
        accepted_file_extension = (".json")
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
            if file_extension in accepted_file_extension:
                break
            else:
                print("\nWrong file format.")
        except NameError:
            pass

    x_coor = []
    y_coor = []
    supported_maps = ["de_inferno", "de_mirage", "de_dust2", "de_train", "de_overpass", "de_cache", "de_cbble"]
    
    # Opens JSON data file
    with open('data/data.json') as json_file:
        data = json.load(json_file)
        grenade_select = ["HE Grenade", "Flashbang", "Smoke", "Molotov"]  
        played_map = data["map"]

        if played_map in supported_maps: # Checks if the data is from a supported map
            pass
        else:
            input("Map not supported. Press Enter to close program.")
            exit()

        while True:
            try:
                print("\n1. HE grenades\n2. Flashbangs\n3. Smoke grenades\n4. Molotov")
                user_input = int(input("Please select the grenade type you want to map (1, 2, 3, 4) "))   
            except ValueError:
                print("Not an integer! Try again.\n")
                continue
            if user_input < 1 or user_input > 4:
                print("Input out of range! Try again.\n")
                continue
            else:
                break 
        print("Plotting grenade type: " + grenade_select[user_input - 1])

        for coordinate in data["grenades"]:
            if grenade_select[user_input - 1] in coordinate["type"]: # Plots the grenade type selected
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

    def coordinate_processor(map_count): # Rounds every element in coordinate array to nearest whole and converts coordinate to number in range of the image resolution 
        for i in range (0, len(x_coor)):
            x_coor[i] = pointx_to_resolutionx(int(float(x_coor[i])),
                (mapsInfo["data"][map_count]["values"]["startX"]),
                (mapsInfo["data"][map_count]["values"]["endX"]),
                (mapsInfo["data"][map_count]["values"]["resX"]))
        for i in range (0, len(y_coor)):
            y_coor[i] = pointy_to_resolutiony(int(float(y_coor[i])),
                (mapsInfo["data"][map_count]["values"]["startY"]),
                (mapsInfo["data"][map_count]["values"]["endY"]),
                (mapsInfo["data"][map_count]["values"]["resY"]))

    with open('json/maps.json') as map_file: # Loads values used for coordinate conversion
        mapsInfo = json.load(map_file)

    map_count = 0
    for current_map in supported_maps:
        if current_map in supported_maps[map_count]:
            img = plt.imread('maps/' + str(current_map) + '.png')
            coordinate_processor(map_count + 1)
            break
        else:
            map_count = map_count + 1
            continue

    ### Initiate plots and draw ###
    total_grenades = len(x_coor) # Total amount of grenades
    match_time = (int(data["totalTime"] / 60)) # Converts match_time in second to minutes
    tick_rate = data["tickRate"] # Server tickrate

    heatmap = sns.kdeplot(x_coor, y_coor,
        levels = 100, 
        cmap ="OrRd", 
        alpha = 0.75, 
        shade = True, 
        shade_lowest = False,
        antialiased = True)

    grenade_plot = sns.scatterplot(x_coor, y_coor,
        marker = "o", 
        s = 20, 
        color ="Blue")

    # Limits plot axes
    plt.ylim(1024, 0)
    plt.xlim(0, 1024)

    # Text box properties
    props = dict(boxstyle='round', facecolor='wheat', alpha = 0.75)

    # Text box text
    text_str = '\n'.join((
        "Map: " + str(played_map), # Map
        "Time: " + str(match_time) + " min", # Match time
        "Tick: " + str(tick_rate), # Server tickrate
        "Type: " + grenade_select[user_input - 1], # Grenade type
        "No.: " + str(total_grenades) # Total number of grenades
    ))

    # Plot text box
    grenade_plot.text(0.02, 0.98, text_str,
        transform = grenade_plot.transAxes,
        fontsize = 10,
        verticalalignment = 'top',
        bbox = props)

    plt.imshow(img)
    plt.savefig("export/export.png", bbox_inches = 'tight', pad_inches = 0, dpi = 100)
    #plt.show()
    input("Image exported. Press Enter to exit program.")
    
if __name__ == '__main__':
    main()