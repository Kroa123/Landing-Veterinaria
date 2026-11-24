import Hero from '../components/sections/Hero.jsx'
import InfoStrip from '../components/sections/InfoStrip.jsx'
import Shop from '../components/sections/Shop.jsx'
import Services from '../components/sections/Services.jsx'
import Stats from '../components/sections/Stats.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import CtaBand from '../components/sections/CtaBand.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'

// Inicio: hero con la chapita 3D, datos útiles, 4 destacados de la tienda, servicios
// destacados, cifras, opiniones y CTA final para agendar.
export default function Home() {
  // Sin title: usa el título base del sitio (site.seo.title)
  usePageMeta()

  return (
    <>
      {/* Bandas: hero sky → page → leaf (tienda) → page → blanco → sun → page + CTA brand
          (la única saturada de la página; el footer es claro) */}
      <Hero />
      <InfoStrip />
      <Shop featured limit={4} />
      <Services highlight id="servicios" band="page" />
      <Stats band="white" />
      <Testimonials band="sun" />
      <CtaBand />
    </>
  )
}
