/**
 * Carrusel con scroll-snap nativo: los botones solo desplazan la pista,
 * el arrastre y el swipe los resuelve el navegador.
 */
export function initCarousel(root, { win = window } = {}) {
  if (!root) return null;
  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return null;

  const step = () => {
    const item = track.firstElementChild;
    if (!item) return track.clientWidth;
    const gap = parseFloat(win.getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      track.scrollBy({ left: step(), behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    }
  });

  let ticking = false;
  track.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(() => {
        updateButtons();
        ticking = false;
      });
    },
    { passive: true },
  );
  win.addEventListener('resize', updateButtons);
  updateButtons();

  return { updateButtons };
}
