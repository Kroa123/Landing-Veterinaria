import { useId } from 'react'

// Ilustraciones de servicios dibujadas en código: luz mint de fondo, placa de vidrio,
// icono principal con volumen y destellos. Capas con clase para el hover de la tarjeta
// (styles.css): .art-back se desplaza, .art-main se eleva, .art-spark brilla.
// Decorativas: el nombre del servicio va en el texto de la tarjeta.

const MINT = '#6EE7B7'
const MINT_DEEP = '#34D399'
const ON = '#EEF5F0'
const SOFT = '#A7BBAF'

function Stethoscope({ g }) {
  return (
    <>
      <g className="art-back">
        <path d="M40 92 H70 L78 74 L90 108 L100 84 L108 92 H160" fill="none" stroke={MINT} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="art-main">
        <path d="M78 34 V58 a22 22 0 0 0 44 0 V34" fill="none" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <path d="M100 80 V92 a18 18 0 0 0 36 0 V86" fill="none" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <circle cx="78" cy="32" r="5" fill={ON} />
        <circle cx="122" cy="32" r="5" fill={ON} />
        <circle cx="136" cy="78" r="13" fill={`url(#${g}-fill)`} />
        <circle cx="136" cy="78" r="13" fill="none" stroke={ON} strokeOpacity="0.7" strokeWidth="2" />
        <circle cx="132" cy="74" r="4" fill="#FFFFFF" fillOpacity="0.55" />
      </g>
    </>
  )
}

function Syringe({ g }) {
  return (
    <>
      <g className="art-back">
        <path d="M58 98 c0 -10 10 -18 10 -18 s10 8 10 18 a10 10 0 0 1 -20 0z" fill={MINT} fillOpacity="0.25" />
      </g>
      <g className="art-main">
        <g transform="rotate(-38 100 70)">
        <rect x="62" y="60" width="66" height="20" rx="5" fill="rgb(234 242 236 / 0.12)" stroke={ON} strokeOpacity="0.75" strokeWidth="2" />
        <rect x="64" y="62" width="40" height="16" rx="3" fill={`url(#${g}-fill)`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={74 + i * 10} x2={74 + i * 10} y1="60" y2={i % 2 ? 66 : 69} stroke={ON} strokeOpacity="0.8" strokeWidth="1.5" />
        ))}
        <rect x="128" y="64" width="10" height="12" rx="2" fill={SOFT} />
        <line x1="138" y1="70" x2="160" y2="70" stroke={ON} strokeWidth="2" strokeLinecap="round" />
        <rect x="44" y="66" width="18" height="8" rx="2" fill={SOFT} />
        <rect x="38" y="58" width="6" height="24" rx="3" fill={ON} />
        </g>
      </g>
    </>
  )
}

function Shield({ g }) {
  return (
    <>
      <g className="art-back">
        <rect x="126" y="76" width="40" height="18" rx="9" transform="rotate(-30 146 85)" fill={MINT} fillOpacity="0.28" />
        <rect x="126" y="76" width="20" height="18" rx="9" transform="rotate(-30 146 85)" fill={ON} fillOpacity="0.5" />
      </g>
      <g className="art-main">
        <path d="M100 26 L134 38 V66 c0 22 -15 36 -34 44 c-19 -8 -34 -22 -34 -44 V38 z" fill={`url(#${g}-fill)`} fillOpacity="0.9" />
        <path d="M100 26 L134 38 V66 c0 22 -15 36 -34 44 c-19 -8 -34 -22 -34 -44 V38 z" fill="none" stroke={ON} strokeOpacity="0.75" strokeWidth="2" />
        <path d="M100 26 V110 c-19 -8 -34 -22 -34 -44 V38 z" fill="#FFFFFF" fillOpacity="0.14" />
        <path d="M86 68 l10 10 l20 -22" fill="none" stroke="#0A1611" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

function Heart({ g }) {
  return (
    <>
      <g className="art-back">
        <circle cx="100" cy="70" r="44" fill="none" stroke={MINT} strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 8" />
      </g>
      <g className="art-main">
        <path d="M100 108 C60 84 56 58 66 46 c10 -12 28 -10 34 4 c6 -14 24 -16 34 -4 c10 12 6 38 -34 62z" fill={`url(#${g}-fill)`} />
        <path d="M100 108 C60 84 56 58 66 46 c10 -12 28 -10 34 4 c6 -14 24 -16 34 -4 c10 12 6 38 -34 62z" fill="none" stroke={ON} strokeOpacity="0.7" strokeWidth="2" />
        <path d="M76 52 c4 -5 10 -6 14 -3" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 62 V86 M88 74 H112" stroke="#0A1611" strokeWidth="6" strokeLinecap="round" />
      </g>
    </>
  )
}

function Scissors({ g }) {
  return (
    <>
      <g className="art-back">
        <circle cx="146" cy="44" r="10" fill="none" stroke={ON} strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="160" cy="70" r="6" fill="none" stroke={ON} strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="56" cy="40" r="7" fill="none" stroke={ON} strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="142" cy="42" r="3" fill="#FFFFFF" fillOpacity="0.4" />
      </g>
      <g className="art-main">
        <path d="M84 30 L118 96" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <path d="M116 30 L82 96" stroke={`url(#${g}-metal)`} strokeWidth="6" strokeLinecap="round" />
        <circle cx="78" cy="104" r="12" fill="none" stroke={`url(#${g}-fill)`} strokeWidth="6" />
        <circle cx="122" cy="104" r="12" fill="none" stroke={`url(#${g}-fill)`} strokeWidth="6" />
        <circle cx="100" cy="62" r="4" fill="#0A1611" stroke={ON} strokeWidth="2" />
      </g>
    </>
  )
}

function Phone({ g }) {
  return (
    <>
      <g className="art-back">
        <path d="M128 40 a20 20 0 0 1 0 28" fill="none" stroke={MINT} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        <path d="M138 32 a32 32 0 0 1 0 44" fill="none" stroke={MINT} strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="art-main">
        <rect x="72" y="24" width="48" height="92" rx="10" fill="rgb(234 242 236 / 0.10)" stroke={ON} strokeOpacity="0.75" strokeWidth="2" />
        <rect x="78" y="34" width="36" height="66" rx="4" fill={`url(#${g}-fill)`} fillOpacity="0.85" />
        <path d="M80 70 H88 L92 60 L98 82 L103 66 L106 70 H112" fill="none" stroke="#0A1611" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="96" y="52" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fontWeight="600" fill="#0A1611">24h</text>
        <rect x="90" y="106" width="12" height="3" rx="1.5" fill={ON} fillOpacity="0.6" />
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

export default function ServiceArt({ id, className = '' }) {
  const g = `sa-${useId().replace(/:/g, '')}`
  const Art = ART[id] || Stethoscope
  return (
    <svg viewBox="0 0 200 140" className={`service-art ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${g}-glow`} cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor={MINT} stopOpacity="0.45" />
          <stop offset="0.55" stopColor={MINT_DEEP} stopOpacity="0.12" />
          <stop offset="1" stopColor={MINT_DEEP} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-fill`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#A7F3D0" />
          <stop offset="1" stopColor={MINT_DEEP} />
        </linearGradient>
        <linearGradient id={`${g}-metal`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C9D8CF" />
          <stop offset="1" stopColor="#7E968A" />
        </linearGradient>
        <linearGradient id={`${g}-tile`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#EEF5F0" stopOpacity="0.10" />
          <stop offset="1" stopColor="#EEF5F0" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`${g}-edge`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={MINT} stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#EEF5F0" stopOpacity="0.08" />
          <stop offset="1" stopColor={MINT} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <ellipse className="art-glow" cx="100" cy="74" rx="96" ry="66" fill={`url(#${g}-glow)`} />
      <rect className="art-tile" x="46" y="14" width="108" height="112" rx="26" fill={`url(#${g}-tile)`} stroke={`url(#${g}-edge)`} strokeWidth="1.5" />
      <Art g={g} />
      <g className="art-spark" fill="#FFFFFF">
        <path d="M160 22 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fillOpacity="0.85" />
        <circle cx="40" cy="110" r="2" fillOpacity="0.6" />
        <circle cx="170" cy="112" r="1.5" fillOpacity="0.5" />
      </g>
    </svg>
  )
}
