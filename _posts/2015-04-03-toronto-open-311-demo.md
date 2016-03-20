---
layout: post
title:  "Toronto 311 service call visualization"
permalink: /311/index.html
date:   2015-04-03 23:10:34
---

<link rel="stylesheet" href="/posts/cot311/css/leaflet.css" />
<link rel="stylesheet" href="/posts/cot311/css/metricsgraphics.css" />
<link rel="stylesheet" href="/posts/cot311/css/style.css" />


<div id="mapHeader">
  <div id="colorLegend" class="legend"></div>
  <div id="scaleButtons">
    <form>
      <label><input id="normalization" type="radio" name="normalization" value="raw">Raw</input></label>
      <label><input id="normalization" type="radio" name="normalization" value="per" checked>Per 1000 residents</input></label>
    </form>
  </div>
</div>
<div id="map-container">
  <div id="map"></div>
  <div id="types"></div>
</div>
<div id="timeSeries"></div>

[Source data](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=3cdebe037654f210VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD)

<script src="/posts/cot311/js/libs/d3.v3.min.js"></script>
<script src="/posts/cot311/js/libs/topojson.v1.min.js"></script>
<script src="/posts/cot311/js/libs/queue.v1.min.js"></script>
<script src="/posts/cot311/js/libs/leaflet.js"></script>
<script src="/posts/cot311/js/libs/d3.tip.v0.6.3.js"></script>
<script src="/posts/cot311/js/libs/metricsgraphics.min.js"></script>
<script src="/posts/cot311/js/libs/colorlegend.js"></script>

<script src="/posts/cot311/js/script.js" type="text/javascript"></script>
