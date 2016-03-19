This is a visualization to explore the 2016 City of Toronto preliminary operating budget. Data is provided by [Open Data Toronto](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=96c98f90dba60310VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD) and source for the visualization can be found on [Github](https://github.com/rhydomako/rhydomako.ca/blob/master/_posts/2016-03-06-to-operating-budget-2016.html). The framework for the interactive visualization is [dc.js](http://dc-js.github.io/dc.js/), which makes great use of [d3.js](https://d3js.org/) and [crossfilter.js](http://square.github.io/crossfilter/). The datatable functionality is provided by [dynatable](https://www.dynatable.com/) and additional processing is done using [underscore.js](http://underscorejs.org/).

To download and process the datafile(s):
```
make
```

To list the datafile targets:
```
make help
```
