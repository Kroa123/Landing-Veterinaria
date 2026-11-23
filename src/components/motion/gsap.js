// Punto único de GSAP: registra los plugins una sola vez y los reexporta.
// Todo el sitio importa gsap, ScrollTrigger, SplitText y useGSAP desde aquí.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// La curva del sitio (--ease-vet: cubic-bezier(0.22, 1, 0.36, 1)) en términos de GSAP
export const EASE = 'expo.out'

// Muestra al instante elementos a medio revelar (p. ej. al recibir foco por Tab).
// Quita opacity/transform con la transición anulada y fuerza un reflow; recién después
// devuelve la transición del CSS. Así el navegador no anima el salto de opacidad.
export function showNow(targets) {
  const list = gsap.utils.toArray(targets)
  if (!list.length) return
  gsap.killTweensOf(list)
  for (const el of list) el.style.transition = 'none'
  gsap.set(list, { clearProps: 'opacity,transform,visibility' })
  void list[0].offsetWidth
  for (const el of list) el.style.removeProperty('transition')
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
