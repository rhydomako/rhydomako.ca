---
layout: post
title: "City of Toronto 2016 Preliminary Operating Budget"
date: 2016-03-06 12:34:12
permalink: /to-preliminary-operating-budget-2016/index.html
category: post
---

Below is a visualization to explore the 2016 City of Toronto preliminary operating budget. Data is provided by [Open Data Toronto](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=96c98f90dba60310VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD) and source for the visualization can be found on [Github](https://github.com/rhydomako/rhydomako.ca/blob/master/_posts/2016-03-06-to-operating-budget-2016.html). The framework for the interactive visualization is [dc.js](http://dc-js.github.io/dc.js/), which makes great use of [d3.js](https://d3js.org/) and [crossfilter.js](http://square.github.io/crossfilter/). The datatable functionality is provided by [dynatable](https://www.dynatable.com/) and additional processing is done using [underscore.js](http://underscorejs.org/).

The charts are interactive, so try clicking on the bars and/or labels, while the data-table will reflect the selected dimensions.

<link rel="stylesheet" type="text/css" href="/posts/cot2016OperatingBudget/css/bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="/posts/cot2016OperatingBudget/css/dc.css"/> 
<link rel="stylesheet" type="text/css" href="/posts/cot2016OperatingBudget/css/jquery.dynatable.css"/> 
<link rel="stylesheet" type="text/css" href="/posts/cot2016OperatingBudget/css/style.css"/>
<link rel="stylesheet" type="text/css" href="/public/css/poole.css"/>
<link rel="stylesheet" type="text/css" href="/public/css/lanyon.css"/>

<div class='im-centered row'>
    <div id="expense-revenue-pie-chart" class="dc-chart">
        <p style='margin-top:0px; margin-bottom:0px'><strong>Expenses:</strong><span style='margin-left:10px' id="expense-total"></span></p>
        <p><strong>Revenues:</strong><span style='margin-left:10px' id="revenue-total"></span></p>
        <div class="clearfix"></div>
    </div>
</div>
<div class='row'>
    <div id="program-chart" class="dc-chart">
        <strong>By program:</strong>
        <div class="clearfix"></div>
    </div>
</div>
<div class='row'>
    <div id="category-chart" class="dc-chart">
        <strong>By category:</strong>
        <div class="clearfix"></div>
    </div>
</div>
<div class='row'>
    <table id="lineitem-table">
        <thead>
            <tr>
                <th data-dynatable-column="Program">Program</th>
                <th data-dynatable-column="Service">Service</th>
                <th data-dynatable-column="Activity">Activity</th>
                <th data-dynatable-column="Category Name">Category Name</th>
                <th data-dynatable-column="Expense/Revenue">Expense/Revenue</th>
                <th data-dynatable-column="Value">Value</th>
            </tr>
        </thead>
    </table>
</div>

<script src="/posts/cot2016OperatingBudget/js/libs/jquery.min.js" type="text/javascript"></script>
<script src="/posts/cot2016OperatingBudget/js/libs/bootstrap.js" type="text/javascript"></script>
<script src="/posts/cot2016OperatingBudget/js/libs/d3.v3.min.js" type="text/javascript"></script> 
<script src="/posts/cot2016OperatingBudget/js/libs/crossfilter.min.js" type="text/javascript"></script> 
<script src="/posts/cot2016OperatingBudget/js/libs/dc.min.js" type="text/javascript"></script>
<script src="/posts/cot2016OperatingBudget/js/libs/underscore.js" type="text/javascript"></script>
<script src="/posts/cot2016OperatingBudget/js/libs/jquery.dynatable.js" type="text/javascript"></script>

<script src="/posts/cot2016OperatingBudget/js/script.js" type="text/javascript"></script>
