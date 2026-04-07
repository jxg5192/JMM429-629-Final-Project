async function initWinningTimesRace() {
  var container = d3.select("#winning-times-viz");

  if (container.empty()) return;
  if (container.attr("data-loaded") === "true") return;
  container.attr("data-loaded", "true");

  // load CSV data
  var rawData = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: +d.year,
      name: d.name,
      country: d.country,
      time: d.time,
      time_hrs: isNaN(+d.time_hrs) ? null : +d.time_hrs,
      division: d.division,
      note: d.note
    };
  });

  // get all years, remove duplicates, sort earliest to latest
  var years = Array.from(
    new Set(
      rawData.map(function(d) {
        return d.year;
      })
    )
  ).sort(function(a, b) {
    return a - b;
  });

  var divisions = ["Men", "Women"];

  // create a  lookup map like "1970-Men" -> row data
  var recordMap = new Map(
    rawData.map(function(d) {
      return [d.year + "-" + d.division, d];
    })
  );

  // create one frame per year, with one bar for men and one for women
  var frames = years.map(function(year) {
    return divisions.map(function(division) {
      var row = recordMap.get(year + "-" + division);

      // if data is missing, use placeholder values
      if (!row || row.time_hrs === null || !row.name || row.name === "NA") {
        return {
          year: year,
          division: division,
          name: "No official finisher",
          country: "—",
          time: "No time",
          time_hrs: 0,
          note: row && row.note ? row.note : ""
        };
      }

      return {
        year: year,
        division: division,
        name: row.name,
        country: row.country,
        time: row.time,
        time_hrs: row.time_hrs,
        note: row.note ? row.note : ""
      };
    });
  });

  var width = 1100;
  var height = 460;
  var margin = { top: 90, right: 170, bottom: 60, left: 170 };

  // find the largest winning time so the scale has enough room
  var maxTime = d3.max(rawData, function(d) {
    return d.time_hrs || 0;
  });

  var x = d3.scaleLinear()
    .domain([0, maxTime * 1.08])
    .range([margin.left, width - margin.right]);

  var y = d3.scaleBand()
    .domain(divisions)
    .range([margin.top, height - margin.bottom])
    .padding(0.35);

  var color = d3.scaleOrdinal()
    .domain(divisions)
    .range(["#2f8fff", " #e41665"]);

  var svg = container
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");

  var axis = d3.axisTop(x)
    .ticks(6)
    .tickFormat(function(d) {
      return formatRaceTime(d);
    });

  svg.append("g")
    .attr("class", "race-axis")
    .attr("transform", "translate(0," + (margin.top - 20) + ")")
    .call(axis);

  var barsGroup = svg.append("g");
  var labelsGroup = svg.append("g");

  // year label in the background
  var yearLabel = svg.append("text")
    .attr("class", "race-year-label")
    .attr("x", width - margin.right)
    .attr("y", 70);

  function formatRaceTime(hours) {
    if (!hours || hours <= 0) return "0:00:00";

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

  function update(frame) {
    yearLabel.text(frame[0].year);

    var bars = barsGroup.selectAll(".race-bar")
      .data(frame, function(d) {
        return d.division;
      });

    bars.enter()
      .append("rect")
      .attr("class", "race-bar")
      .attr("x", x(0))
      .attr("y", function(d) {
        return y(d.division);
      })
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("rx", 8)
      .attr("fill", function(d) {
        return color(d.division);
      })
      .merge(bars)
      .transition()
      .duration(900)
      .ease(d3.easeLinear)
      .attr("y", function(d) {
        return y(d.division);
      })
      .attr("width", function(d) {
        return Math.max(0, x(d.time_hrs) - x(0));
      })
      .attr("fill", function(d) {
        return color(d.division);
      });

    bars.exit().remove();

    var divisionLabels = labelsGroup.selectAll(".race-division-label")
      .data(frame, function(d) {
        return d.division;
      });

    divisionLabels.enter()
      .append("text")
      .attr("class", "race-division-label")
      .attr("x", margin.left - 20)
      .attr("y", function(d) {
        return y(d.division) + y.bandwidth() / 2 + 6;
      })
      .attr("text-anchor", "end")
      .merge(divisionLabels)
      .transition()
      .duration(900)
      .ease(d3.easeLinear)
      .attr("y", function(d) {
        return y(d.division) + y.bandwidth() / 2 + 6;
      })
      .text(function(d) {
        return d.division;
      });

    divisionLabels.exit().remove();

    var valueLabels = labelsGroup.selectAll(".race-value-label")
      .data(frame, function(d) {
        return d.division;
      });

    valueLabels.enter()
      .append("text")
      .attr("class", "race-value-label")
      .attr("x", function(d) {
        return x(d.time_hrs) + 12;
      })
      .attr("y", function(d) {
        return y(d.division) + y.bandwidth() / 2 + 6;
      })
      .merge(valueLabels)
      .transition()
      .duration(900)
      .ease(d3.easeLinear)
      .attr("x", function(d) {
        return x(d.time_hrs) + 12;
      })
      .attr("y", function(d) {
        return y(d.division) + y.bandwidth() / 2 + 6;
      })
      .text(function(d) {
        if (d.time_hrs > 0) {
          return d.time;
        } else {
          return "No time";
        }
      });

    valueLabels.exit().remove();
  }

  var frameIndex = 0;
  update(frames[frameIndex]);

  d3.interval(function() {
    frameIndex = (frameIndex + 1) % frames.length;
    update(frames[frameIndex]);
  }, 1200);
}

// wait until the section scrolls into view, then load the chart once
var winningTimesSection = document.querySelector("#winning-times-section");

if (winningTimesSection) {
  var hasLoadedWinningTimes = false;

  var winningTimesObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !hasLoadedWinningTimes) {
        initWinningTimesRace();
        hasLoadedWinningTimes = true;
      }
    });
  }, { threshold: 0.3 });

  winningTimesObserver.observe(winningTimesSection);
}