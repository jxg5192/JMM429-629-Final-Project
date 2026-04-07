
// get all borough items on the page 
  var boroughItems = document.querySelectorAll(".borough-item");
  // get the tooltip box
var boroughTooltip = document.querySelector("#borough-tooltip");

// loop through each borough 
boroughItems.forEach(function(item) {

  // when u hover on the borough.....
  item.addEventListener("mouseenter", function(event) {

        // grab the data stored on the element (title, miles, description)
    var title = this.dataset.title;
    var miles = this.dataset.miles;
    var description = this.dataset.description;

        // fill the tooltip with the correct content
    boroughTooltip.innerHTML =
      "<div class='tooltip-year'>" + title + "</div>" +
      "<div class='tooltip-name'>" + miles + "</div>" +
      "<div class='tooltip-meta'>" + description + "</div>";

          // and make the tooltip visible
    boroughTooltip.style.opacity = 1;
  });

  // when you move your mouse
  // item.addEventListener("mousemove", function(event) {

  //       // move the tooltip to follow your mouse
  //   boroughTooltip.style.left = event.pageX + "px";
  //   boroughTooltip.style.top = event.pageY + "px";

  // });
//   item.addEventListener("mousemove", function(event) {
//   boroughTooltip.style.left = event.pageX + 30 + "px";
//   boroughTooltip.style.top = event.pageY - 10 + "px";
// });
item.addEventListener("mousemove", function(event) {
  const parentRect = this.closest(".route-left").getBoundingClientRect();

  boroughTooltip.style.left = (event.clientX - parentRect.left + 30) + "px";
  boroughTooltip.style.top = (event.clientY - parentRect.top - 10) + "px";
});

  // when you remove mouse from borough...
  item.addEventListener("mouseleave", function() {

        // hide the tooltip
    boroughTooltip.style.opacity = 0;

  });

});