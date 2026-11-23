import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.js'
import { useCart } from '../../context/cart.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Scroll suave con Lenis, sincronizado con el ticker de GSAP y ScrollTrigger.
// - Con prefers-reduced-motion no se crea: queda el scroll nativo.
// - Los enlaces "#ancla" pasan por Lenis y respetan scroll-margin-top (offset del header).
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

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Anclas internas: scroll suave + hash en la URL + foco en el destino (teclado/lectores)
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target.closest?.('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')
      if (hash.length < 2) return
      let target = null
      try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)))
      } catch {
        return
      }
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { duration: 1.1 })
      try {
        window.history.pushState(null, '', hash)
      } catch {
        // Sin history (iframes sandbox): el scroll igual funciona
      }
      // Mueve el foco al destino sin saltar, como hace el navegador con un ancla nativa
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
        target.setAttribute('data-anchor-focus', '')
        target.addEventListener(
          'blur',
          () => {
            target.removeAttribute('tabindex')
            target.removeAttribute('data-anchor-focus')
          },
          { once: true },
        )
      }
      target.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)

    // Las fuentes cambian alturas: recalcula los disparadores al terminar de cargar
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh()
    })

    return () => {
      alive = false
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
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
