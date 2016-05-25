---
layout: post
title: Drawing geometric shapes on Region of Peel road network
date: 2016-05-24 8:42:00
permalink: /region-of-peel-drawing-using-streets/index.html
category: post
---

<link rel="stylesheet" type="text/css" href="/posts/peelRegionStreets/css/leaflet.css">
<link rel="stylesheet" type="text/css" href="/posts/peelRegionStreets/css/style.css">

This is intended as a whimsical demonstration using Open Data, wherein generate geometric patterns and translate those patterns onto the [Region of Peel road network](http://opendata.peelregion.ca/data-categories/transportation/single-line-street-network-(slsn).aspx). 

First, the street network shapefiles are used to create a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)), where the nodes represent road intersections and the edges are the roads themselves. A [k-d tree](https://en.wikipedia.org/wiki/K-d_tree) is constructed using the nodes Lat./Long. coordinates (I've used the [kdTree.js](https://github.com/ubilabs/kd-tree-javascript) javascript implmentation) so that we can retreive nearby nodes, given an arbirary input coordinate. Paths between nodes are found using [Dijkstra's](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) ([JavaScript implementation of Dijkstra's algorithm](https://github.com/andrewhayward/dijkstra)). The visualization uses [D3.js](https://d3js.org/), [leaflet.js](https://github.com/Leaflet/Leaflet), [leaflet.spin](https://github.com/makinacorpus/Leaflet.Spin), [spin.js](https://github.com/fgnass/spin.js), and [Mapbox tiles](https://www.mapbox.com/). Some misc. processing done with [underscore.js](https://github.com/jashkenas/underscore) and [d3-queue](https://github.com/d3/d3-queue).

Full sourcecode on [Github](https://github.com/rhydomako/rhydomako.ca/tree/master/posts/peelRegionStreets).

<div id="viz"></div>

<script src="/posts/peelRegionStreets/js/libs/spin.min.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/d3.min.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/queue.v1.min.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/underscore.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/leaflet.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/leaflet.spin.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/kdTree-min.js" type="text/javascript"></script>
<script src="/posts/peelRegionStreets/js/libs/graph.js" type="text/javascript"></script>

<script src="/posts/peelRegionStreets/js/script.js" type="text/javascript"></script>
