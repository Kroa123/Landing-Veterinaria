import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from './gsap.js'
import { useCart } from '../../context/cart.js'
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js'

// Al agregar un producto, un punto "vuela" desde el botón pulsado hasta el icono del carrito.
//
// Disparo automático: si el contador del carrito sube justo después de un clic
// (dentro de 800 ms y con el carrito cerrado), el vuelo sale desde ese clic.
// No hace falta tocar las tarjetas: funciona con cualquier botón que llame a add().
//
// Disparo manual (origen propio, p. ej. desde una escena):
//   window.dispatchEvent(new CustomEvent('cart:add', { detail: { x, y } }))
//   x, y en px de viewport (clientX/clientY). Un evento manual reemplaza al automático de ese clic.
//
// Destino: el primer elemento visible con [data-cart-target] (header) o
// [data-cart-target-mobile] (barra móvil). Si aún no existen, usa el botón del carrito del header.
// Con prefers-reduced-motion no se anima nada.

export const CART_ADD_EVENT = 'cart:add'
const CLICK_WINDOW = 800

function isVisible(el) {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight
}

function findTarget() {
  const candidates = [
    ...document.querySelectorAll('[data-cart-target]'),
    ...document.querySelectorAll('[data-cart-target-mobile]'),
    ...document.querySelectorAll('header button[aria-haspopup="dialog"]'),
  ]
  return candidates.find(isVisible) || null
}

// Centro del control pulsado; con teclado el clic llega con clientX/Y = 0
function originFromClick(e) {
  if (e.detail > 0 && (e.clientX || e.clientY)) return { x: e.clientX, y: e.clientY }
  const el = e.target.closest?.('button, a') || e.target
  if (!el?.getBoundingClientRect) return null
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

// Anima un punto desde origin ({ x, y } de viewport) hasta el icono del carrito, dentro de layer
function fly(layer, origin) {
  if (!layer || !origin || prefersReducedMotion()) return
  const target = findTarget()
  if (!target) return
  const r = target.getBoundingClientRect()
  // El rebote va en el icono interno: el botón puede tener sus propias transiciones de transform
  const bumpEl = target.querySelector('svg') || target
  const tx = r.left + r.width / 2
  const ty = r.top + r.height / 2

  const dot = document.createElement('span')
  dot.className = 'fly-dot'
  layer.appendChild(dot)

  gsap.set(dot, { x: origin.x, y: origin.y, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 })
  const tl = gsap.timeline({ onComplete: () => dot.remove() })
  tl.to(dot, { opacity: 1, scale: 1, duration: 0.12, ease: 'power1.out' })
    // x e y con curvas distintas: el punto describe un arco
    .to(dot, { x: tx, duration: 0.7, ease: 'power1.inOut' }, 0.05)
    .to(dot, { y: ty, duration: 0.7, ease: 'back.in(1.6)' }, 0.05)
    .to(dot, { scale: 0.45, duration: 0.7, ease: 'power2.in' }, 0.05)
    .to(dot, { opacity: 0, duration: 0.12 }, '>-0.08')
    // Rebote del icono al recibirlo (solo transform; se limpia al terminar)
    .fromTo(
      bumpEl,
      { scale: 1 },
      { scale: 1.16, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto', clearProps: 'transform' },
      '>-0.1',
    )
}

export default function FlyToCart() {
  const { count, isOpen } = useCart()
  const layerRef = useRef(null)
  const lastClick = useRef(null)
  const manualAt = useRef(0)
  const prevCount = useRef(count)

  // Recuerda el último clic (fase de captura: llega antes que el onClick de React)
  useEffect(() => {
    function onClick(e) {
      const origin = originFromClick(e)
      if (origin) lastClick.current = { ...origin, at: performance.now() }
    }
    function onManual(e) {
      const { x, y } = e.detail || {}
      if (!Number.isFinite(x) || !Number.isFinite(y)) return
      manualAt.current = performance.now()
      fly(layerRef.current, { x, y })
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener(CART_ADD_EVENT, onManual)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener(CART_ADD_EVENT, onManual)
    }
  }, [])

  // El contador subió: si fue por un clic reciente (y no hubo evento manual), vuela
  useEffect(() => {
    const prev = prevCount.current
    prevCount.current = count
    if (count <= prev || isOpen) return
    const now = performance.now()
    const click = lastClick.current
    if (!click || now - click.at > CLICK_WINDOW) return
    if (now - manualAt.current < CLICK_WINDOW) return
    lastClick.current = null
    fly(layerRef.current, click)
  }, [count, isOpen])

  return createPortal(<div ref={layerRef} className="fly-layer" aria-hidden="true" />, document.body)
}
