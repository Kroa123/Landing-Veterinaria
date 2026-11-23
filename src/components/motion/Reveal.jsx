import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE, showNow } from './gsap.js'

// Revela contenido al entrar en pantalla: fade + subida (solo opacity/transform).
//
// API estable:
//   <Reveal as="div" className="" delay={0} y={24} duration={0.9} start="top 85%">
//     ...un bloque que entra completo
//   </Reveal>
//
//   <Reveal stagger={0.08}>             // cada hijo directo entra en cascada
//   <Reveal stagger={0.08} items="li">  // o los elementos que coincidan con el selector (dentro del Reveal)
//
// Props:
//   as        etiqueta del contenedor (por defecto 'div'); el resto de props va al contenedor
//   delay     segundos antes de empezar (0)
//   y         desplazamiento inicial en px (24)
//   duration  segundos (0.9)
//   stagger   segundos entre hijos; > 0 anima los hijos en vez del bloque (0)
//   items     selector CSS de los hijos a animar cuando hay stagger (por defecto los hijos directos)
//   start     inicio del ScrollTrigger ("top 85%")
//   once      true: se revela una vez y no vuelve a ocultarse (true)
//
// Solo opacity (no visibility): lo que aún no se reveló sigue en el orden de Tab.
// Con prefers-reduced-motion no anima: el contenido se muestra tal cual.
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 24,
  duration = 0.9,
  stagger = 0,
  items,
  start = 'top 85%',
  once = true,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets =
          stagger > 0 ? (items ? gsap.utils.toArray(items, root) : Array.from(root.children)) : [root]
        if (!targets.length) return
        // transition: none mientras entra (algunas tarjetas transicionan transform en hover);
        // al terminar se limpian los estilos en línea y vuelven los hovers del CSS
        gsap.set(targets, { opacity: 0, y, transition: 'none' })
        const clearProps = 'opacity,transform,transition'
        let shown = false

        if (stagger > 0) {
          // Cada hijo tiene su propio disparador; los que entran juntos van en cascada
          ScrollTrigger.batch(targets, {
            start,
            once,
            onEnter: (batch) => {
              if (shown) return
              gsap.to(batch, { opacity: 1, y: 0, duration, delay, stagger, ease: EASE, overwrite: true, clearProps })
            },
            onLeaveBack: once
              ? undefined
              : (batch) => gsap.to(batch, { opacity: 0, y, transition: 'none', duration: 0.3, overwrite: true }),
          })
        } else {
          gsap.to(root, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: EASE,
            clearProps: once ? clearProps : undefined,
            scrollTrigger: {
              trigger: root,
              start,
              toggleActions: once ? 'play none none none' : 'play none none reverse',
              once,
            },
          })
        }

        // Si el foco (Tab) entra antes de que se revele, se muestra al instante (sin tween que
        // deje el control a media opacidad) y la entrada por scroll ya no corre
        const onFocusIn = () => {
          if (shown) return
          shown = true
          showNow(targets)
        }
        root.addEventListener('focusin', onFocusIn)
        return () => root.removeEventListener('focusin', onFocusIn)
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
