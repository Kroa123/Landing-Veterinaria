import { site } from '../config/site.js'
import { toISODate } from './date.js'

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
// Abreviaturas de es-CL sin tildes ni punto: "lun", "mar", "mie", "jue", "vie", "sab", "dom"
const WEEKDAY_INDEX = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 }

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Tramo de horario de un día de la semana (0 domingo ... 6 sábado)
export function getHoursForDay(day) {
  return site.hours.find((h) => h.days.includes(day)) || null
}

// Tramo de horario de una fecha local
export function getHoursFor(date) {
  return getHoursForDay(date.getDay())
}

export function isHoliday(isoDate) {
  return site.holidays.includes(isoDate)
}

// Día, minutos y fecha ISO "ahora" en la zona horaria de la clínica,
// sin depender de la zona del dispositivo de quien visita.
export function getClinicNow(now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('es-CL', {
      timeZone: site.timeZone,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now)
    const get = (type) => parts.find((p) => p.type === type)?.value || ''
    const weekday = get('weekday')
      .normalize('NFD')
      .replace(/[\u0300-\u036f.]/g, '')
      .toLowerCase()
      .slice(0, 3)
    const day = WEEKDAY_INDEX[weekday]
    if (day === undefined) throw new Error('Día no reconocido')
    return {
      day,
      minutes: Number(get('hour')) * 60 + Number(get('minute')),
      iso: `${get('year')}-${get('month')}-${get('day')}`,
    }
  } catch {
    // Sin soporte de zonas horarias: usa la hora del dispositivo
    return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes(), iso: toISODate(now) }
  }
}

// Suma días a una fecha ISO sin problemas de horario de verano
function addDaysISO(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + n))
  return date.toISOString().slice(0, 10)
}

// Estado del local: "Abierto ahora · cierra 20:00" o "Cerrado ahora · abre mañana 9:00"
export function getOpenStatus(now = new Date()) {
  const { day, minutes, iso } = getClinicNow(now)
  const today = isHoliday(iso) ? null : getHoursForDay(day)

  if (today?.open && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, label: 'Abierto ahora', detail: `cierra ${today.close}` }
  }

  if (today?.open && minutes < toMinutes(today.open)) {
    return { open: false, label: 'Cerrado ahora', detail: `abre hoy ${today.open}` }
  }

  // Busca el próximo día con atención (máximo una semana más un feriado)
  for (let i = 1; i <= 8; i++) {
    const nextIso = addDaysISO(iso, i)
    const nextDay = (day + i) % 7
    const h = getHoursForDay(nextDay)
    if (!h?.open || isHoliday(nextIso)) continue
    const when = i === 1 ? 'mañana' : `el ${DAY_NAMES[nextDay]}`
    return { open: false, label: 'Cerrado ahora', detail: `abre ${when} ${h.open}` }
  }

  return { open: false, label: 'Cerrado ahora', detail: 'urgencias por teléfono' }
}
