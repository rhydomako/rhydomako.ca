$.get("/posts/cot2014CapitalBudget/data/capital_2014.tsv", function(d) {
    $("#pivot-table").pivotUI( $.tsv.parseRows(d), {
        rows: ["Ward Number", "Ward Name"],
        cols: ["Year"],
        aggregatorName: "Integer Sum",
        vals: ["Budgeted"],
        rendererName: "Heatmap"
        }
    );
});
