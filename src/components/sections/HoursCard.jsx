import { Clock, Phone } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { site } from '../../config/site.js'
import { useOpenStatus } from '../../hooks/useOpenStatus.js'

// Horario con el día de hoy destacado (hora de Santiago)
export default function HoursCard({ headingAs: Heading = 'h2' }) {
  const status = useOpenStatus()
  // En feriado no se destaca ningún tramo: ese día está cerrado
  return (
    <div className="surface-card rounded-[28px] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <Heading className="flex items-center gap-2 text-[17px] font-medium text-ink">
          <Icon icon={Clock} className="text-brand" />
          Horario
        </Heading>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-page px-3 py-1 text-[12px] font-medium text-ink">
          <span className={`live-dot ${status.open ? 'is-open' : 'is-closed'}`} aria-hidden="true" />
          {status.label}
        </span>
      </div>
      <dl className="mt-5 space-y-1">
        {site.hours.map((h) => {
          const isToday = !status.holiday && h.days.includes(status.day)
          return (
            <div
              key={h.label}
              className={`flex items-baseline justify-between gap-4 rounded-[12px] px-3 py-2.5 ${
                isToday ? 'bg-leaf-soft ring-1 ring-brand/25' : ''
              }`}
            >
              <dt className={`text-[15px] ${isToday ? 'font-medium text-ink' : 'text-ink-soft'}`}>
                {h.label}
                {isToday ? <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Hoy</span> : null}
              </dt>
              <dd className={`font-mono text-[14px] tabular-nums ${isToday ? 'font-medium text-brand-hover' : 'text-ink'}`}>
                {h.open ? `${h.open}–${h.close}` : 'Cerrado'}
              </dd>
            </div>
          )
        })}
        <div className="flex items-baseline justify-between gap-4 px-3 py-2.5">
          <dt className="text-[15px] text-ink-soft">Urgencias</dt>
          <dd className="font-mono text-[14px] tabular-nums text-ink">24 h por teléfono</dd>
        </div>
      </dl>
      <Button href={site.phone.href} variant="secondary" className="mt-5 w-full">
        <Icon icon={Phone} />
        <span className="font-mono text-[14px] font-normal tabular-nums">{site.phone.display}</span>
      </Button>
    </div>
  )
}
