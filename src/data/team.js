// Equipo veterinario. Sin fotos: el avatar ilustrado usa las iniciales (components/decor/VetAvatar.jsx).
// id: se usa en /agendar?vet=<id> para precargar el motivo.
// shortName: cómo se nombra en los botones ("Agendar con Paula").
// muestra: reemplazar con datos reales (nombres, iniciales, turnos, especialidades y años)

export const team = [
  {
    // muestra: reemplazar con datos reales
    id: 'paula',
    name: 'Dra. Paula Rojas',
    shortName: 'Paula',
    initials: 'PR',
    role: 'Medicina general y vacunas',
    schedule: 'lun–jue · 9:00–15:00',
    tags: ['Vacunas', 'Cachorros', 'Control anual'],
    years: 10,
  },
  {
    // muestra: reemplazar con datos reales
    id: 'tomas',
    name: 'Dr. Tomás Fuentes',
    shortName: 'Tomás',
    initials: 'TF',
    role: 'Cirugía y esterilizaciones',
    schedule: 'lun–jue · 14:00–20:00',
    tags: ['Cirugía', 'Esterilización', 'Traumatología'],
    years: 12,
  },
  {
    // muestra: reemplazar con datos reales
    id: 'camila',
    name: 'Dra. Camila Soto',
    shortName: 'Camila',
    initials: 'CS',
    role: 'Medicina felina y dermatología',
    schedule: 'vie · 9:00–20:00, sáb · 10:00–14:00',
    tags: ['Gatos', 'Piel y alergias', 'Geriatría'],
    years: 7,
  },
]

export function getVet(id) {
  return team.find((v) => v.id === id)
}
