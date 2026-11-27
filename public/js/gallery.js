/**
 * Galería de interiores: crossfade entre fotos (la transición es CSS),
 * miniaturas, flechas, teclado y swipe en móvil.
 */
export function initGallery(root) {
  if (!root) return null;
  const slides = [...root.querySelectorAll('[data-gallery-slide]')];
  const thumbs = [...root.querySelectorAll('[data-gallery-thumb]')];
  const prev = root.querySelector('[data-gallery-prev]');
  const next = root.querySelector('[data-gallery-next]');
  if (!slides.length) return null;

  let current = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));

  function show(index) {
    const total = slides.length;
    current = ((index % total) + total) % total; // índice circular
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    thumbs.forEach((thumb, i) => {
      const active = i === current;
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-pressed', String(active));
    });
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));
  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
  });

  // Swipe horizontal simple (sin bloquear el scroll vertical).
  let startX = null;
  let startY = null;
  root.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  show(current);
  return { show, current: () => current };
}
