import { useEffect, useRef } from 'react'
import { pointerMotionOk } from '../../lib/motionOk.js'

// Tarjeta con luz que sigue al cursor (spotlight) y tilt 3D leve.
// Escribe --rx, --ry, --lx, --ly una vez por frame; estilos en styles.css (.spot-card).
// Solo con mouse, hover y sin prefers-reduced-motion. En táctil es una tarjeta estática.
// tint: color de la luz: 'leaf' (por defecto) | 'sky' | 'sun' | 'coral'. En .service-card también
// tiñe el fondo de la ilustración (styles.css).
const TINTS = { leaf: '', sky: 'spot-card--sky', sun: 'spot-card--sun', coral: 'spot-card--coral' }

export default function SpotCard({ as: Tag = 'article', tilt = 5, tint = 'leaf', className = '', children, ...rest }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const point = useRef(null)
  const rect = useRef(null)
  const scrollAtMeasure = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function paint() {
    frame.current = 0
    const el = ref.current
    const p = point.current
    const r = rect.current
    if (!el || !p || !r) return
    const x = Math.min(1, Math.max(0, (p.x - r.left) / r.width))
    const y = Math.min(1, Math.max(0, (p.y - r.top) / r.height))
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * tilt).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - y) * 2 * tilt).toFixed(2)}deg`)
    el.style.setProperty('--lx', `${(x * r.width).toFixed(1)}px`)
    el.style.setProperty('--ly', `${(y * r.height).toFixed(1)}px`)
  }

  function onPointerEnter(e) {
    if (e.pointerType !== 'mouse' || !pointerMotionOk() || !ref.current) return
    // Medimos sin inclinación para que el cálculo no se retroalimente
    rect.current = ref.current.getBoundingClientRect()
    scrollAtMeasure.current = window.scrollY
    ref.current.classList.add('is-tilting')
  }

  function onPointerMove(e) {
    if (e.pointerType !== 'mouse' || !rect.current) return
    // Si la página se desplazó con el cursor encima (rueda, Lenis), la medida quedó vieja.
    // Se vuelve a medir sin la inclinación actual para no retroalimentar el cálculo.
    if (window.scrollY !== scrollAtMeasure.current && ref.current) {
      const el = ref.current
      el.style.removeProperty('--rx')
      el.style.removeProperty('--ry')
      rect.current = el.getBoundingClientRect()
      scrollAtMeasure.current = window.scrollY
    }
    point.current = { x: e.clientX, y: e.clientY }
    if (!frame.current) frame.current = requestAnimationFrame(paint)
  }

  function onPointerLeave() {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    point.current = null
    rect.current = null
    const el = ref.current
    if (!el) return
    el.classList.remove('is-tilting')
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
  }

  return (
    <Tag
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`spot-card ${TINTS[tint] ?? ''} ${className}`}
      {...rest}
    >
      <span className="spot-light" aria-hidden="true" />
      {children}
    </Tag>
  )
}
