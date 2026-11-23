import { useId } from 'react'

const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

// Fila de 5 estrellas con relleno parcial (4,9 = cuatro llenas y casi la quinta).
// label: texto para lectores de pantalla; sin label es decorativa.
export default function Stars({ value = 5, size = 16, label, className = '' }) {
  const id = useId().replace(/:/g, '')
  // Cada estrella ocupa x 2,5–21,5 de su celda de 26: el recorte cubre las estrellas
  // completas y la fracción de la siguiente medida sobre su ancho visible (19)
  const v = Math.max(0, Math.min(5, value))
  const full = Math.floor(v)
  const clipWidth = full * 26 + (v - full) * 19 + 2.5
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  return (
    <svg
      width={Math.round((size * 128) / 24)}
      height={size}
      viewBox="0 0 128 24"
      className={`shrink-0 ${className}`}
      focusable="false"
      {...a11y}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x="0" y="0" width={clipWidth} height="24" />
        </clipPath>
        <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F5B544" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={`b${i}`} d={STAR} transform={`translate(${i * 26} 0)`} fill="rgb(234 242 236 / 0.16)" />
      ))}
      <g clipPath={`url(#clip-${id})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={`f${i}`} d={STAR} transform={`translate(${i * 26} 0)`} fill={`url(#grad-${id})`} />
        ))}
      </g>
    </svg>
  )
}
