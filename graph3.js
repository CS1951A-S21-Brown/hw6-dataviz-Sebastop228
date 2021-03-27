
let svg3 = d3.select('#graph3')
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

let countRef3 = svg3.append("g");
let y_axis_label = svg3.append("g");

svg3.append("text")
    .attr("transform", `translate(${-100}, ${(graph_3_height-margin.bottom-margin.top)/2})`)
    .style("text-anchor", "middle")
    .text("Nation");

let x_axis_text = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width-margin.left-margin.right)/2}, ${(graph_3_height-margin.top-margin.bottom +15)})`)
    .style("text-anchor", "middle")

let title_text = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width-margin.left-margin.right)/2}, ${-10})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)

function setDataGraph3(num){
    d3.csv('football.csv').then(function(data) {
        if(num === 0){
            data = cleanData_graph3_gd(data);
        } else if (num === 1){
            data = cleanData_graph3_wp(data);
        }
        let x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){return parseInt(d.criteria);})])
            .range([0,graph_3_width - margin.left - margin.right]);

        let y = d3.scaleBand()
            .domain(data.map(function(d){return d['nation'];}))
            .range([0,graph_3_height - margin.top-margin.bottom])
            .padding(0.1);
        
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        // svg3.append("g")
        //     .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg3.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d["nation"]; }))
            .range(d3.quantize(d3.interpolateHcl("#71f05d", "#1b9e06"), 10));

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", function(d) { return color(d['nation']); })
            .attr("x", x(0))
            .attr("y", function(d){ return y(d['nation']);})
            .attr("width", function(d){ return x(parseInt(d.criteria));})
            .attr("height",  y.bandwidth());

        let counts = countRef3.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d){ return x(parseInt(d.criteria))+10;})
            .attr("y", function(d){ return y(d.nation)+25;})
            .style("text-anchor", "start")
            .text(function(d){ return d.criteria;});
        
        if(num === 0){
            x_axis_text.text("Goal differential");
            title_text.text("Top 10 performing nations over the last 2 World Cups - Goal Differential");
        } else if (num === 1){
            x_axis_text.text("Win Percentage (%)");
            title_text.text("Top 10 performing nations over the last 2 World Cups - Win Percentage");
        }
        bars.exit().remove();
        counts.exit().remove();
    });
}

function cleanData_graph3_gd(data){
    var wins_dict = {};
    for(var i = 0; i < data.length; i++){
        var year = new Date(data[i].date).getFullYear().toString();
        var tournament = data[i].tournament
        if(!(tournament === "FIFA World Cup" && (year === "2014" || year === "2018"))){
            continue;
        }
        var home_team= data[i].home_team;
        var away_team = data[i].away_team;
        var home_score = parseInt(data[i].home_score);
        var away_score = parseInt(data[i].away_score);
        if(!(home_team in wins_dict)){
            wins_dict[home_team] = 0;
        }
        if(!(away_team in wins_dict)){
            wins_dict[away_team] = 0;
        }
        wins_dict[home_team] += home_score;
        wins_dict[home_team] -= away_score;

        wins_dict[away_team] += away_score;
        wins_dict[away_team] -= home_score;
    }
    var items = Object.keys(wins_dict).map(function(key) {
        var temp_dict = {};
        temp_dict[key] = wins_dict[key].toString();
        return temp_dict;
    });

    var mapped = items.map(d => {
        return {
          nation: Object.keys(d)[0],
          criteria: d[Object.keys(d)[0]]
        }
      });

    return mapped.sort(function(a,b){
        return parseInt(b.criteria) - parseInt(a.criteria);
        }).slice(0,10);
}

function cleanData_graph3_wp(data){
    var wins_dict = {};
    for(var i = 0; i < data.length; i++){
        var year = new Date(data[i].date).getFullYear().toString();
        var tournament = data[i].tournament
        if(!(tournament === "FIFA World Cup" && (year === "2014" || year === "2018"))){
            continue;
        }
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
    console.log(wins_dict);
    for(var key in wins_dict){
        var win_per = wins_dict[key][0]/wins_dict[key][1];
        wins_dict[key] = win_per;
    }
    console.log(wins_dict);
    var items = Object.keys(wins_dict).map(function(key) {
        var temp_dict = {};
        temp_dict[key] = (wins_dict[key] * 100).toFixed(1).toString().concat("%");
        return temp_dict;
    });
    console.log(items);

    var mapped = items.map(d => {
        return {
          nation: Object.keys(d)[0],
          criteria: d[Object.keys(d)[0]]
        }
      });

    return mapped.sort(function(a,b){
        return parseInt(b.criteria) - parseInt(a.criteria);
        }).slice(0,10);
}

setDataGraph3(0);