 const funFactsSection = document.querySelector(".fun-facts");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        funFactsSection.classList.add("in-view");
      }
    });
  }, {
    threshold: 0.35
  });

  if (funFactsSection) {
    observer.observe(funFactsSection);
  }