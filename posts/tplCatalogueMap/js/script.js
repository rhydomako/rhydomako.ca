var annotations = [
    {"xVal": 150, "yVal": 200, "text":"Juvenile Fiction"},
    {"xVal": 250, "yVal": 300, "text":"Fiction"},
    {"xVal": 470, "yVal": 370, "text":"History"},
    {"xVal": 620, "yVal": 370, "text":"Government"},
    {"xVal": 380, "yVal": 250, "text":"Crafts"},
    {"xVal": 300, "yVal": 70, "text":"Poetry"},
    {"xVal": 800, "yVal": 170, "text":"Business"},
    {"xVal": 520, "yVal": 170, "text":"Health"},
];

var margin = {top: 20, right: 10, bottom: 20, left: 10};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);

var container = svg.append("g");

var x = d3.scale.linear()
    .domain([-1.3,1.0])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([-0.8,0.8])
    .range([height, 0]);

var voronoi = d3.geom.voronoi()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset(function(d) { return [y(d.y) - this.getBBox().y - 15, x(d.x) - this.getBBox().x - 0.5*this.getBBox().width]; })
    .html(function(d) {
        return d.subject;
    });
svg.call(tip);

d3.json("/posts/tplCatalogueMap/data/subjects_isomap.json", function(error,data) {

    data.forEach(function(d) {
        d.x = +d.x;
        d.y = +d.y;
    });

    var circle = container.append('g')
        .attr("class", "dot")
        .selectAll("dots")
        .data(data)
	.enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", 3)
        .style("fill", function(d) { return d.clusterColor; }); 

    var annotationLayer = container.append('g')
        .attr("class", "annotations")
        .selectAll("text")
        .data(annotations)
        .enter().append("text")
        .attr("x", function(d) { return d.xVal; })
        .attr("y", function(d) { return d.yVal; })
        .text( function (d) { return d.text; });

    var voronoiGroup = container.append("g")
      	.attr("class", "voronoi")
    	.selectAll("path")
      	.data(voronoi(data))
    	.enter()
	.append('a')
	.attr("xlink:href", function(d) {return "http://www.torontopubliclibrary.ca/search.jsp?Ntt=" + d.point.subject})
	.append("path")
      	.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
	.datum(function(d) { return d.point; })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});

function zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
