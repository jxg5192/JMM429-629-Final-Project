function initBoroughMap() {

  var container = d3.select("#borough-map");

  if (container.empty()) {
    return;
  }

  if (container.attr("data-loaded") === "true") {
    return;
  }

  container.attr("data-loaded", "true");

  var width = 900;
  var height = 700;

  var svg = container.append("svg");
  svg.attr("viewBox", "0 0 " + width + " " + height);
  svg.attr("preserveAspectRatio", "xMidYMid meet");

  d3.json("data/nyc.geojson").then(function(geoData) {

    var projection = d3.geoMercator();
    projection.center([-73.935242, 40.730610]);
    projection.scale(45000);
    projection.translate([width / 2, height / 2]);

    var pathGenerator = d3.geoPath();
    pathGenerator.projection(projection);

    var paths = svg.selectAll(".map-borough");
    paths = paths.data(geoData.features);

    paths.enter()
      .append("path")
      .attr("class", "map-borough")
      .attr("d", function(d) {
        return pathGenerator(d);
      });

    function clearMapHighlight() {
      svg.selectAll(".map-borough").classed("active", false);
    }

    function highlightMapBorough(boroughName) {
      clearMapHighlight();

      svg.selectAll(".map-borough")
        .filter(function(d) {
          return d.properties.boro_name === boroughName;
        })
        .classed("active", true);
    }

    var boroughItems = document.querySelectorAll(".borough-item");

    for (var i = 0; i < boroughItems.length; i++) {

      boroughItems[i].addEventListener("mouseenter", function() {
        var boroughName = this.getAttribute("data-borough");
        highlightMapBorough(boroughName);
      });

      boroughItems[i].addEventListener("mouseleave", function() {
        clearMapHighlight();
      });
    }

  });
}

initBoroughMap();