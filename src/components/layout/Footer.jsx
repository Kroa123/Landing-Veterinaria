import { useRef } from 'react'
import { ArrowUp, ArrowUpRight, AtSign, CalendarDays, Phone } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Reveal from '../motion/Reveal.jsx'
import Logo from '../ui/Logo.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import { gsap, useGSAP } from '../motion/gsap.js'
import { site } from '../../config/site.js'

// Pie de página: columnas, redes, volver arriba y una marca gigante en contorno que
// se rellena de mint con el scroll (scrub). Con reduced-motion la marca se ve rellena.
export default function Footer() {
  const year = new Date().getFullYear()
  const wordRef = useRef(null)

  useGSAP(
    () => {
      const word = wordRef.current
      const fill = word?.querySelector('.wordmark-fill')
      if (!fill) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          fill,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
          },
        )
      })
    },
    { scope: wordRef },
  )

  return (
    <footer className="theme-night relative isolate overflow-hidden bg-night pb-32 pt-20 md:pb-10">
      <SectionBackdrop glows="e" pattern="none" />
      {/* Línea de luz superior: costura suave con Contacto */}
      <span
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(110_231_183/0.35),transparent)]"
        aria-hidden="true"
      />
      <Container>
        <Reveal stagger={0.06} y={16} start="top 95%" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <a
              href="#inicio"
              className="fx-logo -ml-1 inline-flex min-h-11 items-center rounded-control px-1"
              aria-label={`${site.name}, volver al inicio`}
            >
              <Logo />
            </a>
            <p className="mt-4 max-w-[22rem] text-[15px] leading-6 text-ink-soft">
              {site.tagline} para perros y gatos. {site.address.street}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button href="#contacto" variant="night-primary" size="sm">
                <Icon icon={CalendarDays} />
                Agendar consulta
              </Button>
              <Button href="#tienda" variant="night-secondary" size="sm">
                Ver tienda
              </Button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-mint">Horario</h2>
            <ul className="mt-4 space-y-2 font-mono text-[13px] leading-5 text-ink-soft">
              {site.hours.map((h) => (
                <li key={h.label}>
                  {h.label} {h.open ? `${h.open}–${h.close}` : 'cerrado'}
                </li>
              ))}
              <li>urgencias 24 h por teléfono</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-mint">Contacto</h2>
            <ul className="mt-3 space-y-1 text-[15px] text-ink-soft">
              <li>
                <a href={site.phone.href} className="fx-link inline-flex min-h-11 items-center gap-2 font-mono text-[14px] tabular-nums hover:text-ink">
                  <Icon icon={Phone} size={16} className="text-mint" />
                  {site.phone.display}
                </a>
              </li>
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link group inline-flex min-h-11 items-center gap-2 rounded-full border border-night-line py-1 pl-1 pr-4 hover:text-ink"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-mint/10 text-mint transition-colors group-hover:bg-mint group-hover:text-night">
                      <Icon icon={AtSign} size={16} />
                    </span>
                    {s.label} {s.handle}
                    <Icon icon={ArrowUpRight} size={14} className="social-arrow" />
                    <span className="sr-only"> (se abre en otra pestaña)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-mint">Secciones</h2>
            <ul className="mt-3 space-y-1 text-[15px] text-ink-soft">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="fx-link inline-flex min-h-11 items-center hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </Container>

      {/* Marca gigante: contorno + relleno que avanza con el scroll. Decorativa. */}
      <div ref={wordRef} className="wordmark relative mt-16 select-none overflow-hidden px-3 md:mt-20" aria-hidden="true">
        <p className="wordmark-outline">{site.name}</p>
        <p className="wordmark-fill">{site.name}</p>
      </div>

      <Container>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-6">
          <p className="text-[13px] text-ink-soft">
            © {year} {site.name}. Precios en pesos chilenos, sujetos a stock.
          </p>
          <a
            href="#inicio"
            className="back-top group inline-flex min-h-11 items-center gap-3 rounded-full border border-night-line py-1 pl-4 pr-1 text-[14px] text-ink-soft transition-colors hover:border-mint/50 hover:text-ink"
          >
            Volver arriba
            <span className="flex size-9 items-center justify-center rounded-full bg-mint text-night">
              <Icon icon={ArrowUp} className="back-top-arrow" />
            </span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
