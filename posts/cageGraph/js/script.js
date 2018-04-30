console.log('face ... off');

// svg definitions    
var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 70, left: 70 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 " + svg.attr("width") + " " + svg.attr("height"))
    .attr("perserveAspectRatio", "xMinYMid");
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// responsive resizing
var aspect = parseInt(svg.style('width')) / parseInt(svg.style('height'));
d3.select(window).on('resize', resize); 
function resize() { 
    var viz = d3.select('#viz');
    var targetWidth = parseInt(viz.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
};
resize();


// load the data and get plotting
d3.csv("/posts/cageGraph/data/cage_joined.csv", function(data) {

    // convert to numerics
    data.forEach(function(d) {
        d.RATING_VALUE = +d.RATING_VALUE;
        d.boxoffice = + d.boxoffice;
    });

    // scales, etc.
    var xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, 325000000])
        .range([height, 0]);

    var voronoi = d3.voronoi()
        .x(function(d) { return xScale(d.RATING_VALUE); })
        .y(function(d) { return yScale(d.boxoffice); })
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

    // axes
    var formatNumber = d3.format("d");
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .tickSize(3)
            .tickPadding(6));
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale)
            .tickSize(3)
            .tickPadding(6)
            .tickFormat(function(d) {
                var s = formatNumber(d / 1e6);
                return this.parentNode.nextSibling
                    ? "\xa0" + s
                    : "$" + s + "m";
            })
        );
    g.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Rotten Tomatoes Score (%)");
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Domestic Box Office (2018 dollars)");

    // points
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d,i) { return "ID_" + d.ID; })
            .attr("cx", function(d) { return xScale(d.RATING_VALUE); })
            .attr("cy", function(d) { return yScale(d.boxoffice); });

    // contours
    var ntPoints = [
        {'x':50, 'y':320000000}, 
        {'x':70, 'y':275000000}, 
        {'x':77, 'y':210000000},
        {'x':66, 'y':140000000},
        {'x':50, 'y':110000000},
        {'x':30, 'y':140000000},
        {'x':20, 'y':125000000},
        {'x':23, 'y':210000000},
        {'x':32, 'y':300000000}
    ];

    var beesPoints = [
        {'x':0,  'y': 15000000}, 
        {'x':36, 'y':120000000}, 
        {'x':53, 'y': 15000000},
        {'x':25, 'y': 12000000},
    ];

    var recessionPoints = [
        {'x':3, 'y':-4000000}, 
        {'x':3, 'y': 4000000}, 
        {'x':25, 'y': 6000000}, 
        {'x':50, 'y': 4000000}, 
        {'x':50, 'y':-4000000}, 
        {'x':25, 'y':-6000000}, 
    ];

    var kickassPoints = [
        {'x':68, 'y':110000000}, 
        {'x':77, 'y': 50000000}, 
        {'x':74, 'y':-6000000}, 
        {'x':58, 'y':-6000000}, 
        {'x':58, 'y': 75000000}, 
    ];

    var nsPoints = [
        {'x':93, 'y':235000000}, 
        {'x':97, 'y': 6000000}, 
        {'x':85, 'y':-6000000}, 
        {'x':80, 'y': 30000000}, 
        {'x':76, 'y':100000000}, 
        {'x':85, 'y':150000000}, 
    ];

    drawBoundary(ntPoints, 'orange');
    drawBoundary(beesPoints, 'purple');
    drawBoundary(recessionPoints, 'red');
    drawBoundary(kickassPoints, 'blue');
    drawBoundary(nsPoints, 'green');

    function drawBoundary(points, colour) {
        g.append("path")
            .datum(points) 
            .attr("class", "line")
            .attr("fill", colour)
            .attr("fill-opacity", 0.2)
            .attr("d", d3.line()
                .curve(d3.curveCardinalClosed)
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); })
            );
/*        g.selectAll("circle.dots")
         .data(points)
         .enter()
         .append("circle")
         .attr("cx", function(d) { return xScale(d.x); })
         .attr("cy", function(d) { return yScale(d.y); })
         .attr("r", 3);
*/
    };

    // cluster labels
    g.append("text")
        .style("fill","orange")
        .attr("fill-opacity", 0.5)
        .attr("class", "cluster-labels")
        .attr("transform",
              "translate(" + xScale(22) + " ," + 
                           yScale(210000000) + ") " +
              "rotate(-65)")
        .style("text-anchor", "middle")
        .text("A National Treasure");
    g.append("text")
        .style("fill","purple")
        .attr("fill-opacity", 0.5)
        .attr("class", "cluster-labels")
        .attr("transform",
              "translate(" + xScale(17) + " ," + 
                           yScale(86000000) + ") " +
              "rotate(-25)")
        .style("text-anchor", "middle")
        .text("Not The Bees!");
    g.append("text")
        .style("fill","red")
        .attr("fill-opacity", 0.5)
        .attr("class", "cluster-labels")
        .attr("transform",
              "translate(" + xScale(20) + " ," + 
                           yScale(-26000000) + ") " +
              "rotate(0)")
        .style("text-anchor", "middle")
        .text("The Recession");
    g.append("text")
        .style("fill","blue")
        .attr("fill-opacity", 0.5)
        .attr("class", "cluster-labels")
        .attr("transform",
              "translate(" + xScale(62) + " ," + 
                           yScale(100000000) + ") " +
              "rotate(-30)")
        .style("text-anchor", "middle")
        .text("Kick-Ass");
    g.append("text")
        .style("fill","green")
        .attr("fill-opacity", 0.5)
        .attr("class", "cluster-labels")
        .attr("transform",
              "translate(" + xScale(97) + " ," + 
                           yScale(140000000) + ") " +
              "rotate(80)")
        .style("text-anchor", "middle")
        .text("Nouveau-Shamanic");

    // Voronoi tessilations for the tooltip
    var voronoiGroup = g.append("g")
        .attr("class", "voronoi");

    var div = d3.select('body').append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    voronoiGroup.selectAll("path")
        .data(voronoi.polygons(data))
        .enter().append("path")
            .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
            .on("mouseover", function(d) {
                // find the tooltip position relative to the page
                var matrix = this.getScreenCTM()
                    .translate(xScale(d.data.RATING_VALUE), yScale(d.data.boxoffice));
                // tooltip template
                div.transition()
                    .duration(20)      
                    .style("opacity", .9);      
                div .html('<span style="font-weight:bold">' + d.data.TITLE + '</span><br>' +
                          'Rotten Tomatoes Score: ' + d.data.RATING_VALUE + '%<br>' +
                          'Domestic Box Office: $' + d.data.boxoffice)  
                    .style("left", (window.pageXOffset + matrix.e - div.node().getBoundingClientRect().width / 2)  + "px")     
                    .style("top", (window.pageYOffset + matrix.f - div.node().getBoundingClientRect().height - 10) + "px");
                // highlight the current point
                var currentCircle = d3.selectAll( "circle.ID_" + d.data.ID );
                currentCircle.style("fill", "red");
            })                  
            .on("mouseout", function(d) {
                // fade out the tooltip  
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);
                // unhighlight the point
                var currentCircle = d3.selectAll( "circle.ID_" + d.data.ID );
                currentCircle.style("fill", "grey"); 
            });

    // sources
    g.append("text")
        .attr('font-size', 12)
        .attr("transform",
              "translate(" + xScale(84) + " ," + 
                           yScale(-25000000) + ") ")
        .style("text-anchor", "left")
        .text("Sources:");
    g.append("a")
        .attr('xlink:href', 'https://fivethirtyeight.com/features/the-five-types-of-nicolas-cage-movies/')
        .append('text')
        .attr('font-size', 12)
        .style('fill', 'blue')
        .attr("transform",
              "translate(" + xScale(90) + " ," + 
                           yScale(-25000000) + ") ")
        .style("text-anchor", "left")
        .text("FiveThirtyEight");
    g.append("a")
        .attr('xlink:href', 'https://www.rottentomatoes.com/celebrity/nicolas_cage')
        .append('text')
        .attr('font-size', 12)
        .style('fill', 'blue')
        .attr("transform",
              "translate(" + xScale(90) + " ," + 
                           yScale(-34000000) + ") ")
        .style("text-anchor", "left")
        .text("Rotten Tomatoes");
    g.append("a")
        .attr('xlink:href', 'https://www.the-numbers.com/person/520401-Nicolas-Cage#tab=acting')
        .append('text')
        .attr('font-size', 12)
        .style('fill', 'blue')
        .attr("transform",
              "translate(" + xScale(90) + " ," + 
                           yScale(-43000000) + ") ")
        .style("text-anchor", "left")
        .text("The Numbers");
});
