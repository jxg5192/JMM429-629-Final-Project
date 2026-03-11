async function initWinningTimesDotplot() {
  var data = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: Number(d.year),
      division: d.division,
      time: d.time,
      time_hrs: Number(d.time_hrs)
    };
  });

  var cleanedData = data.filter(function(d) {
    return !isNaN(d.year) && !isNaN(d.time_hrs);
  });

  var width = 1000;
  var height = 500;

  var margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 100
  };

  var svg = d3.select("#winning-times-dotplot")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");

  var minYear = d3.min(cleanedData, function(d) {
    return d.year;
  });

  var maxYear = d3.max(cleanedData, function(d) {
    return d.year;
  });

  var minTime = d3.min(cleanedData, function(d) {
    return d.time_hrs;
  });

  var maxTime = d3.max(cleanedData, function(d) {
    return d.time_hrs;
  });

  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, width - margin.right]);

  var yScale = d3.scaleLinear()
    .domain([maxTime, minTime])
    .range([height - margin.bottom, margin.top]);

  var xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));

  var yAxis = d3.axisLeft(yScale)
    .tickFormat(formatTime);

  svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .attr("class", "dotplot-axis")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .attr("class", "dotplot-axis")
    .call(yAxis);

  svg.append("text")
    .attr("class", "dotplot-axis-label")
    .attr("x", width / 2)
    .attr("y", height - 20)
    .attr("text-anchor", "middle")
    .text("Year");

  svg.append("text")
    .attr("class", "dotplot-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("Winning Time");

  svg.selectAll(".winning-dot")
    .data(cleanedData)
    .enter()
    .append("circle")
    .attr("class", "winning-dot")
    .attr("cx", function(d) {
      return xScale(d.year);
    })
    .attr("cy", function(d) {
      return yScale(d.time_hrs);
    })
    .attr("r", 7)
    .attr("fill", function(d) {
      if (d.division === "Men") {
        return "#2f8fff";
      } else {
        return "#ff2b3a";
      }
    })
    .attr("opacity", 0.9);
}

function formatTime(hours) {
  var totalSeconds = Math.round(hours * 3600);
  var h = Math.floor(totalSeconds / 3600);
  var m = Math.floor((totalSeconds % 3600) / 60);
  var s = totalSeconds % 60;

  if (m < 10) {
    m = "0" + m;
  }

  if (s < 10) {
    s = "0" + s;
  }

  return h + ":" + m + ":" + s;
}

initWinningTimesDotplot();