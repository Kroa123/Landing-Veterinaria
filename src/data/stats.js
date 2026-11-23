// Cifras de confianza para la banda de estadísticas y las opiniones.
// muestra: reemplazar con datos reales (todas las cifras de este archivo)

import { site } from '../config/site.js'

export const rating = {
  // muestra: reemplazar con datos reales
  value: 4.9,
  count: 312,
  source: 'Google',
}

// value: número final del contador; prefix/suffix se muestran alrededor.
// decimals: cantidad de decimales del contador (coma decimal es-CL).
export const stats = [
  // muestra: reemplazar con datos reales
  {
    id: 'rating',
    value: rating.value,
    decimals: 1,
    suffix: '',
    label: `en ${rating.source}`,
    detail: `${rating.count} opiniones`,
    stars: true,
  },
  // muestra: reemplazar con datos reales
  { id: 'pacientes', value: 2400, prefix: '+', label: 'pacientes atendidos', detail: 'perros y gatos del barrio' },
  // muestra: reemplazar con datos reales
  { id: 'anos', value: 8, suffix: ' años', label: `en ${site.address.street.split(',')[0]}`, detail: 'el mismo equipo, la misma esquina' },
  // muestra: reemplazar con datos reales
  { id: 'despacho', value: 24, suffix: ' h', label: 'urgencias por teléfono', detail: 'te orientamos a cualquier hora' },
]
