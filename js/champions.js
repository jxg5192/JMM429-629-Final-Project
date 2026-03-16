async function initChampionsViz() {

  // for the actual chart
  var container = d3.select("#champions-viz");

    // for the tooltip/popup for the chart
  var tooltip = d3.select("#champions-tooltip");

  if (container.empty()) return;

  // load dataset
  var rawData = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: +d.year,
      name: d.name,
      country: d.country,
      time: d.time,
      time_hrs: +d.time_hrs,
      division: d.division,
      note: d.note
    };
  });

  // remove invalid rows.... if row is missing year, name, or time, remove from the dataset
  var cleanedData = rawData.filter(function(d) {
    return d.year && d.name && !isNaN(d.time_hrs);
  });

  // group data by yr so all runners from the same year are together
  var grouped = d3.group(cleanedData, function(d) {
    return d.year;
  });

  // get fastest per year
  var fastestByYear = Array.from(grouped, function(entry) {
    var year = entry[0];
    var values = entry[1];

    // the first runner in the list is the fastest
    var fastest = values[0];

    // looping through all runners in that year, and keep the one with the smallest time (the fastest runner)
    for (var i = 1; i < values.length; i++) {
      if (values[i].time_hrs < fastest.time_hrs) {
        fastest = values[i];
      }
    }

    return fastest;
  });

// Sort everything from oldest year to newest year
  fastestByYear.sort(function(a, b) {
    return a.year - b.year;
  });


  // function to group the years by tens (so 1972 is 1970s... etc.)
  function getDecade(year) {
    var decade = Math.floor(year / 10) * 10;
    return decade + "s";
  }

  // spacing/padding for the chart
  var margin = { top: 20, right: 30, bottom: 30, left: 30 };
  var cols = 9;     // 9 columns
  var circleRadius = 26;    // circle size
  var xGap = 88;   // space btwn the circles
  var yGap = 92;


  // draw the actual chart
  function render() {

    container.selectAll("*").remove();


    // calculating how many rows we need
    var rows = Math.ceil(fastestByYear.length / cols);


    // calculating size of the SVG
    var width = margin.left + margin.right + (cols - 1) * xGap + circleRadius * 2;
    var height = margin.top + margin.bottom + rows * yGap;

    // creating SVG
    var svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 " + width + " " + height);

      // shifts everything inside (for margins)
    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // turning each data point into a circle position
    var nodes = fastestByYear.map(function(d, i) {

      // to fugure it out which col/row the circle goes in
      var col = i % cols;
      var row = Math.floor(i / cols);

      return {
        year: d.year,
        name: d.name,
        country: d.country,
        time: d.time,
        time_hrs: d.time_hrs,
        division: d.division,
        note: d.note,
        x: col * xGap + circleRadius,   // adds x position for the circle
        y: row * yGap + circleRadius // adds y position for the circle
      };
    });

    // one group per circle
    var nodeGroups = g.selectAll(".champion-node")
      .data(nodes, function(d) { return d.year; })     // Connects data to elements (each year = one circle)
      .enter()
      .append("g") // Creates a group for each data point
      .attr("class", "champion-node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    nodeGroups.append("circle") //add a circle for each year 
      .attr("r", circleRadius) //size of circle
      .attr("fill", "#fc6b06") //color of circle
      .attr("opacity", 0.98)
      .on("mouseenter", function(event, d) { //when you hover on the circle do...

        d3.select(this)
          .transition()
          .duration(120)
          .style("filter", "drop-shadow(0 0 7px #fc6b06)") //circle glows
          .attr("r", circleRadius + 5); //circle gets a bit bigger

        tooltip //shows you the tooltip
          .style("opacity", 1)
          // fills the tooltip with the correpsonding yr, winner, country, time
          .html(
            "<div class='tooltip-year'>" + d.year + "</div>" +
            "<div class='tooltip-name'>" + d.name + "</div>" +
            "<div class='tooltip-meta'>Country: " + d.country + "</div>" +
            "<div class='tooltip-meta'>Time: " + d.time + "</div>"
          );
      })
      .on("mousemove", function(event) { 
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseleave", function() { //when the mouse moves from the ciricle d...

        // stop glowing and reurn to normal size 
        d3.select(this)
          .transition()
          .duration(120)
          .style("filter", "none")
          .attr("r", circleRadius);

          // and hide the tooltip
        tooltip.style("opacity", 0);
      });



    nodeGroups.append("text") //add year lable under each circle
      .attr("class", "year-label")
      .attr("y", circleRadius + 24)
      .attr("fill", "#fc6b06")
      // show the year number
      .text(function(d) {
        return d.year;
      });
  }

  render();
}

initChampionsViz();