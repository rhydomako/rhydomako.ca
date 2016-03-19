import pandas as pd
import numpy as np
import csv
import os

current_ward = None

raw_data = pd.read_excel("data/capital_2014.xlsx", skiprows=5)

xlsx_columns = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'] #columns to extract
tsv_columns  = ['Ward Number','Ward Name', 'Project #', 'Prefix', 'Project Name', 'Sub-project Name', 'Year','Budgeted']

with open("data/capital_2014.tsv", 'w') as f:

    tsv_writer = csv.writer(f, delimiter='\t')
    tsv_rows = [tsv_columns] #header

    for row, row_data in raw_data.iterrows():
        #data schema
        row_labels       = row_data['Row Labels']
        project_number   = row_data['Ward/Project Number']
        project_name     = row_data['Project Name']
        sub_project_name = row_data['SubProject Name']

        #skip marginal totals
        if project_number.find('Total')>0:
            continue

        #grab Ward Name when applicable
        if isinstance(project_name, float) and np.isnan(project_name):
            current_ward = project_number.split('-') #to extract ward number

            #sometimes doesn't have a ward number
            try:
                ward_number = int(current_ward[-1])
            except:
                ward_number = None

            #ward name
            if len(current_ward) == 1:
                ward_name = current_ward[0]
            else:
                ward_name = "-".join(current_ward[:-1])

            continue

        #un-pivot the rows
        for column in xlsx_columns:
            column_data = row_data[column]

            #suppress zeros
            if column_data==0:
                continue

            if ward_name == '(blank)':
                continue

            tuple = (
                    ward_number,
                    ward_name.strip(),
                    project_number.strip(),
                    project_number[:3],
                    project_name.strip(),
                    sub_project_name.strip(),
                    str(column),
                    str(column_data)
                    )

            tsv_rows.append(tuple)
            
    tsv_writer.writerows(tsv_rows)
    #get rid of trailing \n
    f.seek(-2, os.SEEK_END)
    f.truncate()       
