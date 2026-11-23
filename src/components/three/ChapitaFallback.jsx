import { useId } from 'react'

// Chapita V estática en SVG: mismo dibujo que LogoMark, con luz de material
// (degradado dentro del mismo tono) y argolla metálica. Sin animación.
// Se usa sin WebGL, con prefers-reduced-motion y mientras carga la escena 3D.
export default function ChapitaFallback({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const face = `chapita-face-${uid}`
  const edge = `chapita-edge-${uid}`
  const ring = `chapita-ring-${uid}`

  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className="h-auto w-[min(62%,300px)] lg:w-[min(52%,320px)] drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={face} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2C7A5A" />
            <stop offset="0.55" stopColor="#1E5B43" />
            <stop offset="1" stopColor="#164534" />
          </linearGradient>
          <linearGradient id={edge} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2F5F3" />
            <stop offset="0.5" stopColor="#A9B3AE" />
            <stop offset="1" stopColor="#E3E8E5" />
          </linearGradient>
          <linearGradient id={ring} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E9EEEB" />
            <stop offset="1" stopColor="#8E9893" />
          </linearGradient>
        </defs>
        {/* Argolla */}
        <ellipse cx="100" cy="40" rx="15" ry="27" fill="none" stroke={`url(#${ring})`} strokeWidth="6" />
        {/* Canto plateado */}
        <circle cx="100" cy="140" r="90" fill={`url(#${edge})`} />
        {/* Cara verde pino */}
        <circle cx="100" cy="140" r="82" fill={`url(#${face})`} />
        {/* Agujero */}
        <circle cx="100" cy="72" r="11" fill="#0A1611" stroke={`url(#${edge})`} strokeWidth="3" />
        {/* V */}
        <path
          d="M65 116 100 182l35-66"
          fill="none"
          stroke="#F4F7F5"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
