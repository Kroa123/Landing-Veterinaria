import { useRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { gsap, ScrollTrigger, useGSAP, EASE, showNow } from '../motion/gsap.js'

// Grilla de productos con entrada en cascada por filas. Cuando cambia revealKey (filtro,
// búsqueda, orden) se rearma con los productos nuevos; los que ya están en pantalla entran
// de inmediato. Con prefers-reduced-motion no anima.
// headingLevel: nivel del nombre del producto en cada tarjeta (h2 si la página no tiene h2 previos).
export default function ProductGrid({ products, revealKey = '', className = '', headingLevel = 3 }) {
  const gridRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const grid = gridRef.current
        const items = gsap.utils.toArray(grid?.children || [])
        if (!items.length) return undefined
        // transition: none mientras entran (la tarjeta transiciona transform en el tilt);
        // al terminar se limpian los estilos en línea
        const clearProps = 'opacity,transform,transition'
        gsap.set(items, { opacity: 0, y: 40, transition: 'none' })
        let shown = false
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          interval: 0.08,
          onEnter: (batch) => {
            if (shown) return
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE, overwrite: true, clearProps })
          },
        })
        // Tab dentro de la grilla antes de revelarse: se muestra al instante
        const onFocusIn = () => {
          if (shown) return
          shown = true
          showNow(items)
        }
        grid.addEventListener('focusin', onFocusIn)
        return () => grid.removeEventListener('focusin', onFocusIn)
      })
    },
    { scope: gridRef, dependencies: [revealKey], revertOnUpdate: true },
  )

  return (
    <ul ref={gridRef} className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {products.map((p) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}
