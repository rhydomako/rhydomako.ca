---
layout: post
title: Toronto Public Library Catalogue Subject Map
date: 2016-04-15 22:00:00
permalink: /tpl-catalogue-map/index.html
category: post
---

<link rel="stylesheet" type="text/css" href="/posts/tplCatalogueMap/css/style.css">

Below is a visualization of the metadata on many of the books in the [Toronto Public Library's Catalogue](http://opendata.tplcs.ca/). Specifically, from the Catalogue data (which was generously converted from [XML to JSON](https://github.com/avolkov/tpl-hackathon-xml2json) by [Alex Volkov](https://twitter.com/a_volkov), I extracted the records for English-language print books that contained subject metadata and attempted to cluster related subjects. Following an approach inspired by [Nicolas Kruchten](http://opensource.datacratic.com/mtlpy50/), the subject-coocurrence matrix was first reduced using an [SVD decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition), and then the high-dimensional subject-vectors were embedded in the low-dimensional visualization space using the [Isomap](https://en.wikipedia.org/wiki/Isomap) technique. Finally, clusters of closely related subjects were identified and highlighted using the K-Means clustering algorithm. The [SVD](http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html), [Isomap](http://scikit-learn.org/stable/modules/generated/sklearn.manifold.Isomap.html), and [K-mean](http://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html) implementations used were from [scikit-learn](http://scikit-learn.org/stable/index.html), and the visualization uses [D3.js](https://d3js.org/). Full sourcecode on [Github](https://github.com/rhydomako/rhydomako.ca/tree/master/posts/tplCatalogueMap).

<div id="viz"></div>

<script src="/posts/tplCatalogueMap/js/libs/d3.min.js" type="text/javascript"></script>
<script src="/posts/tplCatalogueMap/js/libs/d3-tip.min.js" type="text/javascript"></script>

<script src="/posts/tplCatalogueMap/js/script.js" type="text/javascript"></script>
