async function initWinningTimesLineChart() {


    // loads file
  //  cleans each row so year and time become real numbers
  //  keep only the fields we need for this chart
  var data = await d3.csv("data/nyc_marathon.csv", function(d) {
    return {
      year: Number(d.year),
      division: d.division,
      time: d.time,
      time_hrs: Number(d.time_hrs)
    };
  });


  // splitting full data into 2 groups... one for men and one for women
  var menData = data.filter(function(d) {
  return d.division === "Men" && !isNaN(d.time_hrs);
});
var womenData = data.filter(function(d) {
  return d.division === "Women" && !isNaN(d.time_hrs);
});

// setting  overall size of the chart
  var width = 1000;
  var height = 500;

   // adding space around the edges of the chart to leave room for  axes / labels
  var margin = {
    top: 40,
    right: 40,
    bottom: 70,
    left: 100
  };

    // creating SVG area where chart will be drawn
  var svg = d3.select("#winning-times-linechart")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

     // finding the smallest and largest values in the data for years and race times to set up the chart scales
  var minYear = d3.min(data, function(d) { return d.year; });
  var maxYear = d3.max(data, function(d) { return d.year; });

  var minTime = d3.min(data, function(d) { return d.time_hrs; });
  var maxTime = d3.max(data, function(d) { return d.time_hrs; });

  //  X AXIS... basically turning years into horizontal spots on the chart
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, width - margin.right]);

     //  Y AXIS... basically turn race times into vertical positions where faster times are higher in the chart
  var yScale = d3.scaleLinear()
    .domain([maxTime, minTime])
    .range([height - margin.bottom, margin.top]);

    // create the 2 axes... x on bottom y on the side
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

  // draw the axes on the svg 
  svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);


    // create a line generator by using.... 
  var lineGenerator = d3.line()
    .x(function(d) { return xScale(d.year); }) //year for the x position
    .y(function(d) { return yScale(d.time_hrs); }); //time for the y position

//   svg.append("path")
//     .datum(menData)
//     .attr("fill", "none")
//     .attr("stroke", "#2f8fff")
//     .attr("stroke-width", 3)
//     .attr("d", lineGenerator);

//   svg.append("path")
//     .datum(womenData)
//     .attr("fill", "none")
//     .attr("stroke", "#e41665")
//     .attr("stroke-width", 3)
//     .attr("d", lineGenerator);
// }


// MEN LINE
var menPath = svg.append("path")
  .datum(menData) //use the men data
  .attr("fill", "none")
  .attr("stroke", "#2f8fff")
  .attr("stroke-width", 3)
  .attr("d", lineGenerator);

// WOMEN LINE
var womenPath = svg.append("path")
  .datum(womenData)
  .attr("fill", "none")
  .attr("stroke", "#e41665")
  .attr("stroke-width", 3)
  .attr("d", lineGenerator);





  // ANIMATION WHERE THE LINE APPEARS ON SCROLL

  // grabbing full lenght of each line 
var menLength = menPath.node().getTotalLength();
var womenLength = womenPath.node().getTotalLength();

// hide both lines at first, 
menPath
  .attr("stroke-dasharray", menLength)
  .attr("stroke-dashoffset", menLength);

womenPath
  .attr("stroke-dasharray", womenLength)
  .attr("stroke-dashoffset", womenLength);

  // selects the chart section on the page to when it enters the screen
  var linechartSection = document.querySelector(".linechart-section");

  // keeps track of whether the line animation has already happened so it doesn't keep playing over and over again
var hasAnimated = false;

  // when the chart section comes into view, start the animation, but only once
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !hasAnimated) {
      hasAnimated = true;

      // animation for men line
      menPath.transition()
    .duration(1800)
    .ease(d3.easeCubicOut)
    .attr("stroke-dashoffset", 0);

        // animation for women line
  womenPath.transition()
    .duration(1800)
    .ease(d3.easeCubicOut)
    .attr("stroke-dashoffset", 0);

    }
  });
}, {
    // start wgen 35% of the chart section is visible on screen
  threshold: 0.35
});

if (linechartSection) {
  observer.observe(linechartSection);
}
}

// helper function to converts decimal hours into normal time format... like 2:30:00
function formatTime(hours) {

    // convert hours into seconds 
  var totalSeconds = Math.round(hours * 3600);

  var h = Math.floor(totalSeconds / 3600);
  var m = Math.floor((totalSeconds % 3600) / 60);
  var s = totalSeconds % 60;

  // add a 0 in front of minutes or seconds if needed so times look cleaner
  if (m < 10) { m = "0" + m; }
  if (s < 10) { s = "0" + s; }

    // return final time as a string
  return h + ":" + m + ":" + s;
}

initWinningTimesLineChart();