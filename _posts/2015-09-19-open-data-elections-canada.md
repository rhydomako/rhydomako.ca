---
layout: post
title:  "Instant-runoff voting simulation for 2011 Canadian election"
permalink: /elections-canada-irv/index.html
date:   2015-09-19 19:15:34
---

<link href="/posts/irvSimulation2011/css/leaflet.css" rel="stylesheet" />
<link href="/posts/irvSimulation2011/css/style.css" rel="stylesheet" />

<div id="irv_map"></div>

### Overall results

<div id="results-table"></div>
<div class="col-md-4"><h2><span id="breakdown-title" style="display: none">Riding breakdown</span></h2></div>
<div id="riding-breakdown"></div>

### Explaination

Currently, the winner of an election in the Canadian system is determined through a system called [First Past the Post](https://en.wikipedia.org/wiki/First-past-the-post_voting) (FPTP), wherein whichever candidate that receives the plurality of votes is declared the winner. Although FPTH is easy to understand and interprete, in a multi-party system it often faces the criticism that candidates can be elected without carrying the majority of votes and this can contribute to many voters feeling that their votes were 'wasted' since in no way did their votes contribute to the election of their representative. For example, in the 2011 Canadian general election, a grand total of 14873962 valid votes were cast, and 7495961 of those votes were for the ultimately elected candidates. This means that for 50% of the voters, their political choice was not represented in the final outcome.

There are many alternate voting systems that mitigate these concerns, such as [Proportional Representation](https://en.wikipedia.org/wiki/Proportional_representation) systems like [Single transferable vote](https://en.wikipedia.org/wiki/Single_transferable_vote). For single-winner elections, the Single transferable vote systems is known as [Instant-runoff voting](https://en.wikipedia.org/wiki/Instant-runoff_voting). In this system, each voter ranks the candidates in order of preference. The vote counting is then conducted in rounds: for each round that none of the candidates receives a majority of votes, the candidate with the fewest vote is taken off the list and their votes are redistruted according to the stated preference of those voters.

To see what the 2011 Canadian general election might've looked like under the Instant-runoff voting system, I conducted a simulation using the finally polling results from the 2011 elections, combined with a voter preference model based on opinion polling by [EKOS](http://www.ekospolitics.com/wp-content/uploads/full_report_april_29_2011.pdf) just before the election. As part of the opinion polling, voters were asked who their second choices would be, where they not voting for their primary choice. With this information, I applied this voter-preference model to those elections where there wasn't a clear initial majority winner. The votes were redistributed according to the probability model and following the rules of the Instant-runoff system. The overall simulation results are summarized in the 'Results' table, and individual riding can be examined by click on the district on the interactive map. 

Open Source libraries used: [jquery.js](https://jquery.com/), [underscore.js](http://underscorejs.org/), [leaflet.js](http://leafletjs.com/), [queue.js](https://github.com/d3/d3-queue), [d3.js](https://d3js.org/), [d3.tip.js](https://github.com/Caged/d3-tip), [topojson.js](https://github.com/mbostock/topojson), [pandas](http://pandas.pydata.org/). Full source on [Github](https://github.com/rhydomako/rhydomako.ca/master/posts/irvSimulation2011/).


<script src="/posts/irvSimulation2011/js/libs/jquery.min.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/underscore.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/leaflet.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/queue.v1.min.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/d3.v3.min.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/d3.tip.v0.6.3.js" type="text/javascript"></script>
<script src="/posts/irvSimulation2011/js/libs/topojson.v1.min.js" type="text/javascript"></script>

<script src="/posts/irvSimulation2011/js/script.js" type="text/javascript"></script>
