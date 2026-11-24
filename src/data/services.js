// Servicios de la clínica con precio "desde" en pesos.
// muestra: reemplazar con datos reales (precios, duraciones y qué incluye)
//
// tag (opcional): etiqueta destacada en la tarjeta. featured: tarjeta grande en escritorio.
// highlight: aparece en "Servicios destacados" de Inicio.
// detail: párrafo largo para la página de Servicios. includes: qué incluye.
// urgent: no se agenda por formulario, se llama por teléfono.
// La ilustración de cada servicio vive en components/decor/ServiceArt.jsx (por id).

export const services = [
  {
    id: 'consulta',
    name: 'Consulta general',
    description: 'Examen físico completo, control de peso y plan de vacunas al día.',
    detail:
      'Revisamos a tu mascota de la nariz a la cola: corazón, piel, oídos, dientes y peso. Si algo no está bien, te explicamos qué hacer y cuánto cuesta antes de seguir.',
    includes: ['Examen físico completo', 'Control de peso', 'Revisión del carnet de vacunas', 'Indicaciones por escrito'],
    priceFrom: 18000,
    duration: '30 min',
    tag: 'Más pedido',
    featured: true,
    highlight: true,
  },
  {
    id: 'vacunas',
    name: 'Vacunación',
    description: 'Óctuple, antirrábica y triple felina, con registro en el carnet.',
    detail:
      'Aplicamos las vacunas según la edad y el estilo de vida de tu mascota, y te dejamos anotada la fecha del próximo refuerzo.',
    includes: ['Revisión previa', 'Vacuna aplicada', 'Registro en el carnet', 'Recordatorio del próximo refuerzo'],
    priceFrom: 12000,
    unit: 'por dosis',
    duration: '15 min',
    highlight: true,
  },
  {
    id: 'desparasitacion',
    name: 'Desparasitación con control',
    description: 'Dosis según peso y calendario para el resto del año.',
    detail:
      'Pesamos a tu mascota, elegimos el antiparasitario adecuado y te entregamos el calendario de dosis internas y externas para el año.',
    includes: ['Pesaje', 'Dosis según peso', 'Calendario anual', 'Registro en el carnet'],
    priceFrom: 8000,
    duration: '15 min',
  },
  {
    id: 'esterilizacion',
    name: 'Esterilización',
    description: 'Incluye exámenes previos y control a los 10 días.',
    detail:
      'Cirugía programada con anestesia monitoreada. Tu mascota llega en ayunas en la mañana y se va a casa la misma tarde, con indicaciones claras para la recuperación.',
    includes: ['Exámenes previos', 'Anestesia monitoreada', 'Cirugía', 'Control a los 10 días'],
    priceFrom: 65000,
    duration: 'Medio día',
    highlight: true,
  },
  {
    id: 'peluqueria',
    name: 'Baño y peluquería',
    description: 'Baño con shampoo según piel, corte de uñas y limpieza de oídos.',
    detail:
      'Baño con productos según el tipo de piel, secado, corte de uñas y limpieza de oídos. Si vemos algo raro en la piel, te avisamos.',
    includes: ['Baño con shampoo según piel', 'Secado y cepillado', 'Corte de uñas', 'Limpieza de oídos'],
    priceFrom: 15000,
    duration: '1 h 30 min',
  },
  {
    id: 'urgencia',
    name: 'Urgencias',
    description: 'Orientación telefónica 24 h y atención en clínica dentro del horario.',
    detail:
      'Llámanos a cualquier hora. Te decimos si puede esperar a la mañana, si conviene venir de inmediato o si es mejor ir a un centro de turno.',
    includes: ['Orientación telefónica 24 h', 'Atención prioritaria en horario', 'Derivación si hace falta'],
    priceFrom: 30000,
    duration: 'Sin hora',
    tag: '24 h por teléfono',
    urgent: true,
  },
]

export function getService(id) {
  return services.find((s) => s.id === id)
}
