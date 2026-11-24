import { buildWhatsAppUrl } from './whatsapp.js'
import { site } from '../config/site.js'

// Los CTA "Agendar" enlazan a /agendar?servicio=<id> o ?vet=<id> (data/navigation.js);
// la página Agendar precarga el formulario desde la URL.

// Enlace de WhatsApp para dudas generales (sin pedido ni reserva)
export const questionUrl = buildWhatsAppUrl(`Hola ${site.name}, tengo una consulta.`)
