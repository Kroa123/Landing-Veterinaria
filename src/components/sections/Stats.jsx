import Container from '../ui/Container.jsx'
import Reveal from '../motion/Reveal.jsx'
import Counter from '../decor/Counter.jsx'
import Stars from '../decor/Stars.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import GoogleMark from '../decor/GoogleMark.jsx'
import { rating, stats } from '../../data/stats.js'

// Banda de confianza: contadores grandes que cuentan al entrar y la nota en Google.
export default function Stats() {
  return (
    <section aria-labelledby="stats-title" className="theme-night relative isolate overflow-hidden py-16 lg:py-24">
      <SectionBackdrop glows="b" pattern="dots" band />
      <Container>
        <h2 id="stats-title" className="sr-only">
          Valle Vet en números
        </h2>
        <Reveal
          as="ul"
          stagger={0.08}
          className="stats-grid grid grid-cols-2 overflow-hidden rounded-[28px] border border-night-line lg:grid-cols-4"
        >
          {stats.map((s) => (
            <li key={s.id} className="stat-cell relative flex min-w-0 flex-col justify-between gap-6 p-4 sm:p-8">
              <div>
                <p className="stat-number font-medium leading-none tracking-[-0.04em] text-on-night">
                  <Counter value={s.value} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </p>
                <p className="mt-3 text-[15px] font-medium leading-5 text-on-night sm:text-[16px]">{s.label}</p>
              </div>
              {s.stars ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Stars value={rating.value} size={16} label={`${String(rating.value).replace('.', ',')} de 5 estrellas`} />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-night-line bg-on-night/[0.04] px-2 py-1 text-[12px] text-on-night-soft">
                    <GoogleMark size={13} />
                    {s.detail}
                  </span>
                </div>
              ) : (
                <p className="text-[13px] leading-5 text-on-night-soft sm:text-[14px]">{s.detail}</p>
              )}
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
