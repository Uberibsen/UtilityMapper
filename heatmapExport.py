import os
import json
import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pandas.io.json import json_normalize

def main():
    print("CS:GO Grenade Heatmap Plotter")

    # Checks if the 'json' folder is empty
    if len(os.listdir('json/') ) == 0:
        print("Input folder is empty. Please insert files")
        exit()
    else:    
        pass

    x_coor = []
    y_coor = []
    img = plt.imread('maps/de_inferno.png')

    # Opens CSV data file
    with open ('csv/utility.csv', 'r') as csv_file:
        csv_data = csv.reader(csv_file, delimiter=',', quotechar='|')
        for data in csv_data:
            # Writes data and removes quotations
            x_coor.append(data[3].strip('"'))
            y_coor.append(data[4].strip('"'))

    # Removes first unneeded string element
    del x_coor[0]
    del y_coor[0]

    # Used to convert absolute x coordinates to for minimap image resolution
    def pointx_to_resolutionx(xinput, startX = -1960, endX=2797, resX = 1024): # Only works for de_inferno
        sizeX = endX - startX
        if startX < 0:
            xinput += startX *(-1.0)
        else:
            xinput += startX
        xoutput = ((xinput / abs(sizeX)) * resX)
        return xoutput

    # Used to convert absolute y coordinates to for minimap image resolution
    def pointy_to_resolutiony(yinput, startY = -1062, endY = 3800, resY = 1024): # Only works for de_inferno
        sizeY = endY - startY
        if startY < 0:
            yinput += startY *(-1.0)
        else:
            yinput += startY
        youtput = ((yinput / abs(sizeY)) * resY)
        return resY - youtput
    
    # Rounds every element in x_coor to nearest whole and converts coordinate to number in range of the image resolution
    for i in range (0, len(x_coor)):
        x_coor[i] = pointx_to_resolutionx(int(float(x_coor[i])))

    # Rounds every element in y_coor to nearest whole and converts coordinate to number in range of the image resolution
    for i in range (0, len(y_coor)):
        y_coor[i] = pointy_to_resolutiony(int(float(y_coor[i])))

    # Initiate plots and draw
    sns.kdeplot(x_coor, y_coor, n_levels = 45, cmap="OrRd", alpha = 0.5, shade=True, shade_lowest=False)
    sns.scatterplot(x = x_coor, y = y_coor, marker = "o", s = 20, color ="Blue")
    plt.imshow(img)
    plt.savefig("export/de_inferno_hegrenade.png", bbox_inches='tight', pad_inches=0)
    
if __name__ == '__main__':
    main()