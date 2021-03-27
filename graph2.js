
let svg2 = d3.select('#graph2')
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height+100)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

let countRef2 = svg2.append("g");

d3.csv('football.csv').then(function(data) {
    data = cleanData_graph2(data);

    // let x = d3.scaleLinear()
    //     .domain([0, d3.max(data, function(d){return parseFloat(d.win_percentage);})])
    //     .range([0,graph_2_width - margin.left - margin.right]);

    // let y = d3.scaleBand()
    //     .domain(data.map(function(d){return d['nation'];}))
    //     .range([0,graph_2_height - margin.top-margin.bottom])
    //     .padding(0.1);

    let x = d3.scaleBand()
        .domain(data.map(function(d) { return d['nation']; }))
        .range([0,graph_2_width - margin.left - margin.right])
        // .padding(0.1);

    svg2.append("g")
        .attr("transform", "translate(0," + (graph_2_height - margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-37.5)")
        .style("text-anchor", "end");

    let y = d3.scaleLinear()
        .domain([d3.min(data, function(d){return parseInt(d.win_percentage);})-10,d3.max(data, function(d){return parseInt(d.win_percentage);})+10])
        .range([graph_2_height - margin.top-margin.bottom, 0]);

        
    svg2.append("g").call(d3.axisLeft(y).tickSize(5).tickPadding(10));


    // let bars = svg2.selectAll("rect").data(data);

    // let color = d3.scaleOrdinal()
    //     .domain(data.map(function(d) { return d["nation"]; }))
    //     .range(d3.quantize(d3.interpolateHcl("#71f05d", "#1b9e06"), 10));

    svg2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#1b9e06")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.nation)+25; })
            .y(function(d) { return y(parseFloat(d.win_percentage)); })
            
    );

    var Tooltip = d3.select("#graph2")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var mouseover = function(d) {
        Tooltip.style("opacity", 1);
      }
    var mousemove = function(d) {
        Tooltip.html(d.nation + " Win Percentage (%): " + d.win_percentage)
            .style("left", (d3.mouse(this)[0]+ 150) + "px")
            .style("top", (d3.mouse(this)[1]+225) + "px");
      }
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0);
    }


    
    svg2.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.nation)+23; } )
        .attr("cy", function(d) { return y(parseFloat(d.win_percentage)); } )
        .attr("r", 8)
        // .attr("fill", "#69b3a2")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // bars.enter()
    //     .append("rect")
    //     .merge(bars)
    //     .attr("fill", function(d) { return color(d['nation']); })
    //     .attr("x", function(d){ return x(d['nation']);})
    //     .attr("y", function(d){ return y(parseFloat(d.win_percentage));})
    //     .attr("width", x.bandwidth())
    //     .attr("height",  function(d){ return graph_2_height - margin.top - margin.bottom - y(parseFloat(d.win_percentage));});

    // let counts = countRef2.selectAll("text").data(data);

    // counts.enter()
    //     .append("text")
    //     .merge(counts)
    //     .attr("x", function(d){ return x(d['nation'])+7;})
    //     .attr("y", function(d){ return y(parseFloat(d.win_percentage))-10;})
    //     .style("text-anchor", "start")
    //     .text(function(d){ return d.win_percentage;});

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width-margin.left-margin.right)/2}, ${(graph_2_height-margin.top-margin.bottom +75)})`)
        .style("text-anchor", "middle")
        .text("Nation");

    svg2.append("text")
        .attr("transform", `translate(${-100}, ${(graph_2_height-margin.bottom-margin.top)/2})`)
        .style("text-anchor", "middle")
        .text("Win Percentage (%)");

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width-margin.left-margin.right)/2}, ${-10})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 nations by win percentage");

});

function cleanData_graph2(data){
    var wins_dict = {};
    for(var i = 0; i < data.length; i++){
        var home_team= data[i].home_team;
        var away_team = data[i].away_team;
        var home_score = parseInt(data[i].home_score);
        var away_score = parseInt(data[i].away_score);
        if(!(home_team in wins_dict)){
            wins_dict[home_team] = [0,0];
        }
        if(!(away_team in wins_dict)){
            wins_dict[away_team] = [0,0];
        }
        if(home_score > away_score){
            wins_dict[home_team][0]++;
        } else if (home_score < away_score){
            wins_dict[away_team][0]++;
        }
        wins_dict[home_team][1]++;
        wins_dict[away_team][1]++;
    }
    for(var key in wins_dict){
        if(wins_dict[key][1]<75){ //Minimum number of games
            delete wins_dict[key];
            continue;
        }
        var win_per = wins_dict[key][0]/wins_dict[key][1];
        wins_dict[key] = win_per;
    }
    var items = Object.keys(wins_dict).map(function(key) {
        var temp_dict = {};
        temp_dict[key] = (wins_dict[key]*100).toFixed(1).toString().concat("%");
        return temp_dict;
    });

    var mapped = items.map(d => {
        return {
          nation: Object.keys(d)[0],
          win_percentage: d[Object.keys(d)[0]]
        }
      });


    return mapped.sort(function(a,b){
        return parseFloat(b.win_percentage) - parseFloat(a.win_percentage);
        }).slice(0,10);


}