var timelineYear = document.querySelector("#timeline-year");
var timelineText = document.querySelector("#timeline-text");
var timelineCard = document.querySelector("#timeline-card");
var timelineSteps = document.querySelectorAll(".timeline-step");

var timelineYears = document.querySelector("#timeline-years");
var timelineProgress = document.querySelector("#timeline-progress");

/* clear old ticks so they don't duplicate */
timelineYears.innerHTML = "";

/* create timeline ticks */
timelineSteps.forEach(function(step, index) {
  var tick = document.createElement("div");
  tick.className = "timeline-tick";
  tick.textContent = step.dataset.year;

  if (index === 0) {
    tick.classList.add("active");
  }

  timelineYears.appendChild(tick);
});

var ticks = document.querySelectorAll(".timeline-tick");

function updateTimeline(step, index) {
  var year = step.dataset.year;
  var text = step.dataset.text;

  timelineCard.classList.add("is-changing");

  setTimeout(function() {
    timelineYear.textContent = year;
    timelineText.textContent = text;

    ticks.forEach(function(tick) {
      tick.classList.remove("active");
    });

    ticks[index].classList.add("active");

    var progressPercent = 0;

    if (ticks.length > 1) {
      progressPercent = (index / (ticks.length - 1)) * 100;
    }

    timelineProgress.style.width = progressPercent + "%";

    timelineCard.classList.remove("is-changing");
  }, 150);
}

var scroller = scrollama();

scroller
  .setup({
    step: ".timeline-step",
    offset: 0.55
  })
  .onStepEnter(function(response) {
    updateTimeline(response.element, response.index);
  });

window.addEventListener("resize", function() {
  scroller.resize();
});