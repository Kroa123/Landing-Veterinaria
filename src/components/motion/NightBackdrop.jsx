import { useRef } from 'react'
import { useInView } from '../../hooks/useInView.js'

// Fondo vivo de las secciones oscuras (hero y tienda): aurora verde suave + grano.
// Solo CSS (transform/opacity), sin canvas. La sección padre debe ser `relative isolate`.
// Fuera de pantalla la aurora se pausa (animation-play-state).
// fadeBottom / fadeTop apagan la aurora hacia noche plana en ese borde (sin costuras).
export default function NightBackdrop({ fadeBottom = false, fadeTop = false, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} className={`night-backdrop ${inView ? '' : 'is-paused'} ${className}`} aria-hidden="true">
      <div className="aurora-blob aurora-blob--c" />
      <div className="aurora-blob aurora-blob--a" />
      <div className="aurora-blob aurora-blob--b" />
      <div className="night-grain" />
      {fadeTop ? <div className="night-fade-top" /> : null}
      {fadeBottom ? <div className="night-fade-bottom" /> : null}
    </div>
  )
}
