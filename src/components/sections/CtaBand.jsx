import { CalendarDays, Phone } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import Reveal from '../motion/Reveal.jsx'
import { site } from '../../config/site.js'
import { bookPath } from '../../data/navigation.js'

// Banda final saturada (una por página como máximo): fondo brand con texto blanco y el CTA
// principal. Brillo suave del mismo verde y huellas claras en styles.css (.cta-band).
// title/lede/id adaptables por página. La página que la usa no lleva otra banda saturada
// (por eso el footer es claro).
export default function CtaBand({
  id = 'agendar-cta',
  title = '¿Le toca control o vacuna? Agenda en un minuto',
  lede = 'Elige el servicio y el día, y te confirmamos la hora por WhatsApp. Para una urgencia, llama directo.',
}) {
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} className="cta-band band-page py-16 lg:py-24">
      <Container>
        <Reveal className="band-brand relative overflow-hidden rounded-panel px-6 py-12 text-white shadow-lift sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-16">
          <div className="max-w-[40rem]">
            <h2 id={titleId} className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[38px]">
              {title}
            </h2>
            <p className="mt-4 text-[17px] leading-[1.6] text-white/90">{lede}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Button to={bookPath} variant="inverse" size="lg">
              <Icon icon={CalendarDays} />
              Agendar consulta
            </Button>
            <a
              href={site.phone.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-control border border-white/40 px-5 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            >
              <Icon icon={Phone} />
              <span className="font-mono tabular-nums">{site.phone.display}</span>
              <span className="sr-only"> (urgencias 24 h)</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
