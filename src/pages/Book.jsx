import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Icon from '../components/ui/Icon.jsx'
import PageHero from '../components/decor/PageHero.jsx'
import BookingForm from '../components/sections/BookingForm.jsx'
import HoursCard from '../components/sections/HoursCard.jsx'
import ChapitaMini3D from '../components/three/ChapitaMini3D.jsx'
import { getService } from '../data/services.js'
import { getVet } from '../data/team.js'
import { site } from '../config/site.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

// Precarga del formulario desde la URL. Solo acepta ids conocidos (lista blanca):
// ?servicio=<id de services.js>  ?vet=<id de team.js> (arma el motivo "Me gustaría atenderme con…")
function readPrefill(params) {
  const service = getService(params.get('servicio') || '')
  const vet = getVet(params.get('vet') || '')
  return {
    service: service?.id || '',
    notes: vet ? `Me gustaría atenderme con ${vet.name}` : '',
  }
}

// Agendar: formulario de reserva (arma el mensaje de WhatsApp) con horario y estado
// abierto/cerrado al lado. Se precarga con ?servicio= y ?vet=.
export default function Book() {
  usePageMeta({
    title: 'Agendar consulta',
    description:
      'Pide tu hora en Valle Vet: elige servicio y día, y te confirmamos por WhatsApp. Atendemos de lunes a sábado; urgencias por teléfono 24 h.',
  })

  const [params] = useSearchParams()
  const prefill = readPrefill(params)
  const prefillKey = `${prefill.service}|${prefill.notes}`
  // Servicio elegido en el formulario (empieza con el de la URL): el aviso de urgencia lo sigue
  const [serviceId, setServiceId] = useState(prefill.service)
  const urgent = Boolean(getService(serviceId)?.urgent)
  // La chapita 3D solo se monta en escritorio: en móvil no crea WebGL ni descarga el chunk 3D
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <>
      <PageHero
        eyebrow="Agendar"
        title="Pide tu hora en un minuto"
        lede="Completa tus datos y al enviar se abre WhatsApp con el mensaje listo. Te respondemos con la hora disponible más cercana."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Agendar' }]}
        tone="leaf"
        aside={isDesktop ? <ChapitaMini3D className="mx-auto aspect-square w-full max-w-[16rem]" /> : null}
      />

      <section aria-label="Formulario de reserva y horario" className="band-page pb-24 pt-10 lg:pb-32 lg:pt-14">
        <Container className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            {urgent ? (
              <p role="note" className="mb-5 flex items-start gap-3 rounded-card border border-line bg-coral-soft px-5 py-4 text-[15px] leading-6 text-ink">
                <Icon icon={Phone} className="mt-0.5" />
                <span>
                  Si es una urgencia, no esperes la respuesta: llama al{' '}
                  <a href={site.phone.href} className="font-mono font-medium tabular-nums underline underline-offset-4">
                    {site.phone.display}
                  </a>
                  . Contestamos las 24 horas.
                </span>
              </p>
            ) : null}
            <BookingForm prefill={prefill} prefillKey={prefillKey} onServiceChange={setServiceId} />
          </div>

          <aside aria-label="Horario y dirección" className="grid content-start gap-5">
            <HoursCard />
            <div className="surface-card rounded-panel p-6">
              <h2 className="flex items-center gap-2 text-[17px] font-medium text-ink">
                <Icon icon={MapPin} className="text-brand" />
                Dónde estamos
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-ink">{site.address.street}</p>
              <p className="mt-1 text-[14px] leading-5 text-ink-soft">{site.address.reference}</p>
              <Link to="/contacto" className="mt-4 inline-flex min-h-11 items-center text-[15px] font-medium text-brand underline-offset-4 hover:underline">
                Ver mapa y cómo llegar
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
