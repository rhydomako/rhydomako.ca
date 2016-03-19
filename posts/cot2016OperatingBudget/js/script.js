var ndx;
var ProgramChart = dc.compositeChart("#program-chart");
var CategoryChart = dc.compositeChart("#category-chart");
var ExpenseRevenueChart = dc.pieChart("#expense-revenue-pie-chart");
var LineItemTable = dc.dataTable("#lineitem-table");

var formatCurrency = d3.format("$,.2f");

d3.csv('/posts/cot2016OperatingBudget/data/2016_Recommend.csv', function (error, data) {
    _.each(data, function(d){
        d['2016'] = Math.abs(+d['2016']);
        d['Value'] = formatCurrency(+d['2016']);
    });
    Plot(data);
});


// hack to tie the responsiveness of the two-bar-charts together
function textOnClick(chart, datum) {
    var filter = datum;
    dc.events.trigger(function () {
        for (var i = 0; i < chart.children().length; ++i) { chart.children()[i].filter(filter); }
        chart.redrawGroup();
    });
}

function barOnClick(chart, datum) {
    var filter = ProgramChart.keyAccessor()(datum);
    dc.events.trigger(function () {
        for (var i = 0; i < chart.children().length; ++i) { chart.children()[i].filter(filter); }
        chart.redrawGroup();
    });
}

function makeBarChart(data, ndx, column, chart) {
    var dimension = ndx.dimension( dc.pluck(column) ); 
    var expenseGroup = dimension.group().reduceSum( function(d) {
        if(d['Expense/Revenue'] == 'Expenses') {
            return d['2016'];
        } else {
            return 0.;
        }
    });
    var revenueGroup = dimension.group().reduceSum( function(d) {
        if(d['Expense/Revenue'] == 'Revenues') {
            return d['2016'];
        } else {
            return 0.;
        }
    });

    var domain = _.chain(data).pluck(column).uniq().value();

    chart
        .dimension(dimension)
        .width(800)
        .height(400)
        .x(d3.scale.ordinal().domain(domain))
        .y(d3.scale.linear())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .shareTitle(false)
        .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
        .margins({top: 10, right: 0, bottom: 250, left: 100})
        .compose([
                dc.barChart(chart)
                .colors('red')
                .group(expenseGroup, 'Expenses')
                .title(function (p) {
                    return p.key + " expenses: " + formatCurrency(p.value);
                }),
                dc.barChart(chart)
                .group(revenueGroup, 'Revenues')
                .title(function (p) {
                    return p.key + " revenues: " + formatCurrency(p.value);
                })
                ])
        .on("renderlet", function (c) {
            // rotate x-axis labels
            c.selectAll('g.x text')
            .attr('transform', 'translate(-10,10) rotate(-90)')
            .attr('dy', '+0.2rem')
            .attr('dx', '-0.05rem')
            .style("text-anchor", "end")
            .on("click", function(d) { return textOnClick(c,d); } );
        });

    for (var i = 0; i < chart.children().length; ++i) { chart.children()[i]['onClick'] = function(d) { return barOnClick(chart, d); }; }
}

function Plot(data) {
    ndx = crossfilter(data);

    makeBarChart(data, ndx, 'Category Name', CategoryChart);
    makeBarChart(data, ndx, 'Program', ProgramChart);

    //dimensions
    var spendDimension = ndx.dimension( dc.pluck('2016') );
    var expenseRevenueDimension = ndx.dimension( dc.pluck('Expense/Revenue') ); 

    //groups
    var expenseRevenueGroup = expenseRevenueDimension.group().reduceSum(
            function(d) { return d['2016']; }
            );

    var colorScale = d3.scale.ordinal().domain(["Expenses", "Revenues"])
        .range(["red", "blue"]);

    ExpenseRevenueChart
        .dimension(expenseRevenueDimension)
        .group(expenseRevenueGroup)
        .width(200)
        .height(200)
        .innerRadius(30)
        .colors(colorScale)
        .title(function (p) {
            if (p.key=='Expenses') {
                d3.select('#expense-total').text(formatCurrency(p.value));
            } else if (p.key=='Revenues') {
                d3.select('#revenue-total').text(formatCurrency(p.value)); 
            }
            return formatCurrency(p.value);
        });

    LineItemTable
        .dimension(spendDimension)
        .group( function(d) { return d['Program']; })
        .size(Infinity)
        .columns(['Program','Service','Activity','Category Name','Expense/Revenue','Value'])
        .on("renderlet", RefreshTable );

    var dynatable = $('#lineitem-table').dynatable({
        features: {
                      pushState: false,
        sort: true
                  },
        dataset: {
                     records: spendDimension.top(Infinity),
        sorts: { 'Program': 1 },
        perPageDefault: 10,
        perPageOptions: [10, 20,50, 100, 200, 500]
                 }
    }).data('dynatable');

    function RefreshTable() {
        dc.events.trigger(function () {
            dynatable.settings.dataset.originalRecords = spendDimension.top(Infinity);
            dynatable.process();
        });
    };

    dc.renderAll();
    RefreshTable();
}
