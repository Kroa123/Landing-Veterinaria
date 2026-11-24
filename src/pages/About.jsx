import { HeartHandshake, MapPin, ReceiptText } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import PageHero from '../components/decor/PageHero.jsx'
import Team from '../components/sections/Team.jsx'
import Stats from '../components/sections/Stats.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import Faq from '../components/sections/Faq.jsx'
import { story, values } from '../data/about.js'
import { bookPath } from '../data/navigation.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

const VALUE_ICONS = { claridad: ReceiptText, calma: HeartHandshake, cerca: MapPin }
const VALUE_TONES = { claridad: 'bg-leaf-soft', calma: 'bg-sky-soft', cerca: 'bg-sun-soft' }

// Nosotros: historia corta, compromisos, equipo, cifras, opiniones y preguntas frecuentes
// (con id "faq": /nosotros#faq lleva directo al acordeón).
export default function About() {
  usePageMeta({
    title: 'Nosotros',
    description:
      'Conoce a Valle Vet: clínica veterinaria de barrio con tienda propia en Av. Los Aromos. Nuestro equipo, cómo trabajamos y las preguntas más frecuentes.',
  })

  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Una clínica chica, con tiempo para tu mascota"
        lede="Somos un equipo pequeño de veterinarios en Av. Los Aromos. Atendemos perros y gatos, y tenemos en la tienda lo que indicamos en consulta."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]}
        tone="sun"
      >
        <Button to={bookPath} size="lg">
          Agendar consulta
        </Button>
        <Button to="#faq" variant="secondary" size="lg">
          Preguntas frecuentes
        </Button>
      </PageHero>

      {/* Historia y compromisos */}
      <section aria-labelledby="historia-title" className="band-white py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="text-[14px] font-medium text-brand">Nuestra historia</p>
            <h2 id="historia-title" className="mt-3 text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-ink sm:text-[38px]">
              {story.title}
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-[1.7] text-ink-soft">
              {story.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal as="ul" stagger={0.08} className="grid content-start gap-4" aria-label="Cómo trabajamos">
            {values.map((v) => (
              <li key={v.id} className="flex gap-4 rounded-card border border-line bg-page p-5 sm:p-6">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-ink ${VALUE_TONES[v.id] || 'bg-leaf-soft'}`} aria-hidden="true">
                  <Icon icon={VALUE_ICONS[v.id] || HeartHandshake} size={22} />
                </span>
                <div>
                  <h3 className="text-[18px] font-medium leading-6 text-ink">{v.title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-ink-soft">{v.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Bandas: hero sun → blanco → sky → blanco → sun → page */}
      <Team band="sky" />
      <Stats band="white" />
      <Testimonials band="sun" />
      <Faq id="faq" band="page" />
    </>
  )
}
