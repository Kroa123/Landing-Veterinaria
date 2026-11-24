import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.js'
import { useCart } from '../../context/cart.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { setLenis } from '../../lib/scroll.js'

// Scroll suave con Lenis, sincronizado con el ticker de GSAP y ScrollTrigger.
// - Con prefers-reduced-motion no se crea: queda el scroll nativo.
// - La instancia queda en lib/scroll.js: el layout la usa para subir al cambiar de ruta y
//   para llevar a un #ancla (Lenis respeta scroll-padding-top, el offset del header).
// - Con el carrito abierto (modal) se detiene; las listas internas scrollean nativas.
export default function SmoothScroll({ children = null }) {
  const reduced = useReducedMotion()
  const { isOpen } = useCart()
  const lenisRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Contenedores con scroll propio (lista del carrito, filtros) scrollean nativos
      allowNestedScroll: true,
    })
    lenisRef.current = lenis
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Las fuentes cambian alturas: recalcula los disparadores al terminar de cargar
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh()
    })

    return () => {
      alive = false
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [reduced])

  // La altura de la página cambia sin resize de ventana (filtro de la tienda, acordeón de FAQ,
  // fuentes): recalcula los ScrollTrigger con un debounce corto
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined
    let timer = 0
    let lastHeight = document.body.offsetHeight
    const ro = new ResizeObserver(() => {
      const h = document.body.offsetHeight
      if (h === lastHeight) return
      lastHeight = h
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

  // Modal abierto: Lenis quieto (el drawer ya bloquea el overflow del documento)
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (isOpen) lenis.stop()
    else lenis.start()
  }, [isOpen, reduced])

  return children
}
