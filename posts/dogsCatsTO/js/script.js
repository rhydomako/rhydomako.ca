var settings = {
    mapCentreLat: 43.708,
    mapCentreLong: -79.3703,
    mapZoom: 11.2,
};
var map = L.map('viz', {zoomControl: false}).setView([settings.mapCentreLat, settings.mapCentreLong], settings.mapZoom);
map.on("viewreset", resetView);

// Disable drag and zoom handlers.
//map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var   g = svg.append("g").attr("class", "leaflet-zoom-hide");

function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

var fsas;
var transform = d3.geo.transform({point: projectPoint}),
    path = d3.geo.path().projection(transform);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
              return "<span class='tip-left'>First three digits of Postal Code:</span> <span class='tip-right'>" + d.id + "</span></br> \
                      <span class='tip-left'>Number of registered cats:</span> <span class='tip-right'>" + d.properties['CAT'] + " ("+ d.properties['cat_pct'] +"%)</span><br> \
                      <span class='tip-left'>Number of registered dogs:</span> <span class='tip-right'>" + d.properties['DOG'] + " ("+ d.properties['dog_pct'] +"%)</span><br> \
                      <span class='tip-left'>Total number of animals:</span> <span class='tip-right'>" + d.properties['Total'] + "</span><br> \
                      <span class='tip-left'>Total number of animals per 1000 residents:</span> <span class='tip-right'>" + (d.properties['Total']/(d.properties['Population']/1000.)).toFixed(1) + "</span>";
    });
svg.call(tip);

d3.json("/posts/dogsCatsTO/data/fsas.topojson", function(data) {

    fsas = topojson.feature(data, data.objects.fsas);
    
    var values = fsas.features.map(function(d) { return d.properties['Total']/(d.properties['Population']/1000.); });
    var extent = d3.extent(values);
    var color = d3.scale.quantize()
        .domain(extent)
        .range(['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']);

    g.selectAll('path')
        .data(fsas.features)
      .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            return color( d.properties['Total']/(d.properties['Population']/1000.) );
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    resetView();
});

function resetView() {
    var bounds = path.bounds(fsas),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    svg .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
}
