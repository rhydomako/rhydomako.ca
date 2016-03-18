This map shows the distribution of licensed dogs and cats per capita within the City of Toronto for 2013. The data was provided by [Open Data Toronto](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=0a7e1f46f71fb310VgnVCM10000071d60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD), with the totals being broken down by [Forward Sortation Area](https://www12.statcan.gc.ca/census-recensement/2006/ref/notes/FSA-RTR-eng.cfm). Additionally, FSA [boundary files](https://www12.statcan.gc.ca/census-recensement/2011/geo/bound-limit/bound-limit-eng.cfm) and [population breakdowns](https://www12.statcan.gc.ca/census-recensement/2011/dp-pd/hlt-fst/pd-pl/Table-Tableau.cfm?LANG=Eng&T=1201&S=22&O=A) were taken from [Statistics Canada 2011 Census](http://www12.statcan.gc.ca/census-recensement/index-eng.cfm).

Open Source libraries used for displaying this data are: [d3.js](https://github.com/mbostock/d3), [d3-tip.js](https://github.com/Caged/d3-tip), [topojson.js](https://github.com/mbostock/topojson), and [leaflet.js](https://github.com/Leaflet/Leaflet).

To process the datafiles:
```
make
```

Or to examine the Makefile targets:
```
make help
```
