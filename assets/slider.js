const reduceSliderMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.visual-slider').forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slider-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  if (!track || !slides.length || !dots.length) return;

  const goTo = (index) => track.scrollTo({
    left: index * track.clientWidth,
    behavior: reduceSliderMotion ? 'auto' : 'smooth',
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = Array.from(slides).indexOf(entry.target);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.toggleAttribute('aria-current', i === index);
      });
    });
  }, { root: track, threshold: 0.6 });

  slides.forEach((slide) => observer.observe(slide));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Мышь: тянем трек вручную (палец и тачпад листают нативным scroll-snap).
  // На время перетаскивания snap выключен, иначе браузер возвращает трек на место.
  let drag = null;
  let settleTimer;
  track.addEventListener('dragstart', (event) => event.preventDefault());

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    clearTimeout(settleTimer);
    drag = { x: event.clientX, left: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
    track.classList.add('is-dragging');
  });

  track.addEventListener('pointermove', (event) => {
    if (!drag) return;
    track.scrollLeft = drag.left - (event.clientX - drag.x);
  });

  const endDrag = () => {
    if (!drag) return;
    const shift = track.scrollLeft - drag.left;
    const from = Math.round(drag.left / track.clientWidth);
    const step = Math.abs(shift) > track.clientWidth * 0.15 ? Math.sign(shift) : 0;
    drag = null;
    goTo(Math.min(Math.max(from + step, 0), slides.length - 1));
    settleTimer = setTimeout(() => track.classList.remove('is-dragging'), 600);
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
});
