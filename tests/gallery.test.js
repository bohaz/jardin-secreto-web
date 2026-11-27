import { describe, it, expect, beforeEach } from 'vitest';
import { initGallery } from '../public/js/gallery.js';

describe('galería de interiores', () => {
  let api;
  beforeEach(() => {
    document.body.innerHTML = `
      <section data-gallery>
        <img data-gallery-slide class="is-active"><img data-gallery-slide><img data-gallery-slide>
        <button data-gallery-thumb></button><button data-gallery-thumb></button><button data-gallery-thumb></button>
        <button data-gallery-prev></button><button data-gallery-next></button>
      </section>`;
    api = initGallery(document.querySelector('[data-gallery]'));
  });

  const active = () => [...document.querySelectorAll('[data-gallery-slide]')].findIndex((s) => s.classList.contains('is-active'));

  it('avanza y vuelve al inicio de forma circular', () => {
    const next = document.querySelector('[data-gallery-next]');
    next.click();
    next.click();
    next.click();
    expect(active()).toBe(0);
  });

  it('retrocede desde la primera a la última', () => {
    document.querySelector('[data-gallery-prev]').click();
    expect(active()).toBe(2);
  });

  it('sincroniza miniaturas y aria-pressed', () => {
    const thumbs = document.querySelectorAll('[data-gallery-thumb]');
    thumbs[1].click();
    expect(active()).toBe(1);
    expect(thumbs[1].getAttribute('aria-pressed')).toBe('true');
    expect(thumbs[0].getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelectorAll('.is-active[data-gallery-slide]').length).toBe(1);
  });

  it('expone el índice actual', () => {
    api.show(2);
    expect(api.current()).toBe(2);
  });
});
