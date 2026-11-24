import Container from '../ui/Container.jsx'
import Reveal from '../motion/Reveal.jsx'
import Counter from '../decor/Counter.jsx'
import Stars from '../decor/Stars.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import GoogleMark from '../decor/GoogleMark.jsx'
import { rating, stats } from '../../data/stats.js'

// Banda de confianza: contadores grandes que cuentan al entrar y la nota en Google.
// band: fondo de la sección (clase .band-*); white por defecto.
// Cada cifra lleva una barra de color propia (leaf, sky, sun, coral) para dar ritmo.
const ACCENTS = ['bg-leaf', 'bg-sky', 'bg-sun', 'bg-coral']

export default function Stats({ band = 'white' }) {
  return (
    <section aria-labelledby="stats-title" className={`band-${band} relative isolate overflow-hidden py-16 lg:py-24`}>
      <SectionBackdrop glows="b" pattern="dots" />
      <Container>
        <h2 id="stats-title" className="sr-only">
          Valle Vet en números
        </h2>
        <Reveal
          as="ul"
          stagger={0.08}
          className="stats-grid grid grid-cols-2 overflow-hidden rounded-[28px] border border-line lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <li key={s.id} className="stat-cell relative flex min-w-0 flex-col justify-between gap-6 p-4 sm:p-8">
              <span className={`absolute inset-x-4 top-0 h-1 rounded-b-full sm:inset-x-8 ${ACCENTS[i % ACCENTS.length]}`} aria-hidden="true" />
              <div>
                <p className="stat-number font-medium leading-none tracking-[-0.04em] text-ink">
                  <Counter value={s.value} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </p>
                <p className="mt-3 text-[15px] font-medium leading-5 text-ink sm:text-[16px]">{s.label}</p>
              </div>
              {s.stars ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Stars value={rating.value} size={16} label={`${String(rating.value).replace('.', ',')} de 5 estrellas`} />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2 py-1 text-[12px] text-ink-soft">
                    <GoogleMark size={13} />
                    {s.detail}
                  </span>
                </div>
              ) : (
                <p className="text-[13px] leading-5 text-ink-soft sm:text-[14px]">{s.detail}</p>
              )}
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
