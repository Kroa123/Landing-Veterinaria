import { useRef, useState } from 'react'
import { Pause, PawPrint, Play } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Reveal from '../motion/Reveal.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import Stars from '../decor/Stars.jsx'
import GoogleMark from '../decor/GoogleMark.jsx'
import { testimonials } from '../../data/testimonials.js'
import { rating } from '../../data/stats.js'
import { useInView } from '../../hooks/useInView.js'

const IN_VIEW = { rootMargin: '100px' }

function Card({ t }) {
  const value = t.rating || 5
  return (
    <figure className="review-card flex w-[300px] shrink-0 flex-col rounded-[24px] border border-line p-6 sm:w-[360px]">
      <div className="flex items-center justify-between gap-3">
        <Stars value={value} size={15} label={`${value} de 5 estrellas`} />
        <GoogleMark size={16} className="opacity-80" />
      </div>
      <blockquote className="mt-4 flex-1 text-[16px] leading-[1.6] text-ink">
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="mt-5 flex flex-wrap items-center gap-2 text-[14px]">
        <span className="font-medium text-ink">{t.name}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-2.5 py-1 text-[12px] font-medium text-brand-hover">
          <Icon icon={PawPrint} size={13} />
          {t.pet}
        </span>
      </figcaption>
    </figure>
  )
}

// Fila infinita: la lista va dos veces (la copia es aria-hidden) y se desplaza -50%.
// Se pausa fuera de pantalla, al pasar el cursor y con el botón de pausa.
// decorative: la fila completa es aria-hidden (la segunda fila repite las mismas opiniones).
function MarqueeRow({ items, reverse = false, running, decorative = false }) {
  return (
    <div
      className={`marquee ${reverse ? 'marquee--reverse' : ''}`}
      data-running={running}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <div className="marquee-track">
        <ul className="marquee-list">
          {items.map((t) => (
            <li key={t.name} className="flex">
              <Card t={t} />
            </li>
          ))}
        </ul>
        <ul className="marquee-list marquee-dup" aria-hidden="true">
          {items.map((t) => (
            <li key={t.name} className="flex">
              <Card t={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// band: fondo de la sección (clase .band-*); sun por defecto (opiniones = destacados).
export default function Testimonials({ band = 'sun' }) {
  const sectionRef = useRef(null)
  const [paused, setPaused] = useState(false)
  // Sin opiniones visibles no gasta en animar
  const visible = useInView(sectionRef, IN_VIEW)

  // Sin opiniones cargadas, la sección no se muestra
  if (!testimonials.length) return null

  const rowA = testimonials
  const rowB = [...testimonials].reverse()
  const running = visible && !paused

  return (
    <section ref={sectionRef} id="opiniones" aria-labelledby="opiniones-title" className={`band-${band} relative isolate overflow-hidden py-24 lg:py-32`}>
      <SectionBackdrop glows="none" pattern="paws" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SplitHeading
            id="opiniones-title"
            eyebrow="Opiniones"
            title={
              <>
                Lo que dicen <span className="text-highlight">sus humanos</span>
              </>
            }
          />
          <Reveal className="flex flex-wrap items-center gap-3">
            <div className="google-badge flex items-center gap-4 rounded-[20px] border border-line px-5 py-4">
              <GoogleMark size={30} />
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
                    {String(rating.value).replace('.', ',')}
                  </span>
                  <Stars value={rating.value} size={16} label={`${String(rating.value).replace('.', ',')} de 5 estrellas`} />
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {rating.count} opiniones en {rating.source}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="marquee-toggle flex size-11 motion-reduce:hidden items-center justify-center rounded-full border border-line-strong bg-card text-ink-soft transition-colors hover:border-brand hover:text-brand-hover"
            >
              <Icon icon={paused ? Play : Pause} />
              {/* Etiqueta fija + aria-pressed: el estado lo anuncia "presionado / no presionado" */}
              <span className="sr-only">Pausar opiniones en movimiento</span>
            </button>
          </Reveal>
        </div>
      </Container>

      <div className="marquee-wrap mt-14 space-y-4">
        <MarqueeRow items={rowA} running={running} />
        <MarqueeRow items={rowB} reverse running={running} decorative />
      </div>
    </section>
  )
}
