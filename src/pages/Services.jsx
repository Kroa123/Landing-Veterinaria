import { CalendarDays, Phone, Siren } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import PageHero from '../components/decor/PageHero.jsx'
import ServicesSection from '../components/sections/Services.jsx'
import HowToBook from '../components/sections/HowToBook.jsx'
import { bookPath } from '../data/navigation.js'
import { site } from '../config/site.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

// Servicios: todos con detalle, precio "desde", qué incluye y "Agendar este servicio"
// (→ /agendar?servicio=<id>), bloque de urgencias 24 h y cómo agendar en 3 pasos.
export default function Services() {
  usePageMeta({
    title: 'Servicios',
    description:
      'Consulta general, vacunas, desparasitación, esterilización, baño y peluquería para perros y gatos, con precios de referencia. Urgencias por teléfono 24 h.',
  })

  return (
    <>
      <PageHero
        eyebrow="Servicios"
        title="Atención para perros y gatos, con precio claro desde el inicio"
        lede="Consulta, vacunas, esterilización y más. Te decimos cuánto cuesta antes de empezar y agendas en un minuto."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Servicios' }]}
        tone="sky"
      >
        <Button to={bookPath} size="lg">
          <Icon icon={CalendarDays} />
          Agendar consulta
        </Button>
        <Button href={site.phone.href} variant="secondary" size="lg">
          <Icon icon={Phone} />
          Urgencias 24 h
          <span className="sr-only">: {site.phone.display}</span>
        </Button>
      </PageHero>

      {/* Bandas: hero sky → page → blanco (urgencias coral) → sky */}
      <ServicesSection detailed id="lista-servicios" band="page" eyebrow={null} />

      {/* Urgencias: siempre visible, con el teléfono a mano */}
      <section aria-labelledby="urgencias-title" className="band-white py-16 lg:py-20">
        <Container>
          <div className="urgent-card grid gap-6 rounded-panel border p-6 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-coral text-ink" aria-hidden="true">
              <Siren size={26} strokeWidth={1.5} />
            </span>
            <div>
              <h2 id="urgencias-title" className="text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">
                ¿Es una urgencia? Llama, no agendes
              </h2>
              <p className="mt-3 max-w-[40rem] text-[16px] leading-[1.6] text-ink-soft">
                Contestamos el teléfono las 24 horas. Te decimos si puede esperar a la mañana, si conviene venir de inmediato o si es mejor ir a un centro de turno. En horario de atención, las urgencias pasan primero.
              </p>
            </div>
            <Button href={site.phone.href} size="lg" className="justify-self-start">
              <Icon icon={Phone} />
              <span className="font-mono tabular-nums">{site.phone.display}</span>
            </Button>
          </div>
        </Container>
      </section>

      <HowToBook band="sky" />
    </>
  )
}
