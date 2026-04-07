function initFastestRecord() {
  d3.csv("data/nyc_marathon.csv", function(d) {
    var timeHours;

    if (d.time_hrs === "") {
      timeHours = null;
    } else {
      timeHours = +d.time_hrs;
    }

    return {
      year: +d.year,
      name: d.name,
      country: d.country,
      time: d.time,
      time_hrs: timeHours,
      division: d.division,
      note: d.note
    };
  }).then(function(data) {
    var validRows = [];
    var i;

    for (i = 0; i < data.length; i++) {
      if (data[i].name && data[i].time && data[i].time_hrs != null) {
        validRows.push(data[i]);
      }
    }

    if (validRows.length === 0) {
      return;
    }

    var fastest = validRows[0];

    for (i = 1; i < validRows.length; i++) {
      if (validRows[i].time_hrs < fastest.time_hrs) {
        fastest = validRows[i];
      }
    }

    document.getElementById("record-time").textContent = fastest.time;
    document.getElementById("record-name").textContent = fastest.name.toUpperCase();
    document.getElementById("record-pace").textContent = formatPaceFromHours(fastest.time_hrs);
    document.getElementById("record-year").textContent = fastest.year;
    document.getElementById("record-division").textContent = fastest.division.toUpperCase();
    document.getElementById("record-country").textContent = fastest.country.toUpperCase();
  });
}

function formatPaceFromHours(hours) {
  var totalSeconds = hours * 3600;
  var secondsPerMile = totalSeconds / 26.2;

  var minutes = Math.floor(secondsPerMile / 60);
  var seconds = Math.round(secondsPerMile % 60);

  var paddedSeconds = String(seconds).padStart(2, "0");
  return minutes + ":" + paddedSeconds + " / MILE";
}

function formatMargin(fastestHours, previousHours) {
  var diffSeconds = Math.round((fastestHours - previousHours) * 3600);
  var absSeconds = Math.abs(diffSeconds);
  var minutes = Math.floor(absSeconds / 60);
  var seconds = absSeconds % 60;
  var paddedSeconds = String(seconds).padStart(2, "0");
  var sign = "+";

  if (diffSeconds < 0) {
    sign = "-";
  }

  return sign + minutes + ":" + paddedSeconds;
}

initFastestRecord();