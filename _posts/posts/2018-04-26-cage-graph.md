---
layout: post
title: Interactive Nic Cage Taxonomy Chart
date: 2018-04-29 10:00:00
permalink: /cage-graph/index.html
category: post
---

<link rel="stylesheet" type="text/css" href="/posts/cageGraph/css/style.css">

FiveThirtyEight recently published an article about [The Five Types Of Nicolas Cage Movies](https://fivethirtyeight.com/features/the-five-types-of-nicolas-cage-movies/) which I thoroughly enjoyed. The only thing missing was the ability to hover over the non-labeled points to see which movie was which. So I reproduced the main chart with some interactive elements:

<div id='viz'>
<svg width="960" height="500"></svg>
</div>

<script src="/posts/cageGraph/js/d3.v4.min.js" type="text/javascript"></script>
<script src="/posts/cageGraph/js/script.js" type="text/javascript"></script>
