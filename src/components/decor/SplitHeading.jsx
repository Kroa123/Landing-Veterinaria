import { useRef } from 'react'
import { gsap, SplitText, useGSAP, EASE, showNow } from '../motion/gsap.js'

const SIZES = {
  md: 'text-[32px] sm:text-[40px] lg:text-[48px]',
  lg: 'text-[38px] sm:text-[52px] lg:text-[64px]',
  xl: 'text-[44px] sm:text-[68px] lg:text-[92px]',
}

// Encabezado de sección grande con entrada por líneas (SplitText con máscara).
// eyebrow: texto corto sobre el título. lede: bajada. children: acciones bajo la bajada.
// Con prefers-reduced-motion se muestra estático. El id va en el encabezado (aria-labelledby).
// as: nivel del encabezado ('h2' por defecto; 'h1' en el encabezado de una página interior).
// Colores por token (text-ink / text-ink-soft): funciona en page, card y en todas las .band-* soft.
// Dentro de .band-brand pasa a blanco / leaf-soft solo.
export default function SplitHeading({
  as: Heading = 'h2',
  id,
  eyebrow,
  title,
  lede,
  align = 'left',
  size = 'lg',
  focusable = false,
  className = '',
  children,
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const root = ref.current
      const heading = root?.querySelector('[data-split-heading]')
      if (!heading) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = { trigger: root, start: 'top 85%', once: true }
        const split = SplitText.create(heading, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 115, duration: 1.15, ease: EASE, stagger: 0.09, scrollTrigger: trigger }),
        })
        const fades = root.querySelectorAll('[data-fade]')
        if (fades.length) {
          gsap.from(fades, {
            opacity: 0,
            y: 18,
            duration: 0.9,
            delay: 0.2,
            ease: EASE,
            stagger: 0.08,
            clearProps: 'opacity,transform',
            scrollTrigger: trigger,
          })
        }
        // Foco por Tab dentro del encabezado antes de que entre: se muestra al instante
        const onFocusIn = () => {
          showNow(fades)
          if (split.lines?.length) showNow(split.lines)
        }
        root.addEventListener('focusin', onFocusIn)
        return () => {
          root.removeEventListener('focusin', onFocusIn)
          split.revert()
        }
      })
    },
    { scope: ref },
  )

  const center = align === 'center'

  return (
    <div ref={ref} className={`${center ? 'mx-auto max-w-[50rem] text-center' : 'max-w-[46rem]'} ${className}`}>
      {eyebrow ? (
        <p data-fade className={`eyebrow ${center ? 'justify-center' : ''}`}>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        data-split-heading=""
        tabIndex={focusable ? -1 : undefined}
        className={`heading-display mt-4 text-ink in-[.band-brand]:text-white ${SIZES[size] || SIZES.lg}`}
      >
        {title}
      </Heading>
      {lede ? (
        <p data-fade className="mt-5 text-[17px] leading-[1.65] text-ink-soft in-[.band-brand]:text-leaf-soft sm:text-[18px]">
          {lede}
        </p>
      ) : null}
      {children ? (
        <div data-fade className={`mt-8 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>
          {children}
        </div>
      ) : null}
    </div>
  )
}
