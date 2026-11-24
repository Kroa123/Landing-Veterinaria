import { site } from '../../config/site.js'

// Marca: V dentro de una chapita redonda con el agujero arriba.
// tone="brand" (por defecto): chapita verde brand con V blanca (5.4:1).
// tone="leaf": chapita verde vivo con V ink (7.1:1), para fondos blancos grandes o el 404.
const TONES = {
  brand: { disc: '#0F7A47', rim: '#22C55E', v: '#FFFFFF' },
  leaf: { disc: '#22C55E', rim: '#0F7A47', v: '#13241C' },
}

export function LogoMark({ size = 32, tone = 'brand', className = '' }) {
  const t = TONES[tone] || TONES.brand
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="17.5" r="14" fill={t.disc} />
      {/* Canto estampado: aro fino del otro verde */}
      <circle cx="16" cy="17.5" r="12.4" fill="none" stroke={t.rim} strokeOpacity="0.55" strokeWidth="0.9" />
      <circle cx="16" cy="7" r="2" fill="#F7FAF6" />
      <path
        d="M10.5 13.5 16 24l5.5-10.5"
        fill="none"
        stroke={t.v}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo({ tone = 'brand', className = '' }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 ${className}`}>
      <LogoMark tone={tone} />
      <span className="whitespace-nowrap text-[17px] font-semibold leading-none text-ink">{site.name}</span>
    </span>
  )
}
