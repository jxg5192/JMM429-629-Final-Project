async function initChampionsViz() {
  const container = d3.select("#champions-viz");
  const tooltip = d3.select("#champions-tooltip");

  if (container.empty()) return;

//   load dataset
  const rawData = await d3.csv("data/nyc_marathon.csv", d => ({
    year: +d.year,
    name: d.name,
    country: d.country,
    time: d.time,
    time_hrs: +d.time_hrs,
    division: d.division,
    note: d.note
  }));

  // removing rows where year and name is missing
  const cleanedData = rawData.filter(d =>
    d.year &&
    d.name &&
    !isNaN(d.time_hrs)
  );

  // For each year, keep the fastest overall winner
  const fastestByYear = Array.from(
    d3.group(cleanedData, d => d.year),
    ([year, values]) => values.reduce((fastest, current) =>
      current.time_hrs < fastest.time_hrs ? current : fastest
    )
  ).sort((a, b) => a.year - b.year);



  function getDecade(year) {
    const decade = Math.floor(year / 10) * 10;
    return `${decade}s`;
  }

 

  const margin = { top: 20, right: 30, bottom: 30, left: 30 };
  const cols = 9;
  const circleRadius = 26;
  const xGap = 88;
  const yGap = 92;

  function render() {
    container.selectAll("*").remove();

    const rows = Math.ceil(fastestByYear.length / cols);
    const width = margin.left + margin.right + (cols - 1) * xGap + circleRadius * 2;
    const height = margin.top + margin.bottom + rows * yGap;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const nodes = fastestByYear.map((d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      return {
        ...d,
        x: col * xGap + circleRadius,
        y: row * yGap + circleRadius
      };
    });

    const nodeGroups = g.selectAll(".champion-node")
      .data(nodes, d => d.year)
      .enter()
      .append("g")
      .attr("class", "champion-node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodeGroups.append("circle")
      .attr("r", circleRadius)
      .attr("fill", "#2f8fff")
    //   .attr("opacity", 0.98)
    //   .style("filter", `drop-shadow(0 0 8px #2f8fff)`)
      .on("mouseenter", function(event, d) {
        d3.select(this)
        //   .transition()
        //   .duration(120)
        //   .attr("r", circleRadius + 5);

        tooltip
          .style("opacity", 1)
          .html(`
            <div class="tooltip-year">${d.year}</div>
            <div class="tooltip-name">${d.name}</div>
            <div class="tooltip-meta">Country: ${d.country}</div>
            <div class="tooltip-meta">Time: ${d.time}</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(120)
        //   .attr("r", circleRadius);

        tooltip.style("opacity", 0);
      });

    nodeGroups.append("text")
      .attr("class", "year-label")
      .attr("y", circleRadius + 24)
      .attr("fill", "#2f8fff")
      .text(d => d.year);
  }

  render();
}

initChampionsViz();