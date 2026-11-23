import { useRef } from 'react'
import { gsap, useGSAP } from '../motion/gsap.js'

const formatters = new Map()
function format(n, decimals) {
  if (!formatters.has(decimals)) {
    formatters.set(
      decimals,
      new Intl.NumberFormat('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    )
  }
  return formatters.get(decimals).format(n)
}

// Número que cuenta desde 0 al entrar en pantalla. El lector de pantalla recibe
// solo el valor final (sr-only); la animación es aria-hidden.
// El span animado no tiene texto propiedad de React: lo escribe solo GSAP, así un
// re-render nunca pisa el valor a mitad de la cuenta.
export default function Counter({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null)
  const final = format(value, decimals)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(
        { animate: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          if (ctx.conditions.reduce) {
            el.textContent = format(value, decimals)
            return
          }
          const state = { v: 0 }
          el.textContent = format(0, decimals)
          gsap.to(state, {
            v: value,
            duration: 2.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            onUpdate: () => {
              el.textContent = format(state.v, decimals)
            },
          })
          return () => {
            el.textContent = format(value, decimals)
          }
        },
      )
    },
    { dependencies: [value, decimals], revertOnUpdate: true },
  )

  return (
    <span className={className}>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        <span ref={ref} />
        {suffix}
      </span>
    </span>
  )
}
