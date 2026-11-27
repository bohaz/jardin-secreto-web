import { initMobileMenu, initHeaderScroll, initActiveSection } from './nav.js';
import { initCarousel } from './carousel.js';
import { initGallery } from './gallery.js';
import { initReveal } from './reveal.js';

const header = document.querySelector('[data-header]');

initHeaderScroll({ header });
initMobileMenu({
  header,
  toggle: document.querySelector('[data-menu-toggle]'),
  menu: document.querySelector('[data-menu]'),
});
initActiveSection({ links: [...document.querySelectorAll('.nav-desktop a')] });
initCarousel(document.querySelector('[data-carousel]'));
initGallery(document.querySelector('[data-gallery]'));
initReveal();

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
