/**
 * Aparición suave al hacer scroll. Si el navegador no soporta
 * IntersectionObserver o el usuario prefiere menos movimiento,
 * todo se muestra de inmediato.
 */
export function initReveal({ doc = document, win = window, selector = '.reveal' } = {}) {
  const items = [...doc.querySelectorAll(selector)];
  const reduce = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in win) || reduce) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Escalonado suave entre hermanos (tarjetas en grilla).
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.matches(selector));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 4) * 90}ms`;
  });

  const observer = new win.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => observer.observe(el));
}
