import numpy as np
import json

from scipy.sparse import csr_matrix
from sklearn.manifold import Isomap
from sklearn.cluster import KMeans
from sklearn.decomposition import TruncatedSVD 
from sklearn.preprocessing import normalize 

books = []

# Read catalogue, select only records that are print Books in English
with open('data/tpl.json', 'r') as f:
    for l in f:
        data = json.loads(l)
        
        if isinstance(data['dimensions'], dict):
            data['dimensions'] = [data['dimensions']]
        
        is_book = False
        is_english = False
        
        for dimension in data['dimensions']:
            if dimension['DIMENSION_ID'] == 37864 and dimension['ID'] == 37918:
                is_book = True
            if dimension['DIMENSION_ID'] == 20089 and dimension['ID'] == 20206:
                is_english = True
                
        if is_book == True and is_english == True:
            book = {
                'p_subject_topical':data.get('p_subject_topical', None),
                'p_record_id':data.get('p_record_id', None),
            }
            books.append(book)

# use only records that have subject metadata
filtered_books = list(filter(lambda x: isinstance(x['p_subject_topical'], list) == True, books))

# Mappings between row IDs and subject
record_list = []
subject_list = []
subject_to_id = {}
id_to_subject = {}

for i, book in enumerate(filtered_books):
    subjects = book['p_subject_topical']
    if isinstance(subjects, list) == False:
        subjects = [subjects]
        
    for subject in subjects:
        if subject not in subject_to_id:
            id_ = len(subject_to_id)
            subject_to_id[subject] = id_
            id_to_subject[id_] = subject

        record_list.append(i)
        subject_list.append(subject_to_id[subject])

# create sparse matrix
data = np.ones_like(record_list)
sparse_matrix = csr_matrix((data, (subject_list, record_list)))

# identify highly connected subjects
h = sparse_matrix.sum(axis=1).A1
subject_to_include = np.where(h>25)

# SVD dimensional reduction
svd = TruncatedSVD(n_components=20)
subject_vectors = normalize(svd.fit_transform(sparse_matrix), norm='l1')
# 2D representation of subject vectors using Isomap method
xy = Isomap(n_neighbors=10).fit_transform(subject_vectors[subject_to_include])

# K-means for highlighting subject clusters
N_CLUSTERS = 25

kmeans = KMeans(n_clusters=N_CLUSTERS)
kmeans.fit(subject_vectors[subject_to_include])
clusters = kmeans.predict(subject_vectors[subject_to_include])

cluster_colours = np.array(['#B8860B','#0074D9','#7FDBFF','#39CCCC','#3D9970',
                            '#2ECC40','#01FF70','#FFDC00','#FF851B','#FF4136',
                            '#85144b','#F012BE','#B10DC9','#111111','#AAAAAA',
                            '#DDDDDD','#F9B5AC','#556B2F','#006400','#BDB76B',
                            '#C0C0C0','#DB7093','#FFEFD5','#3CB371','#CD853F',
                            '#00FF7F','#4682B4','#D2B48C','#008080','#D8BFD8'])

# Dump to file
json_out = []
for i, subject_id in enumerate(subject_to_include[0]):
    subject = {
        'subject':id_to_subject[subject_id],
        'x':'%0.3f' % (xy[i][0]),
        'y':'%0.3f' % (xy[i][1]),
        'clusterColor':cluster_colours[clusters[i]]
    }
    json_out.append(subject)

json.dump(json_out, open('data/subjects_isomap.json','w'))
