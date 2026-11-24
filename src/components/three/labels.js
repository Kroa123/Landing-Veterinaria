import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Colores de empaque y etiquetas en CanvasTexture para las escenas 3D (chunk 3D).
// Las etiquetas usan las fuentes del propio sitio (Figtree, IBM Plex Mono): sin fuentes externas.

// Colores de empaque del contrato (material) y su tinta de etiqueta. Son los mismos del
// empaque SVG (shop/ProductPackage.jsx) y los usa el hero, que tiene fondo propio.
export const PACK = {
  alimento: { body: '#C9D8C5', ink: '#5E7A5A' },
  antiparasitarios: { body: '#D6DCE8', ink: '#5B6A8A' },
  higiene: { body: '#E8DED0', ink: '#8A7458' },
  accesorios: { body: '#DCD6E4', ink: '#6E6386' },
}

// Visor de producto: mismo tono por categoría pero saturado y de luminosidad media, para
// que el empaque se separe de la vitrina de la ficha (leaf/sky/sun/coral-soft, del mismo
// tono pero muy clara). Los pasteles de PACK se perdían sobre ese fondo.
export const PACK_VIEWER = {
  alimento: { body: '#3E8A4A', ink: '#1F4A26' },
  antiparasitarios: { body: '#3F63B0', ink: '#1F3366' },
  higiene: { body: '#C77A2E', ink: '#6B3F12' },
  accesorios: { body: '#8A5FC0', ink: '#432A6E' },
}

const INK = '#13241C'
const INK_SOFT = '#44544B'

/* ---------- Etiquetas dibujadas en canvas (usa las fuentes del propio sitio) ---------- */

const FONT = 'Figtree, ui-sans-serif, system-ui, sans-serif'
const MONO = '"IBM Plex Mono", ui-monospace, monospace'

// "15 kg" → ["15", "kg"], "3 comprimidos" → ["3", "comprimidos"]
export function splitSize(size = '') {
  const i = size.indexOf(' ')
  return i === -1 ? [size, ''] : [size.slice(0, i), size.slice(i + 1)]
}

// Rectángulo redondeado como path actual. ctx.roundRect no existe en navegadores viejos
// (Safari < 16, Firefox < 112): ahí se arma con arcTo.
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  const rr = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

// Parte un texto en líneas que caben en maxWidth (máximo maxLines; la última con "…")
function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s+\S*$/, '')}…`
    return kept
  }
  return lines
}

// Etiqueta corta (hero): marca, franja de categoría, cantidad grande y unidad
function drawShortLabel(canvas, { brand, qty, unit, ink }) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FFFFFF'
  roundRectPath(ctx, 0, 0, w, h, 28)
  ctx.fill()
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `600 40px ${FONT}`
  ctx.fillText(brand, w / 2, h * 0.24)
  ctx.fillStyle = ink
  roundRectPath(ctx, w * 0.14, h * 0.31, w * 0.72, 12, 6)
  ctx.fill()
  ctx.fillStyle = INK
  ctx.font = `600 120px ${FONT}`
  ctx.fillText(qty, w / 2, h * 0.7)
  ctx.fillStyle = INK_SOFT
  ctx.font = `400 38px ${MONO}`
  ctx.fillText(unit, w / 2, h * 0.87)
}

// Etiqueta de producto (visor): marca, franja, nombre en hasta 3 líneas y presentación.
// Medidas relativas al ancho del canvas (se dibuja a alta resolución) y texto grande con
// tinta casi negra sobre blanco: se lee aunque el empaque gire. Borde del color de la
// categoría para separar la etiqueta del cuerpo.
function drawProductLabel(canvas, { brand, name, size, ink }) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  const pad = w * 0.08
  const border = Math.max(4, w * 0.012)
  const radius = w * 0.07
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = ink
  roundRectPath(ctx, 0, 0, w, h, radius)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  roundRectPath(ctx, border, border, w - border * 2, h - border * 2, radius - border)
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = INK
  ctx.font = `600 ${Math.round(w * 0.13)}px ${FONT}`
  ctx.fillText(brand, w / 2, h * 0.14, w - pad * 2)
  ctx.fillStyle = ink
  roundRectPath(ctx, pad, h * 0.175, w - pad * 2, w * 0.03, w * 0.015)
  ctx.fill()

  ctx.fillStyle = INK
  ctx.font = `600 ${Math.round(w * 0.105)}px ${FONT}`
  const lines = wrapLines(ctx, name, w - pad * 2, 3)
  const lineH = w * 0.128
  const startY = h * 0.3
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH, w - pad * 2))

  const [qty, unit] = splitSize(size)
  ctx.font = `600 ${Math.round(w * 0.3)}px ${FONT}`
  ctx.fillText(qty, w / 2, h * 0.81, w - pad * 2)
  // Unidad ("kg", "m", "ml") grande y con la tinta principal: en el colgador quedaba tenue
  ctx.fillStyle = INK
  ctx.font = `500 ${Math.round(w * 0.12)}px ${MONO}`
  ctx.fillText(unit, w / 2, h * 0.935, w - pad * 2)
}

const DRAW = { short: drawShortLabel, product: drawProductLabel }

// Textura de etiqueta. label debe ser estable (constante o useMemo).
// variant: 'short' (hero) | 'product' (visor)
export function useLabelTexture(label, variant = 'short', size = 320) {
  const draw = DRAW[variant] || drawShortLabel
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = variant === 'product' ? Math.round(size * 1.25) : size
    draw(canvas, label)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = variant === 'product' ? 8 : 4
    return tex
  }, [label, variant, size, draw])

  // Redibuja cuando Figtree / Plex Mono terminan de cargar
  useEffect(() => {
    let alive = true
    const fonts = document.fonts
    if (fonts?.load) {
      Promise.all([
        fonts.load(`600 40px Figtree`),
        fonts.load(`500 38px Figtree`),
        fonts.load(`400 38px "IBM Plex Mono"`),
        fonts.load(`500 38px "IBM Plex Mono"`),
      ])
        .then(() => {
          if (!alive) return
          draw(texture.image, label)
          texture.needsUpdate = true
        })
        .catch(() => {})
    }
    return () => {
      alive = false
      texture.dispose()
    }
  }, [texture, label, draw])

  return texture
}
