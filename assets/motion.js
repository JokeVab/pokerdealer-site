const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const retryEvents = ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'scroll', 'click'];

document.querySelectorAll('video[data-autoplay]').forEach((video) => {
  const trigger = video.closest('.visual-frame')?.querySelector('[data-video-trigger]');
  const showTrigger = () => trigger && (trigger.hidden = false);
  const hideTrigger = () => trigger && (trigger.hidden = true);
  const stopRetrying = () => retryEvents.forEach((type) => window.removeEventListener(type, retry));
  const retry = () => video.play().then(() => { hideTrigger(); stopRetrying(); }).catch(showTrigger);

  video.addEventListener('playing', hideTrigger);
  trigger?.addEventListener('click', retry);

  if (reduceMotion) {
    showTrigger();
    return;
  }

  video.setAttribute('autoplay', '');
  retry();
  retryEvents.forEach((type) => window.addEventListener(type, retry, { passive: true }));
});
