// Navegación del sitio (rutas de react-router). La usan Header, Footer y el menú móvil.
// end: true marca el enlace activo solo en la ruta exacta (Inicio).

export const mainNav = [
  { label: 'Inicio', to: '/', end: true },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
]

// Mapa del sitio del footer: las mismas rutas más Agendar y anclas útiles
export const footerNav = [
  ...mainNav,
  { label: 'Agendar consulta', to: '/agendar' },
  { label: 'Preguntas frecuentes', to: '/nosotros#faq' },
]

export const bookPath = '/agendar'

// Enlace a /agendar con un servicio precargado
export function bookServicePath(serviceId) {
  return `${bookPath}?servicio=${encodeURIComponent(serviceId)}`
}

// Enlace a /agendar con el veterinario preferido precargado en el motivo
export function bookVetPath(vetId) {
  return `${bookPath}?vet=${encodeURIComponent(vetId)}`
}

export function productPath(product) {
  return `/tienda/${product.slug}`
}
