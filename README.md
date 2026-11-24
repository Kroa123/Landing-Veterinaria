# Valle Vet · sitio web

Sitio de clínica veterinaria con tienda: catálogo con carrito y pedido por WhatsApp, detalle de
producto con visor 3D y formulario de reserva.
Vite + React 18.3 + React Router 6 + Tailwind CSS v4 + lucide-react.

## Páginas

| Ruta | Página (`src/pages/`) |
| --- | --- |
| `/` | `Home.jsx`: hero 3D, datos útiles, destacados, servicios, cifras, opiniones, CTA |
| `/tienda` | `Shop.jsx`: catálogo con filtros en la URL (`?cat=&q=&orden=`) |
| `/tienda/:slug` | `ProductDetail.jsx`: visor 3D del empaque, ficha y relacionados |
| `/servicios` | `Services.jsx`: servicios con detalle, urgencias y cómo agendar |
| `/agendar` | `Book.jsx`: formulario de reserva; acepta `?servicio=<id>` y `?vet=<id>` |
| `/nosotros` | `About.jsx`: historia, equipo, cifras, opiniones y FAQ (`/nosotros#faq`) |
| `/contacto` | `Contact.jsx`: mapa, horario, canales, urgencias y FAQ corta |
| `*` | `NotFound.jsx` |

Las rutas están en `src/router.jsx` (`createBrowserRouter`) y cada página se carga aparte
(`src/pages/lazy.js`). El layout común (header, footer, carrito, barra móvil) es
`src/components/layout/RootLayout.jsx`. Al cambiar de ruta la página sube al inicio (o restaura la
posición con Atrás), un `#hash` lleva al ancla y el foco pasa al `h1` de la página nueva.
Cada página fija su título y descripción con `usePageMeta` (`src/hooks/usePageMeta.js`).

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
- `src/data/products.js`: productos y categorías de la tienda (precio en pesos, sin decimales),
  con `slug` (URL del detalle), descripción, modo de uso, para quién, presentación y `featured`.
  No cambies el `id` de un producto: es lo que guarda el carrito.
- `src/data/services.js`: servicios con precio "desde", detalle y qué incluye.
- `src/data/team.js`, `src/data/testimonials.js`, `src/data/faq.js`: equipo, opiniones y preguntas.
- `src/data/about.js`: historia y compromisos de la página Nosotros.
- `src/data/navigation.js`: menú principal y mapa del sitio del footer.
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

- **3D** (`src/components/three/`): three.js + `@react-three/fiber` 8 + `@react-three/drei` 9 en un único chunk (`scenes.js`), cargado con `React.lazy` y compartido por las tres escenas: hero (`HeroScene.jsx`), visor de empaque del detalle de producto (`ProductViewerScene.jsx`, vía `ProductViewer3D.jsx`) y chapita chica de 404 y Agendar (`ChapitaMiniScene.jsx`, vía `ChapitaMini3D.jsx`). Piezas comunes en `parts.jsx` y etiquetas en `labels.js` (CanvasTexture con las fuentes del sitio). La iluminación usa `Lightformer` locales (sin HDR remoto). Sin WebGL acelerado, con `prefers-reduced-motion`, en móvil modesto o si se pierde el contexto WebGL se muestra el SVG estático (`ChapitaFallback.jsx` o `ProductPackage.jsx`). El render se pausa fuera de pantalla.
- **GSAP** (`src/components/motion/gsap.js`): registra `ScrollTrigger`, `SplitText` y `useGSAP` una sola vez; importa siempre desde ahí.
- **Scroll suave**: `SmoothScroll.jsx` (Lenis sincronizado con el ticker de GSAP). La instancia queda en `src/lib/scroll.js` para el scroll de cambio de ruta y las anclas (respetan `scroll-padding-top`). Se desactiva con `prefers-reduced-motion`.
- **`<Reveal>`** (`src/components/motion/Reveal.jsx`): fade + subida al entrar en pantalla. Props: `as`, `delay`, `y`, `duration`, `stagger`, `items`, `start`, `once`.
- **Vuelo al carrito** (`FlyToCart.jsx`): escucha `window.dispatchEvent(new CustomEvent('cart:add', { detail: { x, y } }))` y vuela hasta `[data-cart-target]` / `[data-cart-target-mobile]`.
- Fondo noche (aurora + grano, solo CSS): `NightBackdrop.jsx` y `motion.css`.

## Despliegue

`vercel.json` y `netlify.toml` tienen la misma configuración: build `npm run build`, salida `dist`,
fallback de SPA (toda ruta sirve `index.html`, así `/tienda` o `/nosotros` funcionan al recargar),
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

También puedes subir la carpeta `dist/` a cualquier hosting estático, configurando ahí los mismos
headers y la reescritura de todas las rutas a `/index.html`.
