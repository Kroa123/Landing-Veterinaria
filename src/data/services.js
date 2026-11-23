// Servicios de la clínica con precio "desde" en pesos.
// tag (opcional): etiqueta destacada en la tarjeta. featured: tarjeta grande en escritorio.
// La ilustración de cada servicio vive en components/decor/ServiceArt.jsx (por id).

export const services = [
  {
    id: 'consulta',
    name: 'Consulta general',
    description: 'Examen físico completo, control de peso y plan de vacunas al día.',
    priceFrom: 18000,
    duration: '30 min',
    tag: 'Más pedido',
    featured: true,
  },
  {
    id: 'vacunas',
    name: 'Vacunación',
    description: 'Óctuple, antirrábica y triple felina, con registro en el carnet.',
    priceFrom: 12000,
    unit: 'por dosis',
    duration: '15 min',
  },
  {
    id: 'desparasitacion',
    name: 'Desparasitación con control',
    description: 'Dosis según peso y calendario para el resto del año.',
    priceFrom: 8000,
    duration: '15 min',
  },
  {
    id: 'esterilizacion',
    name: 'Esterilización',
    description: 'Incluye exámenes previos y control a los 10 días.',
    priceFrom: 65000,
    duration: 'Medio día',
  },
  {
    id: 'peluqueria',
    name: 'Baño y peluquería',
    description: 'Baño con shampoo según piel, corte de uñas y limpieza de oídos.',
    priceFrom: 15000,
    duration: '1 h 30 min',
  },
  {
    id: 'urgencia',
    name: 'Urgencias',
    description: 'Orientación telefónica 24 h y atención en clínica dentro del horario.',
    priceFrom: 30000,
    duration: 'Sin hora',
    tag: '24 h por teléfono',
    urgent: true,
  },
]
