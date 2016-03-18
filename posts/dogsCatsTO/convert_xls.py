import pandas as pd
import numpy as np

# read XLS file into DataFrame
data = pd.read_excel("data/2013_licenses.xls", header=3)
# calculate cat percentage
data['cat_pct'] = np.round((data['CAT']/data['Total']) * 100., 1)
data['dog_pct'] = np.round((data['DOG']/data['Total']) * 100., 1)
# write to CSV
data.reset_index().to_csv('data/2013_licenses.csv', index=False)
