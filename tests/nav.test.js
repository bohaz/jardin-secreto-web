import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initMobileMenu, initHeaderScroll } from '../public/js/nav.js';

function setup() {
  document.documentElement.className = '';
  document.body.innerHTML = `
    <header data-header><button data-menu-toggle aria-expanded="false" aria-label="Abrir menú"></button></header>
    <div data-menu hidden>
      <nav><a href="#a" data-menu-link>A</a><a href="#b" data-menu-link>B</a></nav>
      <a href="https://wa.me/1" data-menu-link>WhatsApp</a>
    </div>`;
  const listeners = {};
  const mq = { matches: false, addEventListener: (_, fn) => (listeners.change = fn) };
  window.matchMedia = vi.fn(() => mq);
  const api = initMobileMenu({
    header: document.querySelector('[data-header]'),
    toggle: document.querySelector('[data-menu-toggle]'),
    menu: document.querySelector('[data-menu]'),
  });
  return { api, listeners, toggle: document.querySelector('[data-menu-toggle]'), menu: document.querySelector('[data-menu]') };
}

describe('menú móvil', () => {
  beforeEach(() => vi.useFakeTimers());

  it('abre con el botón y deja aria, clases y bloqueo de scroll consistentes', () => {
    const { toggle, menu } = setup();
    toggle.click();
    expect(menu.hidden).toBe(false);
    expect(menu.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(document.documentElement.classList.contains('is-locked')).toBe(true);
    expect(document.activeElement).toBe(menu.querySelector('a'));
  });

  it('cierra con el botón, devuelve el foco y oculta el panel al terminar', () => {
    const { toggle, menu } = setup();
    toggle.click();
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.documentElement.classList.contains('is-locked')).toBe(false);
    expect(document.activeElement).toBe(toggle);
    vi.advanceTimersByTime(500);
    expect(menu.hidden).toBe(true);
  });

  it('cierra con Escape', () => {
    const { toggle, api } = setup();
    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(api.isOpen()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('cierra al tocar un enlace', () => {
    const { toggle, menu, api } = setup();
    toggle.click();
    menu.querySelector('a').click();
    expect(api.isOpen()).toBe(false);
    expect(document.documentElement.classList.contains('is-locked')).toBe(false);
  });

  it('abrir y cerrar rápido no deja el panel oculto mientras está abierto', () => {
    const { toggle, menu, api } = setup();
    toggle.click(); // abre
    toggle.click(); // cierra (programa ocultar)
    toggle.click(); // vuelve a abrir antes de que termine
    vi.advanceTimersByTime(1000);
    expect(api.isOpen()).toBe(true);
    expect(menu.hidden).toBe(false);
    expect(menu.classList.contains('is-open')).toBe(true);
  });

  it('solo la transición del panel (no la de los enlaces) lo oculta', () => {
    const { toggle, menu } = setup();
    toggle.click();
    toggle.click();
    menu.querySelector('a').dispatchEvent(new Event('transitionend', { bubbles: true }));
    expect(menu.hidden).toBe(false);
    menu.dispatchEvent(new Event('transitionend'));
    expect(menu.hidden).toBe(true);
  });

  it('se cierra al pasar a escritorio', () => {
    const { toggle, menu, listeners, api } = setup();
    toggle.click();
    listeners.change({ matches: true });
    expect(api.isOpen()).toBe(false);
    expect(menu.hidden).toBe(true);
  });

  it('atrapa el foco: Tab desde el último elemento vuelve al botón', () => {
    const { toggle, menu } = setup();
    toggle.click();
    const links = menu.querySelectorAll('a');
    links[links.length - 1].focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    document.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });
});

describe('header al hacer scroll', () => {
  it('agrega is-scrolled pasado el umbral', () => {
    document.body.innerHTML = '<header data-header></header>';
    const header = document.querySelector('header');
    window.requestAnimationFrame = (fn) => fn();
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    initHeaderScroll({ header });
    expect(header.classList.contains('is-scrolled')).toBe(true);
  });
});
