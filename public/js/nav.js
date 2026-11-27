/**
 * Navegación: header que cambia al hacer scroll y menú móvil accesible.
 *
 * Garantías del menú móvil:
 * - Un solo estado (`isOpen`) controla clases, aria y bloqueo de scroll.
 * - Abrir/cerrar rápido varias veces no deja el panel a medio animar:
 *   cada cierre lleva un token y solo el último puede ocultar el panel.
 * - Se cierra con: botón, Escape, clic en un enlace y al pasar a escritorio.
 * - El foco queda atrapado dentro del menú mientras está abierto y vuelve
 *   al botón al cerrarlo con teclado.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLOSE_FALLBACK_MS = 450;

export function initMobileMenu({
  header,
  toggle,
  menu,
  doc = document,
  win = window,
  desktopQuery = '(min-width: 961px)',
}) {
  if (!header || !toggle || !menu) return null;

  const root = doc.documentElement;
  let isOpen = false;
  let closeToken = 0;

  const focusables = () => [toggle, ...menu.querySelectorAll(FOCUSABLE)];

  function open() {
    if (isOpen) return;
    isOpen = true;
    closeToken += 1; // invalida cualquier cierre pendiente

    menu.hidden = false;
    // Fuerza un reflow para que la transición de entrada siempre se ejecute.
    void menu.offsetHeight;
    menu.classList.add('is-open');

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    header.classList.add('is-menu-open');
    root.classList.add('is-locked');

    const first = menu.querySelector(FOCUSABLE);
    if (first) first.focus({ preventScroll: true });
  }

  function close({ returnFocus = false } = {}) {
    if (!isOpen) return;
    isOpen = false;
    const token = ++closeToken;

    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    header.classList.remove('is-menu-open');
    root.classList.remove('is-locked');

    const hide = () => {
      menu.removeEventListener('transitionend', onEnd);
      if (token !== closeToken || isOpen) return;
      menu.hidden = true;
    };
    // Solo cuenta el fin de la transición del panel, no la de sus enlaces.
    const onEnd = (event) => {
      if (event.target === menu) hide();
    };
    menu.addEventListener('transitionend', onEnd);
    win.setTimeout(hide, CLOSE_FALLBACK_MS);

    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => (isOpen ? close({ returnFocus: true }) : open()));

  // Cerrar al elegir un enlace (el ancla hace su scroll normal después).
  menu.addEventListener('click', (event) => {
    if (event.target.closest('[data-menu-link]')) close();
  });

  doc.addEventListener('keydown', (event) => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close({ returnFocus: true });
      return;
    }
    if (event.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Al pasar a escritorio, el menú se cierra sin animación.
  const mq = win.matchMedia ? win.matchMedia(desktopQuery) : null;
  const onBreakpoint = (e) => {
    if (e.matches) {
      close();
      menu.hidden = true;
    }
  };
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
  }

  // Sin transiciones mientras se redimensiona la ventana (evita parpadeos).
  let resizeTimer;
  win.addEventListener('resize', () => {
    root.classList.add('no-transitions');
    win.clearTimeout(resizeTimer);
    resizeTimer = win.setTimeout(() => root.classList.remove('no-transitions'), 200);
  });

  return { open, close, isOpen: () => isOpen };
}

export function initHeaderScroll({ header, win = window, threshold = 24 }) {
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', win.scrollY > threshold);
    ticking = false;
  };
  win.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        win.requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/** Marca en el menú de escritorio la sección visible. */
export function initActiveSection({ links, doc = document, win = window }) {
  if (!links.length || !('IntersectionObserver' in win)) return;
  const map = new Map();
  links.forEach((link) => {
    const section = doc.querySelector(link.getAttribute('href'));
    if (section) map.set(section, link);
  });
  const observer = new win.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.removeAttribute('aria-current'));
        map.get(entry.target)?.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  map.forEach((_, section) => observer.observe(section));
}
