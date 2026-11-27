# Jardín Secreto El Totoral — sitio web

Sitio de una página para **Jardín Secreto El Totoral**, cabañas con piscina en El Totoral, comuna de El Quisco ([@jardinsecretoeltotoral](https://www.instagram.com/jardinsecretoeltotoral/)).

Plan Web de [Tu Plan Digital](https://tuplandigital.cl). Diseño adaptado de la referencia *Moonstay — Cabin Stay Landing Page* (Dribbble), con los colores, el logo y las fotos reales del negocio.

- **Producción:** https://jardin-secreto-web.tuplandigital.workers.dev
- **Stack:** HTML, CSS y JavaScript sin framework ni build.
- **Hosting:** Cloudflare Workers con assets estáticos.

## Estructura

```
public/
├── index.html        # Página única
├── 404.html          # Página de error
├── css/styles.css    # Tokens, componentes, secciones y animaciones
├── js/
│   ├── main.js       # Punto de entrada
│   ├── nav.js        # Header al hacer scroll y menú móvil accesible
│   ├── carousel.js   # Carrusel de experiencias (scroll-snap)
│   ├── gallery.js    # Galería de interiores (crossfade)
│   └── reveal.js     # Aparición al hacer scroll
├── img/              # Fotos en WebP, logo SVG e imagen para redes
├── favicon.svg
├── robots.txt
└── sitemap.xml
tests/                # Pruebas con Vitest + jsdom
wrangler.jsonc        # Configuración del Worker
```

## Desarrollo

```bash
npm install
npm run dev      # servidor local con Wrangler
npm test         # pruebas
```

## Despliegue

Cada push a `main` se despliega solo con Cloudflare Workers Builds (`npx wrangler deploy`).

Flujo de ramas: `feature/*` → PR a `development` → PR a `main`.

## Estándares aplicados

- Animaciones con CSS primero; JS solo para estados (menú, galería, carrusel, aparición).
- Respeta `prefers-reduced-motion`.
- Header fijo; en móvil, menú hamburguesa con bloqueo de scroll, cierre con Escape, enlaces o al pasar a escritorio, y foco atrapado.
- HTML semántico, textos alternativos, contraste AA, objetivos táctiles de 44 px o más.
- SEO: metadatos, Open Graph, datos estructurados `LodgingBusiness`, sitemap y robots.

## Pendientes antes de entregar al cliente

- [ ] Reemplazar las reseñas por el **texto original y el nombre** de cada autor en Google Maps (hoy son una traducción del texto que entrega Google).
- [ ] Logo original en vector, si el cliente lo tiene (hoy es una recreación en SVG).
- [ ] Fotos en mayor resolución (hoy salen de Instagram).
- [ ] Enlace a Facebook, si tienen página.
- [ ] Dominio propio.
