var settings = {
    mapCentreLat: 43.64,
    mapCentreLong: -79.65,
    mapZoom: 11.,
};


var distance = function(a, b) {
   var lat1 = +a.lat,
       lon1 = +a.lon,
       lat2 = +b.lat,
       lon2 = +b.lon;
   
   var rad = Math.PI/180;
   var dLat = (lat2-lat1)*rad;
   var dLon = (lon2-lon1)*rad;
   var lat1 = lat1*rad;
   var lat2 = lat2*rad;

   var x = Math.sin(dLat/2);
   var y = Math.sin(dLon/2);
   
   var a = x*x + y*y * Math.cos(lat1) * Math.cos(lat2); 
   return Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

var tree;
var network, networkEdges;

var map = L.map('viz', {zoomControl: false}).setView([settings.mapCentreLat, settings.mapCentreLong], settings.mapZoom);
map.on("viewreset", resetView);
map.spin(true);

L.tileLayer('http://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    mapId: 'rhydomako.ll5lnog4',
    token: 'pk.eyJ1Ijoicmh5ZG9tYWtvIiwiYSI6IkZXN0k5em8ifQ.-ZW6vi94OM65M4xGlShDjA'
}).addTo(map);

// Disable drag and zoom handlers.
//map.dragging.disable();
//map.touchZoom.disable();
//map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var   g = svg.append("g");

function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

var pathsGeoJson, feature;
var transform = d3.geo.transform({point: projectPoint}),
    path = d3.geo.path().projection(transform);

function drawPaths(featureArray) {
   pathsGeoJson = { "type": "FeatureCollection", "features":featureArray };
   
   feature = g.selectAll('path')
        .data(pathsGeoJson.features)
      .enter()
        .append("path")
        .attr("d", path);
   resetView();
}

function resetView() {
    var bounds = path.bounds(pathsGeoJson),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    svg .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    feature.attr("d", path);
    map.spin(false);
}


function start(error, _network, _networkEdges) {
    network = _network;
    networkEdges = _networkEdges;
    
    tree = new kdTree(_.values(network), distance, ["lat", "lon"]);
    var map = _.mapObject(network, function(v, k) { 
	return v['edges'];
    });
    graph = new Graph(map);

    var nSpokes = _.sample([3,5]);
    var angleBetweenSpokes = 2*Math.PI/nSpokes;
    var angleOffset = 35./(2*Math.PI)*Math.random();

    var centreLat = 43.64;
    var centreLon = -79.65;
    var centre = tree.nearest({"lon":centreLon, "lat":centreLat},10);
    
    var spokeR = 0.07;
    var spokeR2 = spokeR*0.2;

    var nodePairs = [];
    for(var i=0; i<nSpokes; i++) {
        var theta = i*angleBetweenSpokes + angleOffset;
        var lat = centreLat + spokeR*Math.sin(theta);
        var lon = centreLon + spokeR*Math.cos(theta);
        var spoke = tree.nearest({"lon":lon, "lat":lat},2);
	nodePairs.push([centre[0][0], spoke[0][0]]);

	for(var j=0; j<nSpokes; j++) {
	   var theta2 = j*angleBetweenSpokes;
	   var lat2 = lat + spokeR2*Math.sin(theta2);
	   var lon2 = lon + spokeR2*Math.cos(theta2);
	   var spoke2 = tree.nearest({"lon":lon2, "lat":lat2},2);
	   nodePairs.push([spoke[0][0], spoke2[0][0]]);
	}
    }

    var featureArray = [];
    function processPaths(pairs, i) {
       if(i == undefined) {
	  i = 0;
       }
       if(i < pairs.length) {
	 var nextBitOfWork = function() {
	   featureArray.push( featurePath(nodePairs[i][0], nodePairs[i][1]) );
           processPaths(pairs, i+1);
         }
         setTimeout(nextBitOfWork, 50);
       } else {
         drawPaths(featureArray);
       }
    }
    processPaths(nodePairs, 0);

    function featurePath(nodeA, nodeB) {
    	var aPath = graph.findShortestPath(nodeA.node,nodeB.node);

	var anchorPoint = [nodeA.lon, nodeB.lat];

	var fullPath = [];
	for(var i=0; i<aPath.length-1; i++) {
		var edgeKey;
		if( +aPath[i] < +aPath[i+1]) {
			edgeKey = "(" + aPath[i] + ", " + aPath[i+1] + ")";
		} else {
			edgeKey = "(" + aPath[i+1] + ", " + aPath[i] + ")";
		}

		var pathSegment = networkEdges[edgeKey].path;

		if((pathSegment[0][0] == anchorPoint[0]) && (pathSegment[0][1] == anchorPoint[1])) {
		} else {
			pathSegment = _.chain(pathSegment).reverse().value();
		}
		anchorPoint = pathSegment[pathSegment.length - 1];

		fullPath = fullPath.concat(pathSegment);
	}
       
	var featureObject = {
            "type":"Feature",
            "geometry":{
                "type":"LineString",
                "coordinates":fullPath
            },
            "properties":{
                //
            }
        }
	return featureObject;
   }
/*
*/
}

queue()
    .defer(d3.json, "/posts/peelRegionStreets/data/network.json")
    .defer(d3.json, "/posts/peelRegionStreets/data/network_edges.json")
    .await(start);
