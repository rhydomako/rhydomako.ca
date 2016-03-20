var map = L.map('map').setView([43.708, -79.3703], 11);

L.tileLayer('http://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    mapId: 'rhydomako.ll5lnog4',
    token: 'pk.eyJ1Ijoicmh5ZG9tYWtvIiwiYSI6IkZXN0k5em8ifQ.-ZW6vi94OM65M4xGlShDjA'
}).addTo(map);

//
// D3 code for the svg overlayPane
//
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

//
// Colour scale
//
var color = d3.scale.linear()
    .domain([0,1200])
    .range(["#fff7ec", "#7f0000"]);

//
// Tool tip
//
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    return "<strong>Total number of service requests:</strong> <span style='color:red'>" + d.properties['All'] + "</span><br> \
            <strong>Population:</strong> <span style='color:red'>" + d.properties.Population + "</span><br> \
            <strong>Average service requests per 1000 residents:</strong> <span style='color:red'>" + (d.properties.All/(d.properties.Population/1000.)).toFixed(2) + "</span>";
  });
svg.call(tip);

//
// Load data
//
queue()
    .defer(d3.csv,  "/posts/cot311/data/request_types.csv")
    .defer(d3.json, "/posts/cot311/data/fsas.json")
    .defer(d3.csv,  "/posts/cot311/data/ts.csv")
    .await(initMap);

//
// Make the map
//
function initMap(error, request_types, fsas, ts) {

    fsaFeatures = topojson.feature(fsas, fsas.objects.fsas).features;

    toplist = d3.select("#types").append("ul");
    toplist.selectAll("li")
        .data(request_types)
      .enter()
        .append("li")
        .text(function(d){ return d.request_types; })
        .on("click", function(d) { fillFSAs(d.request_types); plotTS(d.request_types);  });

    var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);

    var labels = g.selectAll('.fsa-label')
        .data(fsaFeatures)
      .enter().append('text')
        .attr("class", function(d) { return "fsa-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".20em")
        .text(function(d) { return d.id; });

    var feature = g.selectAll('path')
        .data(fsaFeatures)
      .enter()
        .append("path")
        .style("fill", function(d) { return color(d.properties['All']/(d.properties.Population/1000.)); })
        .attr("d", path)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var normalization = d3.selectAll("#normalization").on("change", radioButton);
    var saveSelection = 'All';
    function radioButton() {
      fillFSAs(saveSelection);
    }

    //
    // Replot the FSAs and colours
    //
    function fillFSAs(selected) {
        saveSelection = selected;

        // rescale colours
        var a = d3.max( fsaFeatures.map( function(d) {
            var norm = normalization[0][0].checked ? 1 : (d.properties.Population/1000.);
            return +d.properties[selected]/norm; } 
        )); 
        color.domain([0,a]);

        g.selectAll('path')
            .data(fsaFeatures)
            .style("fill", function(d) { 
               var norm = normalization[0][0].checked ? 1 : (d.properties.Population/1000.);
               return color(d.properties[selected]/norm); 
            });

        tip.html(function(d) {
            return "<strong>Total number of <span style='color:red'>"+ selected +"</span> requests:</strong> <span style='color:red'>" + d.properties[selected] + "</span><br> \
            <strong>Population:</strong> <span style='color:red'>" + d.properties.Population + "</span><br> \
            <strong>Average service requests per 1000 residents:</strong> <span style='color:red'>" + (d.properties[selected]/(d.properties.Population/1000.)).toFixed(8) + "</span>";});

        //reset scale
        d3.select("#colorLegend").html("")
        colorlegend("#colorLegend", color, "linear", {});
    }

    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = path.bounds(topojson.feature(fsas, fsas.objects.fsas)),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      svg .attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path);
      labels.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .style("font-size", function(d) { return (2*( map.getZoom() - 11) + 12) + "px" });
    }

    //
    // Timeseries
    //
    function plotTS(x) {

        ts.forEach(function(d){ d[x] = +d[x]; });

        MG.data_graphic({
              data: ts,
              right: 40,
              left:  90,
              bottom: 50,
              width: 1000,
              height: 300,
              target: '#timeSeries',
              title: x,
              x_accessor: '_date',
              y_accessor: x,
              y_label: 'Number of service requests',
        });
    }

    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    //
    // Initialize functions
    //
    colorlegend("#colorLegend", color, "linear", {});

    ts = MG.convert.date(ts, '_date', '%Y-%m-%d');
    plotTS('All');
    map.on("viewreset", reset);
    reset();
}


