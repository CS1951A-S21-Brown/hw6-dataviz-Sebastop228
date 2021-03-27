// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg = d3.select('#graph1')
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

let countRef = svg.append("g");

d3.csv('football.csv').then(function(data) {
    data = cleanData_graph1(data);

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return parseInt(d.count);})])
        .range([0,graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
        .domain(data.map(function(d){return d['year'];}))
        .range([0,graph_1_height - margin.top-margin.bottom])
        .padding(0.1);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["year"]; }))
        .range(d3.quantize(d3.interpolateHcl("#71f05d", "#1b9e06"), 5));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['year']); })
        .attr("x", x(0))
        .attr("y", function(d){ return y(d['year']);})
        .attr("width", function(d){ return x(parseInt(d.count));})
        .attr("height",  y.bandwidth());

    let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d){ return x(parseInt(d.count))+10;})
        .attr("y", function(d){ return y(d.year)+20;})
        .style("text-anchor", "start")
        .text(function(d){ return d.count;});

    svg.append("text")
        .attr("transform", `translate(${(graph_1_width-margin.left-margin.right)/2}, ${(graph_1_height-margin.top-margin.bottom +15)})`)
        .style("text-anchor", "middle")
        .text("Count");

    svg.append("text")
        .attr("transform", `translate(${-70}, ${(graph_1_height-margin.bottom-margin.top)/2})`)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", `translate(${(graph_1_width-margin.left-margin.right)/2}, ${-10})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Football matches played 2010-2014");

});

function cleanData_graph1(data){
    var year_dict = {
        "2010" : 0,
        "2011" : 0,
        "2012" : 0,
        "2013" : 0,
        "2014" : 0
    };
    for(var i = 0; i < data.length; i++){
        var d = new Date(data[i].date);
        if(d.getFullYear().toString() in year_dict){
            year_dict[d.getFullYear().toString()]++;
        }
    }

    var year_data = [];

    for(var year_key in year_dict){
        var temp_dict = {};
        temp_dict[year_key] = year_dict[year_key].toString();
        year_data.push(temp_dict);
    };
    var mapped = year_data.map(d => {
        return {
          year: Object.keys(d)[0],
          count: d[Object.keys(d)[0]]
        }
      });
    return mapped;
}