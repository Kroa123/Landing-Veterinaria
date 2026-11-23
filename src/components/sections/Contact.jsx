import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowUpRight, Check, Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Reveal from '../motion/Reveal.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import { PREFILL_EVENT } from '../../lib/booking.js'
import { site } from '../../config/site.js'
import { services } from '../../data/services.js'
import { buildBookingMessage, buildWhatsAppUrl, openWhatsApp } from '../../lib/whatsapp.js'
import { formatDayLabel, parseISODate } from '../../lib/date.js'
import { getClinicNow, getHoursFor, isHoliday } from '../../lib/hours.js'
import { useOpenStatus } from '../../hooks/useOpenStatus.js'

const EMPTY = { name: '', phone: '', pet: '', service: '', day: '', notes: '' }
const FIELD_ORDER = ['name', 'phone', 'pet', 'service', 'day', 'notes']

// Reglas de validación en cliente. Devuelve un mensaje o cadena vacía.
// "Hoy" se calcula en cada validación para que no quede viejo si la página sigue abierta.
function validateField(field, value) {
  const v = value.trim()
  switch (field) {
    case 'name':
      if (!v) return 'Escribe tu nombre'
      if (v.length < 2) return 'El nombre es muy corto'
      if (v.length > 60) return 'Máximo 60 caracteres'
      return ''
    case 'phone': {
      if (!v) return 'Escribe un teléfono para confirmarte la hora'
      if (!/^[+\d\s()-]+$/.test(v)) return 'Usa solo números, espacios y el signo +'
      const digits = v.replace(/\D/g, '')
      if (digits.length < 8 || digits.length > 12) return 'Revisa el número, por ejemplo +56 9 1234 5678'
      return ''
    }
    case 'pet':
      if (!v) return 'Escribe el nombre de tu mascota'
      if (v.length > 60) return 'Máximo 60 caracteres'
      return ''
    case 'service':
      if (!services.some((s) => s.id === v)) return 'Elige un servicio'
      return ''
    case 'day': {
      if (!v) return 'Elige un día'
      const date = parseISODate(v)
      if (!date) return 'La fecha no es válida'
      // Hoy según la hora de Santiago; las fechas ISO se comparan como texto
      if (v < getClinicNow().iso) return 'Elige hoy o un día posterior'
      if (isHoliday(v)) return 'Ese día es feriado y estamos cerrados. Elige otro día'
      const hours = getHoursFor(date)
      if (!hours || !hours.open) return 'Ese día estamos cerrados. Elige de lunes a sábado'
      return ''
    }
    case 'notes':
      if (v.length > 300) return 'Máximo 300 caracteres'
      return ''
    default:
      return ''
  }
}

function validateAll(values) {
  const errors = {}
  for (const f of FIELD_ORDER) {
    const msg = validateField(f, values[f])
    if (msg) errors[f] = msg
  }
  return errors
}

// Campos con etiqueta flotante (styles.css: .float-field). La etiqueta sube al enfocar o al
// tener valor; en select y fecha queda siempre arriba (fixed).
const inputBase =
  'fx-input block min-h-14 w-full rounded-[14px] border bg-raised px-4 pb-2 pt-6 text-[16px] text-ink placeholder:text-muted ' +
  'focus:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine'

function Field({ id, label, hint, error, optional, fixed = false, children }) {
  return (
    <div>
      <div className={`float-field relative ${fixed ? 'float-field--fixed' : ''}`}>
        {children}
        <label htmlFor={id} className="float-label">
          {label}
          {optional ? <span className="text-[12px] font-normal text-muted">Opcional</span> : null}
        </label>
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] leading-5 text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-[13px] leading-5 text-negative">
          <Icon icon={AlertCircle} className="mt-px" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

function BookingForm() {
  // Solo para el atributo min del calendario; la validación usa la fecha del momento
  const [minDay] = useState(() => getClinicNow().iso)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sentUrl, setSentUrl] = useState('')
  const formRef = useRef(null)

  // Los CTA "Agendar" de Servicios y Equipo precargan el servicio o el motivo
  useEffect(() => {
    function onPrefill(e) {
      const { service, notes } = e.detail || {}
      const validService = Boolean(service) && services.some((s) => s.id === service)
      const extraNote = typeof notes === 'string' ? notes.trim() : ''
      if (!validService && !extraNote) return
      const touched = [...(validService ? ['service'] : []), ...(extraNote ? ['notes'] : [])]

      setValues((prev) => {
        const next = { ...prev }
        if (validService) next.service = service
        if (extraNote) {
          // El motivo que ya escribió la persona no se pisa: el texto nuevo se agrega
          // al final con " · " (el campo es de una sola línea, no admite saltos)
          const current = prev.notes.trim()
          const merged = !current ? extraNote : current.includes(extraNote) ? current : `${current} · ${extraNote}`
          next.notes = merged.slice(0, 300)
        }
        return next
      })
      // El enlace "si no se abrió" correspondía al mensaje anterior
      setSentUrl('')
      setErrors((prev) => {
        const next = { ...prev }
        for (const k of touched) delete next[k]
        return next
      })
    }
    window.addEventListener(PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill)
  }, [])

  function describedBy(field, hasHint) {
    if (errors[field]) return `f-${field}-error`
    return hasHint ? `f-${field}-hint` : undefined
  }

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Después del primer intento, el error se corrige mientras escribes
    if (submitted || errors[field]) {
      const msg = validateField(field, value)
      setErrors((prev) => {
        const next = { ...prev }
        if (msg) next[field] = msg
        else delete next[field]
        return next
      })
    }
  }

  function onBlur(field) {
    const value = values[field]
    if (!value.trim() && !submitted) return
    const msg = validateField(field, value)
    setErrors((prev) => {
      const next = { ...prev }
      if (msg) next[field] = msg
      else delete next[field]
      return next
    })
  }

  function onSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const found = validateAll(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((f) => found[f])
    if (firstInvalid) {
      formRef.current?.querySelector(`#f-${firstInvalid}`)?.focus()
      setSentUrl('')
      return
    }

    const service = services.find((s) => s.id === values.service)
    const message = buildBookingMessage({
      name: values.name.trim(),
      phone: values.phone.trim(),
      pet: values.pet.trim(),
      service: service ? service.name : values.service,
      day: formatDayLabel(parseISODate(values.day)),
      notes: values.notes.trim(),
    })
    const url = buildWhatsAppUrl(message)
    setSentUrl(url)
    openWhatsApp(url)
  }

  const border = (field) => (errors[field] ? 'border-negative' : 'border-line')

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="glass-panel relative flex flex-col rounded-[28px] border border-night-line p-5 sm:p-8 lg:p-10">
      <p className="eyebrow">Reserva en 1 minuto</p>
      <h3 className="mt-3 text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">Pide tu hora</h3>
      <p className="mt-1 text-[15px] leading-6 text-ink-soft">
        Al enviar se abre WhatsApp con tu mensaje listo. Te respondemos con la hora disponible.
      </p>

      {submitted && Object.keys(errors).length > 0 ? (
        <p role="alert" className="mt-5 rounded-[12px] border border-negative/40 bg-negative/10 px-4 py-3 text-[14px] text-ink">
          Revisa {Object.keys(errors).length === 1 ? 'el campo marcado' : 'los campos marcados'} para continuar.
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="f-name" label="Tu nombre" error={errors.name}>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder=" "
            maxLength={60}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={() => onBlur('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            className={`${inputBase} ${border('name')}`}
          />
        </Field>

        <Field id="f-phone" label="Teléfono" error={errors.phone}>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            maxLength={20}
            autoComplete="tel"
            placeholder="+56 9 1234 5678"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy('phone')}
            className={`${inputBase} ${border('phone')}`}
          />
        </Field>

        <Field id="f-pet" label="Nombre de tu mascota" error={errors.pet}>
          <input
            id="f-pet"
            name="pet"
            type="text"
            placeholder=" "
            maxLength={60}
            value={values.pet}
            onChange={(e) => update('pet', e.target.value)}
            onBlur={() => onBlur('pet')}
            aria-invalid={Boolean(errors.pet)}
            aria-describedby={describedBy('pet')}
            className={`${inputBase} ${border('pet')}`}
          />
        </Field>

        <Field id="f-service" label="Servicio" fixed error={errors.service}>
          <select
            id="f-service"
            name="service"
            value={values.service}
            onChange={(e) => update('service', e.target.value)}
            onBlur={() => onBlur('service')}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={describedBy('service')}
            className={`${inputBase} ${border('service')} ${values.service ? '' : 'text-muted'}`}
          >
            <option value="">Elige un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field id="f-day" label="Día preferido" hint="De lunes a sábado" fixed error={errors.day}>
          <input
            id="f-day"
            name="day"
            type="date"
            min={minDay}
            value={values.day}
            onChange={(e) => update('day', e.target.value)}
            onBlur={() => onBlur('day')}
            aria-invalid={Boolean(errors.day)}
            aria-describedby={describedBy('day', true)}
            className={`${inputBase} ${border('day')}`}
          />
        </Field>

        <Field id="f-notes" label="Motivo" optional error={errors.notes}>
          <input
            id="f-notes"
            name="notes"
            type="text"
            maxLength={300}
            placeholder="Ej.: control de vacunas"
            value={values.notes}
            onChange={(e) => update('notes', e.target.value)}
            onBlur={() => onBlur('notes')}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describedBy('notes')}
            className={`${inputBase} ${border('notes')}`}
          />
        </Field>
      </div>

      <Button type="submit" variant="night-primary" size="lg" className="mt-8 w-full self-start sm:w-auto">
        <Icon icon={MessageCircle} />
        Enviar por WhatsApp
      </Button>

      <div aria-live="polite">
        {sentUrl ? (
          <p className="mt-4 text-[14px] leading-5 text-ink-soft">
            Abrimos WhatsApp en otra pestaña. Si no se abrió,{' '}
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-pine underline underline-offset-4 transition-colors hover:text-pine-hover"
            >
              usa este enlace
            </a>
            .
          </p>
        ) : null}
      </div>

      <div className="mt-auto pt-10">
      <ul className="grid gap-3 border-t border-line pt-6 text-[14px] text-ink-soft sm:grid-cols-3" aria-label="Así funciona">
        {['Sin pago por adelantado', 'Respuesta en horario de atención', 'Confirmación por WhatsApp'].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <Icon icon={Check} size={16} className="mt-0.5 text-mint" />
            {t}
          </li>
        ))}
      </ul>
      </div>
    </form>
  )
}

// Mapa estático nocturno dibujado en código: manzanas, calles con brillo, la plaza
// y el pin de ubicación con pulso (styles.css: .map-pulse).
function StaticMap() {
  return (
    <svg viewBox="0 0 400 240" className="block h-auto w-full" role="img" aria-label={`Mapa: ${site.address.street}, ${site.address.reference}`}>
      <defs>
        <radialGradient id="map-glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#6EE7B7" stopOpacity="0.22" />
          <stop offset="1" stopColor="#6EE7B7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0C1B15" />
      {/* Manzanas */}
      {[
        [0, 0, 120, 92], [136, 0, 128, 92], [280, 0, 120, 92],
        [0, 128, 120, 112], [280, 128, 120, 112],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="8" fill="#13271E" stroke="rgba(234,242,236,0.06)" />
      ))}
      {/* Plaza */}
      <rect x="142" y="134" width="116" height="100" rx="8" fill="#163A2B" />
      <circle cx="200" cy="184" r="16" fill="none" stroke="rgba(110,231,183,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
      {/* Calles principales con brillo */}
      <path d="M0 110 H400" stroke="rgba(110,231,183,0.18)" strokeWidth="2" />
      <path d="M128 0 V240 M272 0 V240" stroke="rgba(234,242,236,0.08)" strokeWidth="2" />
      {/* Ruta sugerida hasta el local */}
      <path d="M0 110 H190 Q200 110 200 104" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      <rect width="400" height="240" fill="url(#map-glow)" />
      {/* Nombres de calles. muestra: reemplazar con datos reales (calles del local) */}
      <text x="16" y="126" fontFamily="Figtree, sans-serif" fontSize="11" fill="#A7BBAF">Av. Los Aromos</text>
      <text x="122" y="60" fontFamily="Figtree, sans-serif" fontSize="10" fill="#A7BBAF" transform="rotate(-90 122 60)" textAnchor="middle">Las Acacias</text>
      <text x="266" y="196" fontFamily="Figtree, sans-serif" fontSize="10" fill="#A7BBAF" transform="rotate(-90 266 196)" textAnchor="middle">El Roble</text>
      <text x="200" y="216" fontFamily="Figtree, sans-serif" fontSize="10" fill="#A7BBAF" textAnchor="middle">Plaza</text>
      {/* Ubicación con pulso */}
      <circle className="map-pulse" cx="200" cy="92" r="22" fill="rgba(110,231,183,0.25)" />
      <circle className="map-pulse map-pulse--late" cx="200" cy="92" r="22" fill="rgba(110,231,183,0.18)" />
      <path d="M200 106 c-10 -12 -15 -19 -15 -26 a15 15 0 0 1 30 0 c0 7 -5 14 -15 26z" fill="#6EE7B7" stroke="#0A1611" strokeWidth="2" />
      <circle cx="200" cy="80" r="5" fill="#0A1611" />
    </svg>
  )
}

// Horario con el día de hoy destacado (hora de Santiago)
function HoursCard() {
  const status = useOpenStatus()
  // En feriado no se destaca ningún tramo: ese día está cerrado
  return (
    <div className="glass-panel rounded-[28px] border border-night-line p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[17px] font-medium text-ink">
          <Icon icon={Clock} className="text-mint" />
          Horario
        </h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-night-line px-3 py-1 text-[12px] text-ink-soft">
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
                isToday ? 'bg-mint/10 ring-1 ring-mint/30' : ''
              }`}
            >
              <dt className={`text-[15px] ${isToday ? 'font-medium text-ink' : 'text-ink-soft'}`}>
                {h.label}
                {isToday ? <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-night">Hoy</span> : null}
              </dt>
              <dd className={`font-mono text-[14px] tabular-nums ${isToday ? 'text-mint' : 'text-ink'}`}>
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
      <Button href={site.phone.href} variant="night-secondary" className="mt-5 w-full">
        <Icon icon={Phone} />
        <span className="font-mono text-[14px] font-normal tabular-nums">{site.phone.display}</span>
      </Button>
    </div>
  )
}

// Contacto: el cierre de la página. Titular grande, formulario de vidrio, mapa nocturno y horario.
export default function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="theme-night relative isolate overflow-hidden pb-24 pt-28 lg:pb-32 lg:pt-36">
      <SectionBackdrop glows="d" pattern="contour" />
      <Container>
        <SplitHeading
          id="contacto-title"
          eyebrow="Agenda una consulta"
          size="xl"
          title={
            <>
              Agenda hoy. <span className="text-glow">Del resto nos encargamos.</span>
            </>
          }
          lede="Escríbenos tus datos y te confirmamos la hora por WhatsApp. Para una urgencia, llama directamente."
        />

        <Reveal stagger={0.1} className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <BookingForm />

          <aside aria-label="Dirección y horario" className="grid content-start gap-5">
            <div className="map-card fx-group overflow-hidden rounded-[28px] border border-night-line p-2">
              <div className="overflow-hidden rounded-[22px]">
                <StaticMap />
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-4 pt-5">
                <div className="min-w-0">
                  <p className="flex gap-2 text-[16px] font-medium leading-6 text-ink">
                    <Icon icon={MapPin} className="fx-icon mt-0.5 text-mint" />
                    {site.address.street}
                  </p>
                  <p className="ml-[26px] mt-1 text-[14px] leading-5 text-ink-soft">{site.address.reference}</p>
                </div>
                <Button href={site.mapsUrl} external variant="night-primary">
                  <Icon icon={Navigation} />
                  Cómo llegar
                  <Icon icon={ArrowUpRight} />
                  <span className="sr-only">{' '}(se abre Google Maps en otra pestaña)</span>
                </Button>
              </div>
            </div>
            <HoursCard />
          </aside>
        </Reveal>
      </Container>
    </section>
  )
}
