# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [1.1.1] - 2026-11-27

### Cambiado
- Hero con la foto real de la cabaña para 8 personas en lugar de la foto de relleno.

## [1.1.0] - 2026-11-27

### Cambiado
- Hero a pantalla completa, sin bordes, como en el diseño de referencia.
- Galería de interiores a todo el ancho, sin bordes.
- Hero y galería con fotos de relleno de Pexels en alta resolución (`srcset`).
- Logo redibujado fiel al del flyer (techo, ventana, hojas, pincelada «El Totoral» y «CABAÑAS»), en versión clara y oscura.
- Footer con el logo en lugar del nombre; se quitó el nombre gigante.
- Header, favicon y página 404 con el nuevo logo; tipografía Parisienne en lugar de Dancing Script.

## [1.0.0] - 2026-11-27

### Agregado
- Página única: hero, presentación, cabañas, experiencias (carrusel), interiores (galería), reseñas de Google, ubicación con mapa y reservas, y footer.
- Logo recreado en SVG y favicon.
- Header fijo que cambia al hacer scroll y menú hamburguesa accesible en móvil.
- Animaciones suaves: entrada del hero, aparición al hacer scroll, crossfade de la galería.
- SEO: metadatos, Open Graph, `LodgingBusiness` en JSON-LD, sitemap y robots.
- Página 404.
- Pruebas de menú y galería con Vitest.
- Despliegue en Cloudflare Workers.
