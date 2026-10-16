document.querySelectorAll('.visual-slider').forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slider-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  if (!track || !slides.length || !dots.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = Array.from(slides).indexOf(entry.target);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    });
  }, { root: track, threshold: 0.6 });

  slides.forEach((slide) => observer.observe(slide));
});
