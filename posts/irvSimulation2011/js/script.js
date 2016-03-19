
var colours = {"NDP-New Democratic Party": '#F78320', "Conservative": '#263893', "Liberal": '#D71921',
    "Green Party": '#3D9B35', "Bloc Québécois": '#00A7EC', "Other": 'grey'};

//
// Map defintion
//
var viewSettings = {
    mapCentreLat: 59,
    mapCentreLong: -95,
    mapZoom: 3.8,
};
var map = L.map('irv_map', {zoomControl: true, minZoom: 3})
.setView([viewSettings.mapCentreLat, viewSettings.mapCentreLong], viewSettings.mapZoom);

map.scrollWheelZoom.disable();
//
// SVG
//
var svg = d3.select(map.getPanes().overlayPane)
    .append("svg");
    var   g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var ridingBreakdownDiv = d3.select("#riding-breakdown");

var tip = d3.tip()
    .attr('class','d3-tip')
    .offset(function() {
        var BBoxHeight = this.getBBox().height;
        if(BBoxHeight > 300) {
            return [BBoxHeight*2./3., 0];
        } else {
            return [-10, 0];
        }
    })
.html(function(d) {
    var party = d.properties.results.elected_party;
    return "<strong>" + d.properties.FEDENAME + "</strong><br>" 
    + '<span style="color:' + colours[party] + '">' + d.properties.results.elected_party + "</span><br>"
    + 'Simulated number of votes: ' + d.properties.results.elected_votes + '<br><span style="color:grey">(click for breakdown)</span>';
})

svg.call(tip);

//
// Overall result
//
// column definitions
var overallColumns = [
{ head: 'Party', cl: 'title' },
{ head: 'First past the post', cl: 'center' },
{ head: 'Instant run-off (simulated)', cl: 'center' },
    ];

var overallResultTable = d3.select("#results-table").append("table").attr('class', 'table')
var overallResultHeader = overallResultTable.append("thead")
.append("tr")
    .selectAll("th")
    .data(overallColumns)
.enter()
    .append("th")
    .attr('class', function(d) { return d.cl; })
    .text(function(d) { return d.head; });


    function init(error, electoral_districts, irv_simulation) {

        var transform = d3.geo.transform({point: projectPoint});
        var path = d3.geo.path().projection(transform);

        var district_features = topojson.feature(electoral_districts, electoral_districts.objects.electoral_districts);

        //join topo-features with simulation results
        district_features.features.forEach( function(d) {
            d.properties['results'] = irv_simulation[d.properties.FEDUID];
        });

        //electoral district shape
        var feature = g.selectAll('path')
            .data(district_features.features)
            .enter()
            .append("path")
            .attr("fill", function(d) { return colours[d.properties.results.elected_party]; })
            .attr("d", path)
            .on('mouseover', tip.show)
            .on('click', function(d) { return ridingBreakdown(d); })
            .on('mouseout', tip.hide);

        //compile results from simulation json
        var overallResult = _.chain(irv_simulation)
            .map(function(d) { return d['elected_party']; })
            .groupBy(_.identity)
            .map(function(v,k) {
                return {'party':k, 'irv_seats':v.length}
            })
        .sortBy(function(d) { return d.seats; })
            .value()
            .reverse();

        fptpResult = [{'party':'Conservative', 'fptp_seats':166},
                   {'party':'NDP-New Democratic Party','fptp_seats':103},
                   {'party':'Liberal', 'fptp_seats':34},
                   {'party':'Bloc Québécois', 'fptp_seats':4},
                   {'party':'Green Party', 'fptp_seats':1}]

        var combinedResults = _.map(fptpResult, function(d) {
            var irv_index = _.indexBy(overallResult, 'party')[d.party];
            var irv_seats; 
            if (irv_index) {
                irv_seats = irv_index.irv_seats;
            } else {
                irv_seats = 0;
            };
            return {'party':d.party, 'fptp_seats':d.fptp_seats, 'irv_seats':irv_seats };
        })

        //handle right-hand-side table
        var overallResultBody = overallResultTable.append("tbody")
            .selectAll("tr")
            .data(combinedResults)
            .enter()
            .append("tr")
            .selectAll("td")
            .data( function(row, i) { 
                return [row.party, row.fptp_seats, row.irv_seats]; 
            })
        .enter()
            .append("td")
            .html( function(d) { return d; });

        map.on("viewreset", viewReset);
        viewReset();

        //leaflet overlay map manipulation
        function viewReset() {

            var bounds = path.bounds(district_features),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        }


        function ridingBreakdown(riding) {

            var rounds = riding.properties.results.rounds;
            var candidates = riding.properties.results.candidates;
            var mapped_candidates = _.indexBy(candidates,'id');

            var initial_votes = _.object( _.pluck(candidates,'id'), _.pluck(candidates,'votes'));

            function breakdowns(rounds, round, initial_votes) { 
                return _.reduce(rounds.slice(0,round), function(a,b) {
                    var bb = _.object( _.pluck(b,'id'), _.pluck(b,'votes') )
                    var ks = _.union(_.keys(a), _.keys(bb));
                var vs = _.map(ks, function(k) { return (a[k] || 0) + (bb[k] || 0) });
                return _.object(ks,vs);
                }, initial_votes);
            };

            var all_breakdowns = _.map(_.range(rounds.length + 1), function(d) { return breakdowns(rounds,d,initial_votes); });
            if(all_breakdowns.length == 0) {
                all_breakdowns = [initial_votes];
            }

            var breakdownColumns = [
            { head: 'Candiate', cl: 'title' },
            { head: 'Votes', cl: 'center' },
            ];


            //clear any existing divs
            ridingBreakdownDiv.selectAll("div").remove();
            d3.select("#breakdown-title").attr("style", "display: block");

            var breakdownTable = ridingBreakdownDiv
                .selectAll("div")
                .data(all_breakdowns)
                .enter()
                .append("div").attr('class','col-md-3 breakdown-cell')
                .append("div").html(function(d,i) { 
                    return "<p><strong>Round " + (i+1) + "</strong><br>" + 
                    "Votes needed to win: " + riding.properties.results.threshold + "<br>" +
                    "<small>(hover over name for party)</small></p>";
                })
            .append("table").attr('class', 'table')
                var breakdownTableHeader = breakdownTable.append("thead")
                .append("tr")
                .selectAll("th")
                .data(breakdownColumns)
                .enter()
                .append("th")
                .attr('class', function(d) { return d.cl; })
                .text(function(d) { return d.head; });

            var breakdownTableBody = breakdownTable.append("tbody")
                .selectAll("tr")
                .data(function(d) {
                    var filtered_pairs = _.filter( _.pairs(d), function(e) { return +e[1]>0; });
                    return _.sortBy( filtered_pairs, function(e) { return +e[1];} ).reverse();
                })
            .enter()
                .append("tr")
                .selectAll("td")
                .data(function(d) {
                    return d;
                })
            .enter()
                .append("td")
                .html(function(d,i) { 
                    if(i==0) {
                        var candidate_info = mapped_candidates[d];
                        var colour = colours[candidate_info.political_affiliation] || "#000000";
                        return "<span style='color:"+colour+"' title='" + candidate_info.political_affiliation + "'>" + candidate_info.name + "</span>";
                    } else {
                        if(d > riding.properties.results.threshold) {
                            return "<strong>" + d + "</strong>";
                        } else {
                            return d;
                        }
                    }
                });

        }


        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    }

queue()
    .defer(d3.json, "/posts/irvSimulation2011/data/electoral_districts.topojson")
    .defer(d3.json, "/posts/irvSimulation2011/data/irv_simulation.json")
    .await(init);
