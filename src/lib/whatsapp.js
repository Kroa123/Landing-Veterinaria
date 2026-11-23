import { site } from '../config/site.js'
import { formatPrice } from './formatPrice.js'

// Arma un enlace wa.me con el mensaje siempre codificado.
export function buildWhatsAppUrl(message, phone = site.whatsapp) {
  const digits = String(phone).replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

// Mensaje de pedido a partir de las líneas del carrito.
export function buildOrderMessage(lines, subtotal, delivery) {
  const rows = lines.map(
    ({ product, qty }) =>
      `- ${qty} x ${product.name} ${product.size} (${formatPrice(product.price * qty)})`,
  )
  const deliveryText = delivery === 'retiro' ? 'Retiro en tienda' : 'Despacho a domicilio'
  return [
    `Hola ${site.name}, quiero hacer este pedido:`,
    '',
    ...rows,
    '',
    `Total productos: ${formatPrice(subtotal)}`,
    `Entrega: ${deliveryText}`,
    '',
    '¿Me confirman el total y la hora de entrega?',
  ].join('\n')
}

// Mensaje de reserva a partir del formulario de contacto.
export function buildBookingMessage({ name, phone, pet, service, day, notes }) {
  const rows = [
    `Hola ${site.name}, quiero agendar una hora.`,
    '',
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Mascota: ${pet}`,
    `Servicio: ${service}`,
    `Día preferido: ${day}`,
  ]
  if (notes) rows.push(`Comentario: ${notes}`)
  return rows.join('\n')
}

// Abre WhatsApp en otra pestaña sin dar acceso a window.opener.
export function openWhatsApp(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
