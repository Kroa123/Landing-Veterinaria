# Valle Vet · landing

Landing de clínica veterinaria con tienda: carrito con pedido por WhatsApp y formulario de reserva.
Vite + React 18.3 + Tailwind CSS v4 + lucide-react.

## Requisitos

Node 22.12 o superior (ver `engines` en `package.json`).

## Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm run lint     # ESLint
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisarlo
```

## Dónde editar el contenido

- `src/config/site.js`: nombre, teléfono, número de WhatsApp, dirección, horario, zona horaria,
  feriados, redes, menú y datos SEO (`seo`).
- `src/data/products.js`: productos y categorías de la tienda (precio en pesos, sin decimales).
- `src/data/services.js`: servicios con precio "desde".
- `src/data/team.js`, `src/data/testimonials.js`, `src/data/faq.js`: equipo, opiniones y preguntas.
- `src/styles.css`: tokens de diseño (colores, tipografía, radios, motion) en el bloque `@theme`.

La dirección de diseño está en `docs/DESIGN_DIRECTION.md`.

### Feriados

`site.holidays` lista los feriados nacionales de fecha fija de 2026 y 2027. Ese día el formulario no
deja reservar y la franja de horario muestra el local cerrado. Los feriados móviles (Viernes Santo,
Sábado Santo, San Pedro y San Pablo, Encuentro de Dos Mundos, Iglesias Evangélicas, Pueblos
Indígenas) hay que agregarlos a mano cada año.

## SEO

No hay datos de la clínica escritos a mano en `index.html`. El plugin `siteHead` de `vite.config.js`
genera al compilar el título, la descripción, Open Graph, Twitter, canonical y el JSON-LD
`VeterinaryCare` a partir de `src/config/site.js`. Cambia `site.url` por el dominio real antes de publicar.

Imágenes en `public/`: `favicon.svg`, `apple-touch-icon.png` (180x180) y `og.png` (1200x630).
Si cambias la marca, vuelve a generar estas dos últimas.

## Fuentes

Figtree (400, 500, 600) e IBM Plex Mono (400, 500) se sirven desde el propio sitio con
`@fontsource/figtree` y `@fontsource/ibm-plex-mono`, importadas en `src/main.jsx`. No hay llamadas a
Google Fonts, lo que permite una Content-Security-Policy sin terceros.

## Motion y 3D

- **Escena 3D del hero** (`src/components/three/HeroScene.jsx`): three.js + `@react-three/fiber` 8 + `@react-three/drei` 9, cargada con `React.lazy` en un chunk aparte. La iluminación usa `Lightformer` locales (sin HDR remoto). Sin WebGL o con `prefers-reduced-motion` se muestra la chapita SVG estática (`ChapitaFallback.jsx`). El render se pausa cuando el hero sale de pantalla.
- **GSAP** (`src/components/motion/gsap.js`): registra `ScrollTrigger`, `SplitText` y `useGSAP` una sola vez; importa siempre desde ahí.
- **Scroll suave**: `SmoothScroll.jsx` (Lenis sincronizado con el ticker de GSAP). Las anclas `#seccion` respetan `scroll-margin-top`. Se desactiva con `prefers-reduced-motion`.
- **`<Reveal>`** (`src/components/motion/Reveal.jsx`): fade + subida al entrar en pantalla. Props: `as`, `delay`, `y`, `duration`, `stagger`, `items`, `start`, `once`.
- **Vuelo al carrito** (`FlyToCart.jsx`): escucha `window.dispatchEvent(new CustomEvent('cart:add', { detail: { x, y } }))` y vuela hasta `[data-cart-target]` / `[data-cart-target-mobile]`.
- Fondo noche (aurora + grano, solo CSS): `NightBackdrop.jsx` y `motion.css`.

## Despliegue

`vercel.json` y `netlify.toml` tienen la misma configuración: build `npm run build`, salida `dist`,
caché larga para `/assets/*` y headers de seguridad (CSP estricta, HSTS, X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy).
Si agregas un servicio externo (analítica, mapa embebido, imágenes remotas), hay que sumarlo a la CSP
en los dos archivos.

### Vercel

1. Importa el repositorio en Vercel.
2. Vercel lee `vercel.json`; no hace falta configurar nada más.

### Netlify

1. Crea un sitio nuevo desde el repositorio.
2. Netlify lee `netlify.toml` (incluye Node 22).

También puedes subir la carpeta `dist/` a cualquier hosting estático, configurando ahí los mismos headers.
