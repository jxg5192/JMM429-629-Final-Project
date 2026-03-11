async function initWinningTimesSlider() {
  var data = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: Number(d.year),
      division: d.division,
      time: d.time,
      time_hrs: Number(d.time_hrs)
    };
  });


  // adding all years from the datatset to a set
  var yearSet = new Set();
  for (var i = 0; i < data.length; i++) {
    yearSet.add(data[i].year);
  }

  var years = Array.from(yearSet);
  years.sort(function(a, b) {
    return a - b;
  });

  var divisions = ["Men", "Women"];

  var width = 900;
  var height = 300;
  var margin = {
    top: 40,
    right: 120,
    bottom: 40,
    left: 120
  };

  var svg = d3.select("#winning-times-viz")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

  var maxTime = d3.max(data, function(d) {
    return d.time_hrs;
  });

  var x = d3.scaleLinear()
    .domain([0, maxTime])
    .range([margin.left, width - margin.right]);

  var y = d3.scaleBand()
    .domain(divisions)
    .range([margin.top, height - margin.bottom])
    .padding(0.35);

  var axis = d3.axisTop(x)
    .ticks(6)
    .tickFormat(formatTime);

  svg.append("g")
    .attr("transform", "translate(0," + (margin.top - 10) + ")")
    .call(axis);

  var bars = svg.selectAll("rect")
    .data(divisions)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function(d) {
      return y(d);
    })
    .attr("height", y.bandwidth())
    .attr("rx", 8)
    .attr("width", 0)
    .attr("fill", function(d) {
      if (d === "Men") {
        return "#2f8fff";
      } else {
        return "#ff2b3a";
      }
    });

  svg.selectAll(".division-label")
    .data(divisions)
    .enter()
    .append("text")
    .attr("class", "division-label")
    .attr("x", margin.left - 20)
    .attr("y", function(d) {
      return y(d) + y.bandwidth() / 2 + 6;
    })
    .attr("text-anchor", "end")
    .text(function(d) {
      return d;
    });

  var valueLabels = svg.selectAll(".value-label")
    .data(divisions)
    .enter()
    .append("text")
    .attr("class", "value-label");

  var slider = document.getElementById("year-slider");
  var yearText = document.getElementById("selected-year");

  slider.min = 0;
  slider.max = years.length - 1;
  slider.value = 0;

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

  function updateChart(year) {
    yearText.textContent = year;

    var yearData = data.filter(function(d) {
      return d.year === year;
    });

    bars.attr("width", function(d) {
      var row = null;

      for (var i = 0; i < yearData.length; i++) {
        if (yearData[i].division === d) {
          row = yearData[i];
        }
      }

      if (row) {
        return x(row.time_hrs) - x(0);
      } else {
        return 0;
      }
    });

    valueLabels
      .attr("x", function(d) {
        var row = null;

        for (var i = 0; i < yearData.length; i++) {
          if (yearData[i].division === d) {
            row = yearData[i];
          }
        }

        if (row) {
          return x(row.time_hrs) + 10;
        } else {
          return x(0) + 10;
        }
      })
      .attr("y", function(d) {
        return y(d) + y.bandwidth() / 2 + 6;
      })
      .text(function(d) {
        var row = null;

        for (var i = 0; i < yearData.length; i++) {
          if (yearData[i].division === d) {
            row = yearData[i];
          }
        }

        if (row) {
          return row.time;
        } else {
          return "No time";
        }
      });
  }

  updateChart(years[0]);

  slider.addEventListener("input", function() {
    var selectedIndex = Number(this.value);
    var selectedYear = years[selectedIndex];
    updateChart(selectedYear);
  });
}

initWinningTimesSlider();