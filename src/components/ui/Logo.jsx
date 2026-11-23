import { site } from '../../config/site.js'

// Marca: V dentro de una chapita redonda con el agujero arriba.
export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="17.5" r="14" fill="#1E5B43" />
      <circle cx="16" cy="7" r="2" fill="#F6F7F4" />
      <path
        d="M10.5 13.5 16 24l5.5-10.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="whitespace-nowrap text-[17px] font-semibold leading-none text-ink">{site.name}</span>
    </span>
  )
}
