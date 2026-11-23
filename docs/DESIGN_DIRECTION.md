# Valle Vet: dirección de diseño y técnica

Contrato común para todos los agentes. Lo define el orquestador. Si cambia algo, se cambia aquí primero.

## Dirección (unslop)

- **Producto.** Clínica veterinaria de barrio con tienda propia. Para dueños de perros y gatos que quieren agendar consulta y comprar alimento y antiparasitarios sin vueltas.
- **Carácter.** Cercano, preciso, tranquilo.
- **Mundo.** Consultorio con luz de día, fichas clínicas, chapitas identificadoras de collar, bolsas de alimento en estantería.
- **Momentos.** (1) Hero: una "ficha de paciente" construida en código: mascota, próxima vacuna, producto recomendado con precio y botón de agregar. (2) Tienda: tarjetas de producto con el empaque dibujado en código (bloques de color sólido por categoría, peso, marca genérica).
- **Firma.** La chapita identificadora (forma redonda con un agujero arriba). Se usa en el logo V y en la etiqueta de precio de los productos. En ningún otro sitio.

## Tokens

Neutros cálidos con un leve tinte verde, acento pino. Nada de crema + serif + terracota, nada de gradientes, glows ni blobs.

| Rol | Hex |
| --- | --- |
| Fondo de página | #F6F7F4 |
| Tarjeta | #FFFFFF |
| Elevado / input | #ECEFEA |
| Texto primario | #16201B |
| Texto secundario | #4A5550 |
| Texto muted (solo meta) | #5C665F (≥ 4.5:1 también sobre #ECEFEA y #E3ECE6) |
| Hairline | texto primario al 8 % |
| Acento (pino) | #1E5B43 (texto blanco encima, ≥ 7:1) |
| Acento hover | #174A36 |
| Acento suave (fondos de chip activos) | #E3ECE6 |
| Positivo | #16A34A · Negativo | #DC2626 |

Colores de empaque (solo dentro de las tarjetas de producto, son "material", no chrome): alimento #C9D8C5, antiparasitarios #D6DCE8, higiene #E8DED0, accesorios #DCD6E4.

- Excepción de material (decisión del orquestador): los empaques dibujados en `ProductPackage` y la chapita pueden llevar un degradado de luz dentro del mismo tono y sombras neutras suaves. Nunca de un tono a otro, nunca en chrome (botones, fondos, bordes, texto).
- Tipografía: **Figtree** (interfaz, 400/500/600) + **IBM Plex Mono** (precios, horarios, meta). Sin 700+, sin mayúsculas con tracking, sin cursiva.
- Hero headline 56–64 px desktop, 36–40 px móvil, tracking −0.03em. Subhead 18–20 px, máx 36rem.
- Espaciado: grilla de 4 px. Secciones de landing 80–128 px verticales.
- Radios: botones/inputs 10, tarjetas 16, paneles 20. Radios anidados = exterior − padding.
- Iconos: `lucide-react`, 18 px, stroke 1.5, color del rol de texto.
- Motion: una curva `cubic-bezier(0.22, 1, 0.36, 1)`; hover 150 ms, drawer 300 ms; una sola entrada en carga (hero). `prefers-reduced-motion` respetado. Nada de `transition-all`, `animate-pulse`, `hover:scale`.

## Contenido (genérico pero creíble)

- Marca: **Valle Vet** · "Clínica veterinaria y tienda". Logo: V en una chapita redonda, color sólido pino.
- Dirección: Av. Los Aromos 1240, local 3. Teléfono/WhatsApp de muestra: +56 9 1234 5678.
- Horario: lun–vie 9:00–20:00, sáb 10:00–14:00. Urgencias por teléfono 24 h.
- Moneda: `$` con separador de miles con punto, sin decimales (`$24.990`). Un solo formato en todo el sitio.
- Sin cifras inventadas tipo "10.000+ clientes felices". Testimonios con nombre de pila + mascota.

## Secciones (orden, el comercio va arriba)

1. Header: logo, Tienda, Servicios, Cómo agendar, Contacto; botón "Agendar consulta"; icono carrito con contador. Móvil: menú colapsado.
2. Hero split: titular + subhead + "Agendar consulta" (primario) + "Ver tienda" (secundario). Visual: ficha de paciente (momento 1).
3. Franja de datos útiles: horario de hoy, urgencias 24 h, despacho en el día en la comuna, retiro en tienda.
4. **Tienda**: filtros por categoría, 8 productos, agregar al carrito, drawer de carrito, pedido por WhatsApp con el detalle del carrito.
5. Servicios con precio "desde".
6. Cómo agendar: 3 pasos (secuencia real, numeración permitida).
7. Equipo: 3 veterinarios (avatar con iniciales, sin fotos falsas).
8. Opiniones: 3 testimonios.
9. Preguntas frecuentes (acordeón accesible).
10. Contacto: formulario de reserva que arma un mensaje de WhatsApp, mapa como bloque estático con dirección, horario.
11. Footer.
12. Móvil: barra fija inferior con "Agendar" y "Carrito".

## Técnica

- Vite + React 18.3 + Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `@theme` dentro de `src/styles.css`) + `lucide-react` + ESLint 9.
- Estructura:
  - `src/config/site.js` datos de la clínica (nombre, teléfono, WhatsApp, dirección, horario, redes).
  - `src/data/` productos, servicios, equipo, testimonios, FAQ.
  - `src/components/layout/` Header, Footer, MobileBar.
  - `src/components/sections/` una sección por archivo.
  - `src/components/ui/` Button, Container, Logo, PriceTag, SectionHeading, Icon wrappers.
  - `src/components/shop/` ProductCard, ProductPackage, CartDrawer, CategoryFilter.
  - `src/context/CartContext.jsx` estado del carrito (persistencia en localStorage con try/catch).
  - `src/lib/` `formatPrice`, `buildWhatsAppUrl` (siempre `encodeURIComponent`).
- Seguridad: sin secretos, sin `dangerouslySetInnerHTML`, links externos con `rel="noopener noreferrer"`, validación de formulario en cliente.
- Despliegue: `vercel.json` y `netlify.toml` con build `npm run build` y salida `dist`, headers de seguridad básicos.
- SEO: `<title>`, meta description, Open Graph, `lang="es"`, favicon SVG con la V, JSON-LD `VeterinaryCare`.

## v2 — Impacto: 3D, motion y fondos (decisión del cliente, 2026-11-21)

El cliente pidió una interfaz más impactante: 3D, animaciones modernas, fondos con vida y hover en todo. Esto **sustituye** las reglas de restricción de motion de arriba (una sola entrada, sin glows). Se mantiene: claridad del contenido, accesibilidad, contraste AA, `prefers-reduced-motion`, rendimiento.

### Concepto
- **Hero oscuro con chapita V en 3D**: la chapita del logo en metal pulido (verde pino anodizado + borde plateado), gira suave sola y se inclina siguiendo el mouse; reflejos de luz reales. Alrededor flotan 3–4 empaques 3D (bolsa de alimento, caja de antiparasitario) con leve órbita/parallax. Al hacer scroll la cámara se aleja y la chapita se desplaza hacia la tienda.
- **Fondo vivo**: aurora/luz verde suave animada (shader o canvas ligero, o capas CSS con blur animando transform/opacity) sobre noche verde; grano sutil. Solo en hero y tienda.
- **Ambiente mixto**: Hero + Tienda en oscuro ("noche"); Servicios, Cómo agendar, Equipo, Opiniones, FAQ, Contacto en claro (tokens originales). Transición suave de oscuro a claro.
- **Motion**: Lenis smooth scroll; GSAP + ScrollTrigger para revelar secciones (fade + rise + stagger), titulares que entran por líneas, contadores; hover en tarjetas con tilt 3D sutil (≤ 8°) + luz que sigue al cursor + elevación; botones con efecto magnético sutil y brillo al hover; carrito con micro-animación al agregar (producto "vuela" al icono o bump fuerte).

### Tokens noche (nombres exactos para todos los agentes)
| Token | Hex |
| --- | --- |
| `--color-night` | #0A1611 |
| `--color-night-raised` | #11231B |
| `--color-night-line` | rgba(234,242,236,0.10) |
| `--color-on-night` | #EEF5F0 |
| `--color-on-night-soft` | #A7BBAF |
| `--color-mint` (acento en oscuro, glows y foco) | #6EE7B7 |
| `--color-mint-deep` | #34D399 |

Botón primario en oscuro: fondo mint #6EE7B7 con texto #0A1611. Glows verdes permitidos solo en hero/tienda.

### Técnica
- `three`, `@react-three/fiber@8` (React 18), `@react-three/drei@9`, `gsap` + `@gsap/react`, `lenis`.
- Escena 3D con `React.lazy` + `Suspense` (chunk aparte), fallback = chapita SVG estática. Sin WebGL o con reduced-motion: fallback estático sin animación.
- Nada cargado desde CDN (sin `Environment preset`, usar `Lightformer` locales), para respetar la CSP `'self'`.
- Rendimiento: `dpr={[1, 2]}`, pausar el render cuando el hero sale de pantalla, geometrías simples, sin sombras pesadas. Animar solo transform/opacity en DOM.

## v3 — Toda la página en noche (decisión del cliente, 2026-11-22)

- La mitad inferior se veía "seca". Ahora toda la página usa `.theme-night`, con profundidad variada por sección (bandas night / night-raised, auroras suaves, patrones finos, grano). Sin hojas claras.
- Se permite prueba social **de muestra**, marcada en los archivos de datos con `// muestra: reemplazar con datos reales` (rating de Google, años, pacientes).
- Cada sección es un "momento": banda de stats con contadores, servicios interactivos, timeline fijada con chat de WhatsApp simulado, tarjetas del equipo, marquee de opiniones, FAQ a dos columnas con CTA, contacto final con mapa estilizado, footer con wordmark gigante.
