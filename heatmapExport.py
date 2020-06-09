import os
import json
import csv
import pandas as pd
from pandas.io.json import json_normalize

def main():
    print("CS:GO Grenade Heatmap Plotter")

    # Checks if the 'json' folder is empty
    if len(os.listdir('json/') ) == 0:
        print("Input folder is empty. Please insert files")
        exit()
    else:    
        pass

    # Load JSON file
    with open('json/utility.json', 'r') as utility_json:
        utilityData = json.load(utility_json)

    # Flatten JSON dunction
    def flatten_json(y):
        output = {}

        def flatten(x, name=""):
            if type(x) is dict:
                for a in x:
                    flatten(x[a], name + a + '_')
            elif type(x) is list:
                i = 0
                for a in x:
                    flatten(a, name + str(i) + '_')
                    i += 1
            else:
                output[name[:-1]] = x
                
        flatten(y)
        return output

    # Flatten JSON
    flat = flatten_json(utilityData)
    exportArray = pd.json_normalize(flat)

    # Exports
    exportArray.to_csv (r'csv/utility.csv')

if __name__ == '__main__':
    main()