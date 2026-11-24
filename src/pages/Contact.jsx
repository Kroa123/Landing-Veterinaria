import { ArrowUpRight, AtSign, CalendarDays, MapPin, MessageCircle, Navigation, Phone, Siren } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import PageHero from '../components/decor/PageHero.jsx'
import StaticMap from '../components/sections/StaticMap.jsx'
import HoursCard from '../components/sections/HoursCard.jsx'
import Faq from '../components/sections/Faq.jsx'
import { faq } from '../data/faq.js'
import { bookPath } from '../data/navigation.js'
import { questionUrl } from '../lib/booking.js'
import { site } from '../config/site.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

const contactFaq = faq.filter((f) => f.contact)

// Contacto: mapa estilizado con dirección, horario con estado en vivo, teléfono/WhatsApp,
// urgencias y una FAQ corta.
export default function Contact() {
  usePageMeta({
    title: 'Contacto',
    description: `Estamos en ${site.address.street}. Horario, teléfono y WhatsApp de Valle Vet. Urgencias por teléfono 24 h.`,
  })

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Estamos en Av. Los Aromos, frente a la plaza"
        lede="Escríbenos por WhatsApp, llámanos o pasa por el local. Para una urgencia, llama directo: contestamos las 24 horas."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Contacto' }]}
        tone="sky"
      >
        <Button href={questionUrl} external size="lg">
          <Icon icon={MessageCircle} />
          Escribir por WhatsApp
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </Button>
        <Button href={site.phone.href} variant="secondary" size="lg">
          <Icon icon={Phone} />
          Llamar
          <span className="sr-only">: {site.phone.display}</span>
        </Button>
      </PageHero>

      <section aria-label="Ubicación, horario y contacto" className="band-page py-16 lg:py-24">
        <Container>
          <Reveal stagger={0.1} className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* Mapa estilizado + dirección. Desde lg la tarjeta iguala la altura de la columna
                derecha: el marco del mapa crece (nunca menos que su proporción 400/240) y el SVG
                lo cubre a lo alto, recortando a los lados (10 % del recorte a la izquierda para
                no perder "Av. Los Aromos"). Así no queda hueco bajo la dirección. */}
            <div className="map-card overflow-hidden rounded-panel border border-line p-2 lg:flex lg:flex-col">
              <div className="relative overflow-hidden rounded-[14px] lg:aspect-[400/240] lg:flex-[1_0_auto] lg:[&>svg]:absolute lg:[&>svg]:top-0 lg:[&>svg]:left-[10%] lg:[&>svg]:aspect-[400/240] lg:[&>svg]:h-full lg:[&>svg]:w-auto lg:[&>svg]:max-w-none lg:[&>svg]:-translate-x-[10%]">
                <StaticMap />
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-4 pt-5">
                <div className="min-w-0">
                  <h2 className="flex gap-2 text-[17px] font-medium leading-6 text-ink">
                    <Icon icon={MapPin} className="mt-0.5 text-brand" />
                    {site.address.street}
                  </h2>
                  <p className="ml-[26px] mt-1 text-[14px] leading-5 text-ink-soft">{site.address.reference}</p>
                </div>
                <Button href={site.mapsUrl} external>
                  <Icon icon={Navigation} />
                  Cómo llegar
                  <Icon icon={ArrowUpRight} />
                  <span className="sr-only"> (se abre Google Maps en otra pestaña)</span>
                </Button>
              </div>
            </div>

            <div className="grid content-start gap-5">
              <HoursCard />

              {/* Canales */}
              <div className="surface-card rounded-panel p-6">
                <h2 className="text-[17px] font-medium text-ink">Escríbenos o llámanos</h2>
                <ul className="mt-4 space-y-1 text-[15px]">
                  <li>
                    <a href={site.phone.href} className="flex min-h-11 items-center gap-3 text-ink hover:text-brand">
                      <Icon icon={Phone} className="text-brand" />
                      <span className="font-mono tabular-nums">{site.phone.display}</span>
                    </a>
                  </li>
                  <li>
                    <a href={questionUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-ink hover:text-brand">
                      <Icon icon={MessageCircle} className="text-brand" />
                      WhatsApp
                      <span className="sr-only"> (se abre en otra pestaña)</span>
                    </a>
                  </li>
                  {site.socials.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-ink hover:text-brand">
                        <Icon icon={AtSign} className="text-brand" />
                        {s.label} {s.handle}
                        <span className="sr-only"> (se abre en otra pestaña)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Urgencias */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-4 rounded-panel border border-line bg-coral-soft p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-coral text-ink" aria-hidden="true">
                <Siren size={22} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-[18px] font-medium text-ink">Urgencias 24 h por teléfono</h2>
                <p className="mt-1 text-[15px] leading-6 text-ink-soft">
                  Llama al{' '}
                  <a href={site.phone.href} className="font-mono font-medium tabular-nums text-ink underline underline-offset-4">
                    {site.phone.display}
                  </a>
                  . Te orientamos a cualquier hora y, en horario de atención, las urgencias pasan primero.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-panel border border-line bg-leaf-soft p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-leaf text-ink" aria-hidden="true">
                <CalendarDays size={22} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-[18px] font-medium text-ink">¿Quieres agendar?</h2>
                <p className="mt-1 text-[15px] leading-6 text-ink-soft">Elige servicio y día, y te confirmamos la hora por WhatsApp.</p>
                <Button to={bookPath} variant="secondary" size="sm" className="mt-3">
                  Agendar consulta
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bandas: hero sky → page → leaf */}
      <Faq id="preguntas" items={contactFaq} title="Preguntas rápidas" band="leaf" />
    </>
  )
}
