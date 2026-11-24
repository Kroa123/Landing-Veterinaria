import { useId } from 'react'

// Ilustraciones de servicios dibujadas en código, tema día (v4): disco de color suave de
// fondo, placa blanca, icono con relleno vivo (leaf / sky / sun / coral) y trazo ink, y
// destellos sun. Capas con clase para el hover de la tarjeta (styles.css): .art-back se
// desplaza, .art-main se eleva, .art-glow crece, .art-spark brilla.
// Decorativas: el nombre del servicio va en el texto de la tarjeta.
// tone (opcional) fuerza el color; si no, cada servicio tiene el suyo.

const INK = '#13241C'
const WHITE = '#FFFFFF'

const TONES = {
  leaf: { main: '#22C55E', soft: '#DCFCE7', light: '#86EFAC' },
  sky: { main: '#38BDF8', soft: '#E0F2FE', light: '#BAE6FD' },
  sun: { main: '#FFD15C', soft: '#FFF6D6', light: '#FFE7A3' },
  coral: { main: '#FF6B4A', soft: '#FFE7E0', light: '#FFB4A2' },
}

const SERVICE_TONE = {
  consulta: 'sky',
  vacunas: 'leaf',
  desparasitacion: 'sun',
  esterilizacion: 'coral',
  peluqueria: 'sky',
  urgencia: 'coral',
}

function Stethoscope({ g, t }) {
  return (
    <>
      <g className="art-back">
        <path d="M40 92 H70 L78 74 L90 108 L100 84 L108 92 H160" fill="none" stroke={t.main} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="art-main">
        <path d="M78 34 V58 a22 22 0 0 0 44 0 V34" fill="none" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <path d="M100 80 V92 a18 18 0 0 0 36 0 V86" fill="none" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <circle cx="78" cy="32" r="5" fill={INK} />
        <circle cx="122" cy="32" r="5" fill={INK} />
        <circle cx="136" cy="78" r="13" fill={`url(#${g}-fill)`} />
        <circle cx="136" cy="78" r="13" fill="none" stroke={INK} strokeOpacity="0.85" strokeWidth="2" />
        <circle cx="132" cy="74" r="4" fill={WHITE} fillOpacity="0.7" />
      </g>
    </>
  )
}

function Syringe({ g, t }) {
  return (
    <>
      <g className="art-back">
        <path d="M58 98 c0 -10 10 -18 10 -18 s10 8 10 18 a10 10 0 0 1 -20 0z" fill={t.main} fillOpacity="0.45" />
      </g>
      <g className="art-main">
        <g transform="rotate(-38 100 70)">
          <rect x="62" y="60" width="66" height="20" rx="5" fill={WHITE} stroke={INK} strokeOpacity="0.85" strokeWidth="2" />
          <rect x="64" y="62" width="40" height="16" rx="3" fill={`url(#${g}-fill)`} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={74 + i * 10} x2={74 + i * 10} y1="60" y2={i % 2 ? 66 : 69} stroke={INK} strokeOpacity="0.8" strokeWidth="1.5" />
          ))}
          <rect x="128" y="64" width="10" height="12" rx="2" fill="#5B6A61" />
          <line x1="138" y1="70" x2="160" y2="70" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <rect x="44" y="66" width="18" height="8" rx="2" fill="#5B6A61" />
          <rect x="38" y="58" width="6" height="24" rx="3" fill={INK} />
        </g>
      </g>
    </>
  )
}

function Shield({ g }) {
  return (
    <>
      <g className="art-back">
        <rect x="126" y="76" width="40" height="18" rx="9" transform="rotate(-30 146 85)" fill={TONES.coral.main} fillOpacity="0.75" />
        <rect x="126" y="76" width="20" height="18" rx="9" transform="rotate(-30 146 85)" fill={WHITE} stroke={INK} strokeOpacity="0.25" />
      </g>
      <g className="art-main">
        <path d="M100 26 L134 38 V66 c0 22 -15 36 -34 44 c-19 -8 -34 -22 -34 -44 V38 z" fill={`url(#${g}-fill)`} />
        <path d="M100 26 L134 38 V66 c0 22 -15 36 -34 44 c-19 -8 -34 -22 -34 -44 V38 z" fill="none" stroke={INK} strokeOpacity="0.85" strokeWidth="2" />
        <path d="M100 26 V110 c-19 -8 -34 -22 -34 -44 V38 z" fill={WHITE} fillOpacity="0.28" />
        <path d="M86 68 l10 10 l20 -22" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

function Heart({ g, t }) {
  return (
    <>
      <g className="art-back">
        <circle cx="100" cy="70" r="44" fill="none" stroke={t.main} strokeOpacity="0.7" strokeWidth="2" strokeDasharray="4 8" />
      </g>
      <g className="art-main">
        <path d="M100 108 C60 84 56 58 66 46 c10 -12 28 -10 34 4 c6 -14 24 -16 34 -4 c10 12 6 38 -34 62z" fill={`url(#${g}-fill)`} />
        <path d="M100 108 C60 84 56 58 66 46 c10 -12 28 -10 34 4 c6 -14 24 -16 34 -4 c10 12 6 38 -34 62z" fill="none" stroke={INK} strokeOpacity="0.85" strokeWidth="2" />
        <path d="M76 52 c4 -5 10 -6 14 -3" fill="none" stroke={WHITE} strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 62 V86 M88 74 H112" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
    </>
  )
}

function Scissors({ g, t }) {
  return (
    <>
      <g className="art-back">
        <circle cx="146" cy="44" r="10" fill={t.soft} stroke={t.main} strokeWidth="1.5" />
        <circle cx="160" cy="70" r="6" fill={t.soft} stroke={t.main} strokeWidth="1.5" />
        <circle cx="56" cy="40" r="7" fill={t.soft} stroke={t.main} strokeWidth="1.5" />
        <circle cx="142" cy="42" r="3" fill={WHITE} />
      </g>
      <g className="art-main">
        <path d="M84 30 L118 96" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <path d="M116 30 L82 96" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <circle cx="78" cy="104" r="12" fill="none" stroke={`url(#${g}-fill)`} strokeWidth="6" />
        <circle cx="122" cy="104" r="12" fill="none" stroke={`url(#${g}-fill)`} strokeWidth="6" />
        <circle cx="100" cy="62" r="4" fill={WHITE} stroke={INK} strokeWidth="2" />
      </g>
    </>
  )
}

function Phone({ g, t }) {
  return (
    <>
      <g className="art-back">
        <path d="M128 40 a20 20 0 0 1 0 28" fill="none" stroke={t.main} strokeWidth="3" strokeLinecap="round" />
        <path d="M138 32 a32 32 0 0 1 0 44" fill="none" stroke={t.main} strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="art-main">
        <rect x="72" y="24" width="48" height="92" rx="10" fill={WHITE} stroke={INK} strokeOpacity="0.85" strokeWidth="2" />
        <rect x="78" y="34" width="36" height="66" rx="4" fill={`url(#${g}-fill)`} />
        <path d="M80 70 H88 L92 60 L98 82 L103 66 L106 70 H112" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="96" y="52" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fontWeight="600" fill={INK}>24h</text>
        <rect x="90" y="106" width="12" height="3" rx="1.5" fill={INK} fillOpacity="0.5" />
      </g>
    </>
  )
}

const ART = {
  consulta: Stethoscope,
  vacunas: Syringe,
  desparasitacion: Shield,
  esterilizacion: Heart,
  peluqueria: Scissors,
  urgencia: Phone,
}

export default function ServiceArt({ id, tone, className = '' }) {
  const g = `sa-${useId().replace(/:/g, '')}`
  const Art = ART[id] || Stethoscope
  const t = TONES[tone] || TONES[SERVICE_TONE[id]] || TONES.leaf
  return (
    <svg viewBox="0 0 200 140" className={`service-art ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${g}-fill`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={t.light} />
          <stop offset="1" stopColor={t.main} />
        </linearGradient>
        <linearGradient id={`${g}-metal`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8A9A91" />
          <stop offset="0.5" stopColor="#44544B" />
          <stop offset="1" stopColor={INK} />
        </linearGradient>
      </defs>
      {/* Disco de color suave detrás (no glow): crece al hover */}
      <ellipse className="art-glow" cx="100" cy="74" rx="84" ry="58" fill={t.soft} />
      <rect className="art-tile" x="46" y="14" width="108" height="112" rx="26" fill={WHITE} stroke={INK} strokeOpacity="0.1" strokeWidth="1.5" />
      <Art g={g} t={t} />
      <g className="art-spark">
        <path d="M160 22 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#FFD15C" stroke="#B7791F" strokeOpacity="0.5" strokeWidth="0.75" />
        <circle cx="40" cy="110" r="2.5" fill={t.main} />
        <circle cx="170" cy="112" r="2" fill="#FFD15C" />
      </g>
    </svg>
  )
}
