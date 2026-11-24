import { useRef } from 'react'
import { useInView } from '../../hooks/useInView.js'

/**
 * Fondo vivo del tema día (v4): formas orgánicas de color suave que derivan despacio.
 * Solo CSS (transform/opacity), sin canvas ni blur. Estilos en motion.css (.day-backdrop).
 * Fuera de pantalla se pausa; con prefers-reduced-motion queda estático.
 * La sección padre debe ser `relative isolate` (las clases .hero-* ya lo son).
 *
 * @param {object}  props
 * @param {'fresh'|'warm'|'calm'} [props.mood='fresh'] fresh = hoja + cielo + sol + coral;
 *   warm = sol + coral delante; calm = solo hoja y cielo.
 * @param {'none'|'dots'|'paws'} [props.pattern='none'] patrón fino encima de las formas.
 * @param {boolean} [props.fadeBottom=false] funde el borde inferior hacia el color page.
 * @param {string}  [props.className]
 */
export default function DayBackdrop({ mood = 'fresh', pattern = 'none', fadeBottom = false, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const moodClass = mood === 'warm' ? 'day-backdrop--warm' : mood === 'calm' ? 'day-backdrop--calm' : ''
  return (
    <div
      ref={ref}
      className={`day-backdrop ${moodClass} ${inView ? '' : 'is-paused'} ${className}`}
      aria-hidden="true"
    >
      <div className="day-shape day-shape--a" />
      <div className="day-shape day-shape--b" />
      <div className="day-shape day-shape--c" />
      <div className="day-shape day-shape--d" />
      {pattern === 'dots' ? <div className="pattern-dots" style={{ zIndex: 0 }} /> : null}
      {pattern === 'paws' ? <div className="pattern-paws" style={{ zIndex: 0 }} /> : null}
      {fadeBottom ? <div className="day-fade-bottom" /> : null}
    </div>
  )
}
