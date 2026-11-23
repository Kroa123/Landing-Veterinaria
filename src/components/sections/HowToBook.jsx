import { useRef } from 'react'
import { CalendarDays, MessageCircle } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import PhoneChat from '../decor/PhoneChat.jsx'
import { questionUrl } from '../../lib/booking.js'
import { gsap, useGSAP } from '../motion/gsap.js'
import { site } from '../../config/site.js'

const steps = [
  {
    title: 'Elige servicio y día',
    text: 'Completa el formulario de esta página o escríbenos por WhatsApp con el nombre de tu mascota y el día que te acomoda.',
  },
  {
    title: 'Te confirmamos la hora',
    text: 'Respondemos dentro del horario de atención con la hora disponible más cercana a lo que pediste.',
  },
  {
    title: 'Llega con su carnet',
    text: `Trae el carnet de vacunas y, si toma algún remedio, la caja. Estamos en ${site.address.street}.`,
  },
]

// Cómo agendar: en escritorio la sección se fija (pin) y el scroll avanza la línea de
// progreso, enciende cada paso y escribe la conversación de WhatsApp en el teléfono.
// En móvil los pasos van apilados y el chat entra solo. Con reduced-motion, todo estático.
export default function HowToBook() {
  const root = useRef(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()

      mm.add(
        {
          // Pin solo con alto suficiente (≥ 800 px) para que el teléfono quepa entero
          desktop: '(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)',
          compact: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference), (max-height: 799.98px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions
          const bubbles = q('.chat-bubble')
          const typing = q('.chat-typing')[0]
          const stepEls = q('.htb-step')
          const progress = q('.htb-progress')

          if (desktop) {
            const pin = q('.htb-pin')[0]
            gsap.set(bubbles, { autoAlpha: 0, y: 18, scale: 0.96 })
            if (typing) gsap.set(typing, { display: 'flex' })
            gsap.set(stepEls, { opacity: 0.32 })
            gsap.set(progress, { scaleY: 0 })

            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: pin, start: 'top top', end: '+=1700', pin: true, scrub: 0.6, anticipatePin: 1 },
            })
            tl.to(progress, { scaleY: 1, duration: 3 }, 0)
            stepEls.forEach((stepEl, i) => {
              tl.to(stepEl, { opacity: 1, duration: 0.3 }, i * 1 + 0.05)
              bubbles
                .filter((b) => Number(b.dataset.step) === i)
                .forEach((b, j) => {
                  tl.to(b, { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }, i + 0.15 + j * 0.28)
                })
            })
            // "Escribiendo..." desaparece cuando llega la respuesta
            if (typing) tl.set(typing, { display: 'none' }, 1.42)
            tl.to({}, { duration: 0.4 })
            return
          }

          // Compacto: los pasos entran en cascada y el chat se escribe al aparecer el teléfono
          gsap.from(stepEls, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.12,
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: q('.htb-steps')[0], start: 'top 80%', once: true },
          })
          gsap.from(progress, {
            scaleY: 0,
            ease: 'none',
            scrollTrigger: { trigger: q('.htb-steps')[0], start: 'top 70%', end: 'bottom 55%', scrub: 0.5 },
          })
          gsap.from(
            bubbles.filter((b) => b !== typing),
            {
              autoAlpha: 0,
              y: 16,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.35,
              scrollTrigger: { trigger: q('.phone')[0], start: 'top 75%', once: true },
            },
          )
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="como-agendar" aria-labelledby="agendar-title" className="theme-night relative isolate overflow-hidden">
      <SectionBackdrop glows="d" pattern="contour" band />
      <div className="htb-pin py-24 lg:flex lg:min-h-screen lg:items-center lg:py-20 lg:pt-28 lg:[@media(max-height:880px)]:py-12 lg:[@media(max-height:880px)]:pt-20">
        <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="min-w-0">
            <SplitHeading
              id="agendar-title"
              eyebrow="Cómo agendar"
              size="md"
              title={
                <>
                  Tu hora lista <span className="text-glow">en tres mensajes</span>
                </>
              }
            />

            <ol className="htb-steps relative mt-10 space-y-3">
              {/* Riel de progreso: se dibuja con el scroll */}
              <span className="absolute bottom-6 left-[29px] top-6 w-px bg-line-strong" aria-hidden="true">
                <span className="htb-progress absolute inset-0 origin-top bg-[linear-gradient(to_bottom,#6EE7B7,#34D399)] shadow-[0_0_12px_rgb(110_231_183/0.6)]" />
              </span>
              {steps.map((step, i) => (
                <li key={step.title} className="htb-step fx-group relative flex gap-5 rounded-[20px] p-3 pr-4 transition-colors hover:bg-raised">
                  <span
                    className="htb-num relative z-[1] flex size-[34px] shrink-0 items-center justify-center rounded-full border border-mint/40 bg-night font-mono text-[14px] tabular-nums text-mint shadow-[0_0_0_6px_var(--color-night-raised)]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-[19px] font-medium leading-6 text-on-night">
                      <span className="sr-only">Paso {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-[30rem] text-[15px] leading-6 text-on-night-soft">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#contacto" variant="night-primary" size="lg">
                <Icon icon={CalendarDays} />
                Agendar ahora
              </Button>
              <Button href={questionUrl} external variant="night-secondary" size="lg">
                <Icon icon={MessageCircle} />
                Escribir por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </Button>
            </div>
          </div>

          {/* Pantallas bajas (≤ 880 px de alto): el teléfono se achica para caber entero */}
          <div className="relative flex min-w-0 justify-center lg:[@media(max-height:880px)]:scale-[0.84]">
            <div className="phone-halo" aria-hidden="true" />
            <PhoneChat />
          </div>
        </Container>
      </div>
    </section>
  )
}
