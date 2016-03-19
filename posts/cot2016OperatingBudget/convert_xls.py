import pandas as pd

# read XLS file into DataFrame
data = pd.read_excel("data/2016_Recommend.xlsx")
# calculate cat percentage
# write to CSV
data.to_csv('data/2016_Recommend.csv', index=False, encoding='utf-8')
