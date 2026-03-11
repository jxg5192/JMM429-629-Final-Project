async function initWinningTimesLineChart() {

  var data = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: Number(d.year),
      division: d.division,
      time: d.time,
      time_hrs: Number(d.time_hrs)
    };
  });

  var menData = data.filter(function(d) {
    return d.division === "Men";
  });

  var womenData = data.filter(function(d) {
    return d.division === "Women";
  });

  var width = 1000;
  var height = 500;

  var margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 100
  };

  var svg = d3.select("#winning-times-linechart")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

  var minYear = d3.min(data, function(d) { return d.year; });
  var maxYear = d3.max(data, function(d) { return d.year; });

  var minTime = d3.min(data, function(d) { return d.time_hrs; });
  var maxTime = d3.max(data, function(d) { return d.time_hrs; });

  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, width - margin.right]);

  var yScale = d3.scaleLinear()
    .domain([maxTime, minTime])
    .range([height - margin.bottom, margin.top]);

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

  svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

  var lineGenerator = d3.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.time_hrs); });

  svg.append("path")
    .datum(menData)
    .attr("fill", "none")
    .attr("stroke", "#2f8fff")
    .attr("stroke-width", 3)
    .attr("d", lineGenerator);

  svg.append("path")
    .datum(womenData)
    .attr("fill", "none")
    .attr("stroke", "#ff2b3a")
    .attr("stroke-width", 3)
    .attr("d", lineGenerator);
}

function formatTime(hours) {

  var totalSeconds = Math.round(hours * 3600);

  var h = Math.floor(totalSeconds / 3600);
  var m = Math.floor((totalSeconds % 3600) / 60);
  var s = totalSeconds % 60;

  if (m < 10) { m = "0" + m; }
  if (s < 10) { s = "0" + s; }

  return h + ":" + m + ":" + s;
}

initWinningTimesLineChart();