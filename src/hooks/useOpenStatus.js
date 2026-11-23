import { useEffect, useState } from 'react'
import { getClinicNow, getOpenStatus, isHoliday } from '../lib/hours.js'

function read() {
  const now = getClinicNow()
  return {
    ...getOpenStatus(),
    // Día de la semana en Santiago (0 domingo) y si hoy es feriado
    day: now.day,
    holiday: isHoliday(now.iso),
  }
}

// Estado del local ("Abierto ahora · cierra 20:00") con la hora de la clínica.
// Se recalcula cada minuto. Lo comparten InfoStrip y el horario de Contacto.
export function useOpenStatus() {
  const [status, setStatus] = useState(read)

  useEffect(() => {
    const id = window.setInterval(() => setStatus(read()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
