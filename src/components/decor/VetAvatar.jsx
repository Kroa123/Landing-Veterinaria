import { useId } from 'react'

// Retrato ilustrado sin fotos: anillo con degradado, silueta suave y las iniciales.
// hue cambia el tono del anillo entre integrantes del equipo. Decorativo (el nombre va al lado).
const HUES = [
  ['#6EE7B7', '#2DD4BF'],
  ['#A7F3D0', '#34D399'],
  ['#99F6E4', '#6EE7B7'],
]

export default function VetAvatar({ initials, hue = 0, size = 112, className = '' }) {
  const g = `va-${useId().replace(/:/g, '')}`
  const [c1, c2] = HUES[hue % HUES.length]
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`vet-avatar ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${g}-ring`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.55" stopColor={c2} stopOpacity="0.35" />
          <stop offset="1" stopColor={c1} />
        </linearGradient>
        <radialGradient id={`${g}-disc`} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#1C3A2D" />
          <stop offset="1" stopColor="#0C1A14" />
        </radialGradient>
        <linearGradient id={`${g}-body`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c1} stopOpacity="0.32" />
          <stop offset="1" stopColor={c1} stopOpacity="0.04" />
        </linearGradient>
        <clipPath id={`${g}-clip`}>
          <circle cx="60" cy="60" r="50" />
        </clipPath>
      </defs>
      <circle className="vet-avatar-ring" cx="60" cy="60" r="57" fill="none" stroke={`url(#${g}-ring)`} strokeWidth="3" />
      <circle cx="60" cy="60" r="50" fill={`url(#${g}-disc)`} />
      <g clipPath={`url(#${g}-clip)`}>
        {/* Silueta: cabeza y hombros, muy suave */}
        <circle cx="60" cy="50" r="20" fill={`url(#${g}-body)`} />
        <path d="M20 118 c4 -26 20 -38 40 -38 s36 12 40 38z" fill={`url(#${g}-body)`} />
        <path d="M44 86 c4 12 10 18 16 18 s12 -6 16 -18" fill="none" stroke={c1} strokeOpacity="0.35" strokeWidth="2" />
      </g>
      <text
        x="60"
        y="67"
        textAnchor="middle"
        fontFamily="Figtree, ui-sans-serif, system-ui, sans-serif"
        fontSize="30"
        fontWeight="600"
        letterSpacing="-0.5"
        fill="#EEF5F0"
      >
        {initials}
      </text>
      {/* Insignia: cruz veterinaria */}
      <circle cx="96" cy="96" r="13" fill={c1} stroke="#0A1611" strokeWidth="3" />
      <path d="M96 90 V102 M90 96 H102" stroke="#0A1611" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
