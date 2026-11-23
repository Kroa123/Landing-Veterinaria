// Datos de la clínica. Cambia aquí nombre, contacto, dirección y horario:
// todos los componentes leen desde este archivo. El <head> de index.html
// (título, descripción, Open Graph, canonical y JSON-LD) también se genera
// desde aquí al compilar, con el plugin de vite.config.js.

export const site = {
  name: 'Valle Vet',
  tagline: 'Clínica veterinaria y tienda',
  // Dominio público, sin barra final. Se usa para canonical, Open Graph y JSON-LD.
  // muestra: reemplazar con datos reales
  url: 'https://vallevet.cl',

  seo: {
    title: 'Valle Vet · Clínica veterinaria y tienda en Av. Los Aromos',
    description:
      'Consulta, vacunas, esterilización y urgencias para perros y gatos. Tienda de alimento y antiparasitarios con pedido por WhatsApp y despacho en el día dentro de la comuna.',
    ogTitle: 'Valle Vet · Clínica veterinaria y tienda',
    ogDescription:
      'Agenda consulta para tu perro o gato y pide su alimento por WhatsApp. Av. Los Aromos 1240, local 3.',
    // Imagen 1200x630 en public/
    ogImage: '/og.png',
    locale: 'es_CL',
    themeColor: '#0A1611',
    priceRange: '$$',
  },

  // muestra: reemplazar con datos reales
  phone: {
    display: '+56 9 1234 5678',
    href: 'tel:+56912345678',
  },
  // Número de WhatsApp solo con dígitos y código de país
  // muestra: reemplazar con datos reales
  whatsapp: '56912345678',

  // muestra: reemplazar con datos reales
  address: {
    street: 'Av. Los Aromos 1240, local 3',
    city: 'Santiago',
    country: 'CL',
    reference: 'Frente a la plaza, entre Las Acacias y El Roble',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Av. Los Aromos 1240, Santiago'),

  // days usa getDay(): 0 domingo, 1 lunes ... 6 sábado
  hours: [
    { label: 'Lunes a viernes', short: 'lun–vie', days: [1, 2, 3, 4, 5], open: '9:00', close: '20:00' },
    { label: 'Sábado', short: 'sáb', days: [6], open: '10:00', close: '14:00' },
    { label: 'Domingo y festivos', short: 'dom', days: [0], open: null, close: null },
  ],
  // Zona horaria de la clínica: el estado "abierto ahora" se calcula con esta hora
  timeZone: 'America/Santiago',
  // Feriados nacionales de fecha fija en Chile (la clínica cierra).
  // Incluye Virgen del Carmen (16 de julio). Los feriados móviles (Viernes Santo,
  // Sábado Santo, San Pedro y San Pablo, Encuentro de Dos Mundos, Iglesias
  // Evangélicas, Pueblos Indígenas) se agregan a mano cada año.
  holidays: [
    '2026-01-01', '2026-05-01', '2026-05-21', '2026-07-16', '2026-08-15', '2026-09-18',
    '2026-09-19', '2026-11-01', '2026-12-08', '2026-12-25',
    '2027-01-01', '2027-05-01', '2027-05-21', '2027-07-16', '2027-08-15', '2027-09-18',
    '2027-09-19', '2027-11-01', '2027-12-08', '2027-12-25',
  ],
  emergency: 'Urgencias por teléfono 24 h',

  delivery: 'Despacho en el día dentro de la comuna',
  pickup: 'Retiro en tienda sin costo',

  // muestra: reemplazar con datos reales
  socials: [
    { label: 'Instagram', handle: '@vallevet', href: 'https://www.instagram.com/vallevet' },
  ],

  nav: [
    { label: 'Tienda', href: '#tienda' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo agendar', href: '#como-agendar' },
    { label: 'Contacto', href: '#contacto' },
  ],
}
