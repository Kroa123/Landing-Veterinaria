import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Check, MessageCircle } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { services } from '../../data/services.js'
import { buildBookingMessage, buildWhatsAppUrl, openWhatsApp } from '../../lib/whatsapp.js'
import { formatDayLabel, parseISODate } from '../../lib/date.js'
import { getClinicNow, getHoursFor, isHoliday } from '../../lib/hours.js'

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
  'focus:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

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

// Formulario de reserva: valida en cliente (hora de Santiago, domingos y feriados cerrados)
// y arma el mensaje de WhatsApp (siempre con encodeURIComponent, en lib/whatsapp.js).
// prefill:    { service, notes } a precargar (la página Agendar lo arma desde la URL)
// prefillKey: texto que cambia cuando cambia la precarga (p. ej. la query string)
// onServiceChange(id): avisa el servicio elegido (la página Agendar muestra el aviso de urgencia)
export default function BookingForm({ prefill = null, prefillKey = '', onServiceChange, className = '' }) {
  // Solo para el atributo min del calendario; la validación usa la fecha del momento
  const [minDay] = useState(() => getClinicNow().iso)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sentUrl, setSentUrl] = useState('')
  const formRef = useRef(null)

  // Aplica una precarga { service, notes }: servicio válido y motivo sin pisar lo escrito
  function applyPrefill(detail) {
    const { service, notes } = detail || {}
    const validService = Boolean(service) && services.some((s) => s.id === service)
    const extraNote = typeof notes === 'string' ? notes.trim().slice(0, 300) : ''
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

  // Precarga desde la URL (/agendar?servicio=consulta, ?vet=paula): se aplica al montar y cada
  // vez que cambia la clave (ajuste de estado durante el render, sin efecto)
  const [appliedKey, setAppliedKey] = useState(null)
  if (prefillKey !== appliedKey) {
    setAppliedKey(prefillKey)
    applyPrefill(prefill)
  }

  // Avisa al padre cada vez que cambia el servicio (al elegirlo o por la precarga)
  useEffect(() => {
    onServiceChange?.(values.service)
  }, [values.service, onServiceChange])

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
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="reserva-title"
      className={`surface-card relative flex flex-col rounded-[28px] p-5 sm:p-8 lg:p-10 ${className}`}
    >
      <p className="eyebrow">Reserva en 1 minuto</p>
      <h2 id="reserva-title" className="mt-3 text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">
        Pide tu hora
      </h2>
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

      <Button type="submit" variant="primary" size="lg" className="mt-8 w-full self-start sm:w-auto">
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
              className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand-hover"
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
            <Icon icon={Check} size={16} className="mt-0.5 text-brand" />
            {t}
          </li>
        ))}
      </ul>
      </div>
    </form>
  )
}
