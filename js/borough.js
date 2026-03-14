
  const boroughItems = document.querySelectorAll(".borough-item");
  const boroughTooltip = document.querySelector("#borough-tooltip");

  boroughItems.forEach(item => {
    item.addEventListener("mouseenter", function (event) {
      const title = this.dataset.title;
      const miles = this.dataset.miles;
      const description = this.dataset.description;

      boroughTooltip.innerHTML = `
        <div class="tooltip-year">${title}</div>
        <div class="tooltip-name">${miles}</div>
        <div class="tooltip-meta">${description}</div>
      `;

      boroughTooltip.style.opacity = 1;
    });

    item.addEventListener("mousemove", function (event) {
      boroughTooltip.style.left = `${event.pageX}px`;
      boroughTooltip.style.top = `${event.pageY}px`;
    });

    item.addEventListener("mouseleave", function () {
      boroughTooltip.style.opacity = 0;
    });
  });

