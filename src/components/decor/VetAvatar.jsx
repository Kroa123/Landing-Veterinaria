import { useId } from 'react'

// Retrato ilustrado sin fotos, tema día (v4): disco de color suave, anillo vivo, silueta
// tenue y las iniciales en ink (≥ 13:1 sobre cualquier disco soft).
// hue cambia el tono entre integrantes del equipo: 0 hoja, 1 cielo, 2 sol, 3 coral.
// Decorativo (el nombre va al lado).
const INK = '#13241C'
const HUES = [
  { ring: '#22C55E', ring2: '#0F7A47', disc: '#DCFCE7', body: '#22C55E' },
  { ring: '#38BDF8', ring2: '#22C55E', disc: '#E0F2FE', body: '#38BDF8' },
  { ring: '#FFD15C', ring2: '#FF6B4A', disc: '#FFF6D6', body: '#F5B544' },
  { ring: '#FF6B4A', ring2: '#FFD15C', disc: '#FFE7E0', body: '#FF6B4A' },
]

export default function VetAvatar({ initials, hue = 0, size = 112, className = '' }) {
  const g = `va-${useId().replace(/:/g, '')}`
  const c = HUES[hue % HUES.length]
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`vet-avatar ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${g}-ring`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={c.ring} />
          <stop offset="0.55" stopColor={c.ring2} stopOpacity="0.55" />
          <stop offset="1" stopColor={c.ring} />
        </linearGradient>
        <linearGradient id={`${g}-body`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c.body} stopOpacity="0.32" />
          <stop offset="1" stopColor={c.body} stopOpacity="0.08" />
        </linearGradient>
        <clipPath id={`${g}-clip`}>
          <circle cx="60" cy="60" r="50" />
        </clipPath>
      </defs>
      <circle className="vet-avatar-ring" cx="60" cy="60" r="57" fill="none" stroke={`url(#${g}-ring)`} strokeWidth="3" />
      <circle cx="60" cy="60" r="50" fill={c.disc} />
      <g clipPath={`url(#${g}-clip)`}>
        {/* Silueta: cabeza y hombros, muy suave */}
        <circle cx="60" cy="50" r="20" fill={`url(#${g}-body)`} />
        <path d="M20 118 c4 -26 20 -38 40 -38 s36 12 40 38z" fill={`url(#${g}-body)`} />
        <path d="M44 86 c4 12 10 18 16 18 s12 -6 16 -18" fill="none" stroke={INK} strokeOpacity="0.2" strokeWidth="2" />
      </g>
      <text
        x="60"
        y="67"
        textAnchor="middle"
        fontFamily="Figtree, ui-sans-serif, system-ui, sans-serif"
        fontSize="30"
        fontWeight="600"
        letterSpacing="-0.5"
        fill={INK}
      >
        {initials}
      </text>
      {/* Insignia: cruz veterinaria en brand con canto blanco */}
      <circle cx="96" cy="96" r="13" fill="#0F7A47" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M96 90 V102 M90 96 H102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
