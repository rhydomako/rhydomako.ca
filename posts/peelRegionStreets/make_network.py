import networkx as nx
import json

from haversine import haversine

#use networkx to read the shapefile and convert node names to integers
G = nx.read_shp("data/slsn_wgs84.shp").to_undirected()
iG = nx.convert_node_labels_to_integers(G)

#output edge lists for every node
network = {}
for i, node in enumerate(G.nodes()):
    lon, lat = node
    lon_str = str(np.round(lon, decimals=6))
    lat_str = str(np.round(lat, decimals=6))
    
    edges = {}
    
    origin = (lat, lon)
    for edge in iG.edges(i):
        edge_label = edge[1]
        dlon, dlat = G.nodes()[edge_label]
        destination = (dlat, dlon)
        dist = haversine(origin, destination)*1000.
        edges[str(edge_label)] = dist
    
    network[str(i)] = {
                           'node':i,
                           'lat':lat_str,
                           'lon':lon_str,
                           'edges':edges
                      }
json.dump(network, open('data/network.json','w'))

#output the edges/line-segments as lat/log coordinates
network_edges = {}
for edge in iG.edges():
    edge_attr = iG.edge[edge[0]][edge[1]]
    edge_json = json.loads(edge_attr['Json'])['coordinates']
    edge_street = edge_attr['FULLSTNAME']
        
    network_edges[str(edge)] = {
        'name': "",
        'path': [[str(np.round(x, decimals=6)), str(np.round(y, decimals=6))] for x,y in edge_json]
    }
json.dump(network_edges, open('data/network_edges.json','w'))
