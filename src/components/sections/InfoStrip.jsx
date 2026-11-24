import { Clock, Phone, Store, Truck } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Reveal from '../motion/Reveal.jsx'
import { site } from '../../config/site.js'
import { useOpenStatus } from '../../hooks/useOpenStatus.js'

// Franja de datos útiles bajo el hero: barra blanca translúcida que flota sobre el borde
// inferior del hero (margen negativo) y une el hero con la tienda.
// El primer dato es el estado en vivo del local, con un punto que late solo si está abierto.
export default function InfoStrip() {
  // Estado del local con la hora de Santiago; se actualiza cada minuto
  const status = useOpenStatus()

  const items = [
    {
      icon: Clock,
      title: status.label,
      live: true,
      text: [status.detail, ...site.hours.filter((h) => h.open).map((h) => `${h.short} ${h.open}–${h.close}`)],
      mono: true,
    },
    {
      icon: Phone,
      title: 'Urgencias 24 h',
      text: site.phone.display,
      href: site.phone.href,
      mono: true,
    },
    { icon: Truck, title: 'Despacho en el día', text: 'Dentro de la comuna, pedido por WhatsApp' },
    { icon: Store, title: 'Retiro en tienda', text: 'Sin costo, te avisamos cuando esté listo' },
  ]

  return (
    <section aria-label="Datos útiles" className="band-page relative z-10 pb-6">
      <Container>
        <Reveal
          as="ul"
          stagger={0.07}
          y={16}
          start="top bottom"
          className="info-float info-bar relative -mt-10 grid grid-cols-1 divide-y divide-line rounded-[24px] border border-line p-2 sm:-mt-12 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4"
        >
          {items.map((it) => {
            const Wrap = it.href ? 'a' : 'div'
            return (
              <li key={it.title} className="p-1">
                <Wrap
                  {...(it.href ? { href: it.href } : {})}
                  className={`info-item flex h-full gap-3 rounded-[16px] px-3 py-3 sm:py-4 ${
                    it.href ? 'fx-group group transition-colors hover:bg-raised' : ''
                  }`}
                >
                  <span className="info-icon relative flex size-10 shrink-0 items-center justify-center rounded-[12px]" aria-hidden="true">
                    <Icon icon={it.icon} className="fx-icon" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[15px] font-semibold leading-5 text-ink">
                      {it.live ? (
                        <span className={`live-dot ${status.open ? 'is-open' : 'is-closed'}`} aria-hidden="true" />
                      ) : null}
                      {it.title}
                    </p>
                    <p
                      className={`mt-1 leading-5 text-ink-soft ${
                        it.mono ? 'font-mono text-[13px] tabular-nums' : 'text-[14px]'
                      } ${it.href ? 'underline decoration-line-strong underline-offset-4 group-hover:text-brand-hover' : ''}`}
                    >
                      {Array.isArray(it.text)
                        ? it.text.map((line, i) => (
                            <span key={line} className={`block ${i === 0 && it.live ? 'text-ink' : ''}`}>
                              {line}
                            </span>
                          ))
                        : it.text}
                    </p>
                  </div>
                </Wrap>
              </li>
            )
          })}
        </Reveal>
      </Container>
    </section>
  )
}
