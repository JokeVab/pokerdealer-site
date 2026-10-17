const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('video[data-autoplay]').forEach((video) => {
  if (reduceMotion) return;
  video.setAttribute('autoplay', '');
  video.play().catch(() => {});
});
