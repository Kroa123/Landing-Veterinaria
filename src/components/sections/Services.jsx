import { ArrowRight, CalendarDays, Clock, Phone } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import Reveal from '../motion/Reveal.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import SpotCard from '../decor/SpotCard.jsx'
import ServiceArt from '../decor/ServiceArt.jsx'
import { prefillBooking } from '../../lib/booking.js'
import { services } from '../../data/services.js'
import { site } from '../../config/site.js'
import { formatPrice } from '../../lib/formatPrice.js'

// Servicios como vitrina: tarjetas de vidrio con ilustración propia, luz que sigue al
// cursor y tilt leve. Cada tarjeta lleva su precio "desde" y un CTA que precarga el
// servicio en el formulario de Contacto. Urgencias llama directo.
function ServiceCard({ s }) {
  // Consulta (destacada) y Urgencias se muestran horizontales en escritorio
  const wide = s.featured || s.urgent
  return (
    <SpotCard
      className={`service-card group/card flex h-full flex-col rounded-[28px] border border-night-line p-2 ${
        wide ? 'lg:flex-row' : ''
      } ${s.featured ? 'service-card--featured' : ''} ${s.urgent ? 'service-card--urgent' : ''}`}
    >
      <div
        className={`service-art-wrap relative flex items-center justify-center overflow-hidden rounded-[22px] ${
          s.featured ? 'lg:w-[46%]' : s.urgent ? 'lg:w-[30%]' : ''
        }`}
      >
        <ServiceArt id={s.id} className={`w-full ${s.featured ? 'max-w-[360px]' : 'max-w-[260px]'} ${s.urgent ? 'lg:max-w-[220px]' : ''}`} />
        {s.tag ? (
          <span className="absolute left-3 top-3 rounded-full border border-mint/30 bg-night/85 px-3 py-1 text-[12px] font-medium text-mint">
            {s.tag}
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5 ${wide ? 'lg:justify-center lg:px-8' : ''}`}>
        <h3 className={`font-medium leading-tight tracking-[-0.02em] text-on-night ${s.featured ? 'text-[24px] lg:text-[32px]' : 'text-[21px]'}`}>
          {s.name}
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-on-night-soft">{s.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="price-chip">
            <span className="text-[12px] text-on-night-soft">desde</span>
            <span className="font-mono text-[16px] font-medium tabular-nums text-on-night">{formatPrice(s.priceFrom)}</span>
            {s.unit ? <span className="text-[12px] text-on-night-soft">{s.unit}</span> : null}
          </span>
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-night-line px-3 font-mono text-[12px] text-on-night-soft">
            <Icon icon={Clock} size={14} />
            {s.duration}
          </span>
        </div>

        <div className={`pt-6 ${wide ? '' : 'mt-auto'}`}>
          {s.urgent ? (
            <Button href={site.phone.href} variant="night-primary" className="w-full sm:w-auto">
              <Icon icon={Phone} />
              Llamar ahora
              <span className="sr-only">: {site.phone.display}</span>
            </Button>
          ) : (
            <Button
              href="#contacto"
              variant={s.featured ? 'night-primary' : 'night-secondary'}
              onClick={() => prefillBooking({ service: s.id })}
              className="w-full sm:w-auto"
            >
              <Icon icon={CalendarDays} />
              Agendar
              <span className="sr-only"> {s.name}</span>
              <Icon icon={ArrowRight} className="service-cta-arrow" />
            </Button>
          )}
        </div>
      </div>
    </SpotCard>
  )
}

export default function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="theme-night relative isolate overflow-hidden py-24 lg:py-32">
      <SectionBackdrop glows="c" pattern="grid" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SplitHeading
            id="servicios-title"
            eyebrow="Servicios"
            title={
              <>
                Todo lo que tu mascota necesita, <span className="text-glow">en un solo lugar</span>
              </>
            }
            lede="Precios de referencia. El valor final depende del peso y de lo que necesite tu mascota, y te lo decimos antes de empezar."
          />
          <Reveal className="shrink-0">
            <Button href="#contacto" variant="night-primary" size="lg">
              <Icon icon={CalendarDays} />
              Agendar consulta
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.08} className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map((s) => (
            <li key={s.id} className={`flex ${s.featured ? 'md:col-span-2' : ''} ${s.urgent ? 'md:col-span-2 lg:col-span-3' : ''}`}>
              <ServiceCard s={s} />
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
