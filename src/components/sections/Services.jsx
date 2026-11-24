import { ArrowRight, CalendarDays, Check, Clock, Phone } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import Reveal from '../motion/Reveal.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import SpotCard from '../decor/SpotCard.jsx'
import ServiceArt from '../decor/ServiceArt.jsx'
import { bookPath, bookServicePath } from '../../data/navigation.js'
import { services } from '../../data/services.js'
import { site } from '../../config/site.js'
import { formatPrice } from '../../lib/formatPrice.js'

// Servicios como vitrina: tarjetas blancas con ilustración propia sobre un fondo de color
// (tono por tarjeta), luz que sigue al cursor y tilt leve. Cada tarjeta lleva su precio "desde" y un CTA a /agendar?servicio=<id>
// que precarga el servicio en el formulario. Urgencias llama directo.
// detailed: muestra el párrafo largo y la lista "qué incluye" (página Servicios).
// compact: todas las tarjetas del mismo tamaño (destacados de Inicio).
// Tono de cada tarjeta (luz + fondo de la ilustración): alterna para dar variedad; urgencias coral
const TINTS = ['leaf', 'sky', 'sun']

function ServiceCard({ s, index = 0, detailed = false, compact = false }) {
  // Consulta (destacada) y Urgencias se muestran horizontales en escritorio
  const wide = !compact && (s.featured || s.urgent)
  const tint = s.urgent ? 'coral' : TINTS[index % TINTS.length]
  return (
    <SpotCard
      tint={tint}
      className={`service-card group/card flex h-full flex-col rounded-[28px] border border-line p-2 ${
        wide ? 'lg:flex-row' : ''
      } ${s.featured ? 'service-card--featured' : ''} ${s.urgent ? 'service-card--urgent' : ''}`}
    >
      <div
        className={`service-art-wrap relative flex items-center justify-center overflow-hidden rounded-[22px] ${
          !wide ? '' : s.featured ? 'lg:w-[46%]' : 'lg:w-[30%]'
        }`}
      >
        <ServiceArt id={s.id} className={`w-full ${wide && s.featured ? 'max-w-[360px]' : 'max-w-[260px]'} ${wide && s.urgent ? 'lg:max-w-[220px]' : ''}`} />
        {s.tag ? (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-semibold text-ink ${
              s.urgent ? 'bg-coral' : 'bg-sun'
            }`}
          >
            {s.tag}
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5 ${wide ? 'lg:justify-center lg:px-8' : ''}`}>
        <h3 className={`font-medium leading-tight tracking-[-0.02em] text-ink ${wide && s.featured ? 'text-[24px] lg:text-[32px]' : 'text-[21px]'}`}>
          {s.name}
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-ink-soft">{detailed && s.detail ? s.detail : s.description}</p>

        {detailed && s.includes?.length ? (
          <div className="mt-4 rounded-[16px] bg-page p-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">Qué incluye</p>
            <ul className="mt-3 grid gap-2 text-[14px] leading-5 text-ink-soft sm:grid-cols-2">
              {s.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-leaf-soft text-brand-hover" aria-hidden="true">
                    <Icon icon={Check} size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="price-chip">
            <span className="text-[12px] text-muted">desde</span>
            <span className="font-mono text-[16px] font-medium tabular-nums text-ink">{formatPrice(s.priceFrom)}</span>
            {s.unit ? <span className="text-[12px] text-muted">{s.unit}</span> : null}
          </span>
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line bg-card px-3 font-mono text-[12px] text-ink-soft">
            <Icon icon={Clock} size={14} />
            {s.duration}
          </span>
        </div>

        <div className={`pt-6 ${wide ? '' : 'mt-auto'}`}>
          {s.urgent ? (
            <Button href={site.phone.href} variant="accent" className="w-full sm:w-auto">
              <Icon icon={Phone} />
              Llamar ahora
              <span className="sr-only">: {site.phone.display}</span>
            </Button>
          ) : (
            <Button
              to={bookServicePath(s.id)}
              variant={s.featured ? 'primary' : 'secondary'}
              className="w-full sm:w-auto"
            >
              <Icon icon={CalendarDays} />
              {detailed ? 'Agendar este servicio' : 'Agendar'}
              <span className="sr-only"> {s.name}</span>
              <Icon icon={ArrowRight} className="service-cta-arrow" />
            </Button>
          )}
        </div>
      </div>
    </SpotCard>
  )
}

// Props:
//   highlight  solo los servicios destacados (Inicio) + enlace "Ver todos los servicios"
//   detailed   tarjetas con detalle y "qué incluye" (página Servicios)
//   id         id de la sección (ancla)
//   band       fondo de la sección (clase .band-*): page por defecto
//   eyebrow    texto sobre el título ("Servicios"); null lo quita (la página Servicios ya
//              lo muestra en su PageHero y no se repite)
export default function Services({ highlight = false, detailed = false, id = 'servicios', band = 'page', eyebrow = 'Servicios' }) {
  const list = highlight ? services.filter((s) => s.highlight) : services
  const titleId = `${id}-title`

  return (
    <section id={id} aria-labelledby={titleId} className={`band-${band} relative isolate overflow-hidden py-24 lg:py-32`}>
      <SectionBackdrop glows="c" pattern="dots" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SplitHeading
            id={titleId}
            eyebrow={eyebrow}
            title={
              highlight ? (
                <>
                  Lo que más nos piden, <span className="text-highlight">con precio claro</span>
                </>
              ) : (
                <>
                  Todo lo que tu mascota necesita, <span className="text-highlight">en un solo lugar</span>
                </>
              )
            }
            lede="Precios de referencia. El valor final depende del peso y de lo que necesite tu mascota, y te lo decimos antes de empezar."
          />
          <Reveal className="flex shrink-0 flex-wrap gap-3">
            {highlight ? (
              <Button to="/servicios" variant="secondary" size="lg">
                Ver todos los servicios
                <Icon icon={ArrowRight} />
              </Button>
            ) : null}
            <Button to={bookPath} variant="primary" size="lg">
              <Icon icon={CalendarDays} />
              Agendar consulta
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.08} className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {list.map((s, i) => (
            <li
              key={s.id}
              className={`flex ${!highlight && s.featured ? 'md:col-span-2' : ''} ${!highlight && s.urgent ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              <ServiceCard s={s} index={i} detailed={detailed} compact={highlight} />
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
