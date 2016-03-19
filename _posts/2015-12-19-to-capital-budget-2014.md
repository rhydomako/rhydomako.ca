---
layout: post
title: "City of Toronto 2014 Capital Budget"
permalink: /to-capital-budget-2014/index.html
date: 2015-12-19 12:00:00
---

This dataset shows the 2014 approved capital budget for the City of Toronto, as provided by [Open Data Toronto](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=7daf4d8e69770310VgnVCM1000003dd60f89RCRD). Also included is the nine-year plan budget (2015-2023). The provided XLSX file was first converted to a Tab Separated Value (TSV) file ([located here](https://github.com/rhydomako/rhydomako.ca/blob/master/posts/cot2014CapitalBudget/data/capital_2014.tsv)), then the [PivotTable.js](https://github.com/nicolaskruchten/pivottable) library was used to generate the [Pivot Table](https://en.wikipedia.org/wiki/Pivot_table). Full source code located on [Github](https://github.com/rhydomako/rhydomako.ca/tree/master/posts/cot2014CapitalBudget). 

Please note that all values are given in units of $1,000 (for example, 10 = $10,000). Also note that the rows/columns can be drag/dropped to further drill down into the dataset.

<div id="pivot-table"></div>

<link rel="stylesheet" type="text/css" href="/posts/cot2014CapitalBudget/css/pivot.css">
<script type="text/javascript" src="/posts/cot2014CapitalBudget/js/libs/jquery.min.js"></script>
<script type="text/javascript" src="/posts/cot2014CapitalBudget/js/libs/jquery-ui.min.js"></script>
<script type="text/javascript" src="/posts/cot2014CapitalBudget/js/libs/jquery.tsv-0.957.min.js"></script>
<script type="text/javascript" src="/posts/cot2014CapitalBudget/js/libs/pivot.js"></script>

<script type="text/javascript" src="/posts/cot2014CapitalBudget/js/script.js"></script>
