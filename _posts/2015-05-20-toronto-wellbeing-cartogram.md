---
layout: post
title: "Toronto Wellbeing Cartogram"
permalink: /wellbeing/index.html
author: Richard Hydomako
date: 2015-05-20 12:00:00
---
    
Data from [Wellbeing Toronto](http://toronto.ca/wellbeing). Cartogram library from [Cartogram.js](https://github.com/shawnbot/d3-cartogram/)

Source on [Github](https://github.com/rhydomako/rhydomako.ca/tree/master/posts/wellbeingCartogram/).

<link rel="stylesheet" href="/posts/wellbeingCartogram/css/leaflet.css" />
<link rel="stylesheet" href="/posts/wellbeingCartogram/css/style.css"/>

<div class="home">
  <form>
    <p>
      <label>Show: <select id="field"></select></label>
      <label> and normalize to: <select id="scale"></select></label>
      <span id="status"></span>
    </p>
  </form>
  <div id="map"></div>
</div>

<script src="/posts/wellbeingCartogram/js/libs/d3.v3.min.js" type="text/javascript"></script>
<script src="/posts/wellbeingCartogram/js/libs/topojson.v1.min.js" type="text/javascript"></script>
<script src="/posts/wellbeingCartogram/js/libs/queue.v1.min.js" type="text/javascript"></script>
<script src="/posts/wellbeingCartogram/js/libs/leaflet.js" type="text/javascript"></script>
<script src="/posts/wellbeingCartogram/js/libs/cartogram.js" type="text/javascript"></script>

<script src="/posts/wellbeingCartogram/js/script.js" type="text/javascript"></script>
