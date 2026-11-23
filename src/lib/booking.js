import { buildWhatsAppUrl } from './whatsapp.js'
import { site } from '../config/site.js'

// Puente entre los CTA "Agendar" de las secciones y el formulario de Contacto.
// El formulario escucha este evento y precarga el servicio o el motivo.
export const PREFILL_EVENT = 'booking:prefill'

export function prefillBooking(detail) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail }))
}

// Enlace de WhatsApp para dudas generales (sin pedido ni reserva)
export const questionUrl = buildWhatsAppUrl(`Hola ${site.name}, tengo una consulta.`)
