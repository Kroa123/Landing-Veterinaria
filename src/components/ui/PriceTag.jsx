import { formatPrice } from '../../lib/formatPrice.js'

// Firma de Valle Vet: el precio va en una chapita de collar (disco con argolla).
// Solo se usa para precios de productos y en el logo.
// className se aplica al envoltorio exterior, así se puede posicionar (absolute, rotate).
// tone: 'white' (por defecto) | 'sun' (oferta / destacado) | 'leaf'. El precio siempre en
// ink: 16:1 sobre blanco, 11:1 sobre sun, 14:1 sobre leaf-soft.

const sizes = {
  sm: { w: 80, text: 'text-[13px]' },
  md: { w: 96, text: 'text-[15px]' },
}

const TONES = {
  white: { disc: '#FFFFFF', edge: 'rgba(19,36,28,0.16)', stamp: 'rgba(19,36,28,0.10)' },
  sun: { disc: '#FFD15C', edge: 'rgba(19,36,28,0.22)', stamp: 'rgba(19,36,28,0.14)' },
  leaf: { disc: '#DCFCE7', edge: 'rgba(15,122,71,0.30)', stamp: 'rgba(15,122,71,0.18)' },
}

export default function PriceTag({ price, size = 'md', tone = 'white', className = '' }) {
  const s = sizes[size] || sizes.md
  const t = TONES[tone] || TONES.white
  const h = Math.round(s.w * 1.16)
  return (
    <span className={`inline-block shrink-0 ${className}`} style={{ width: s.w, height: h }}>
      <span className="relative block" style={{ width: s.w, height: h }}>
        <svg
          viewBox="0 0 84 98"
          width={s.w}
          height={h}
          className="absolute inset-0 overflow-visible drop-shadow-tag"
          aria-hidden="true"
          focusable="false"
        >
          {/* Argolla */}
          <circle cx="42" cy="9" r="7" fill="none" stroke="#5B6A61" strokeWidth="2.25" />
          {/* Disco */}
          <circle cx="42" cy="56" r="38" fill={t.disc} stroke={t.edge} strokeWidth="1" />
          {/* Canto estampado */}
          <circle cx="42" cy="56" r="33" fill="none" stroke={t.stamp} strokeWidth="1" />
          {/* Agujero */}
          <circle cx="42" cy="25" r="3.5" fill="#EEF4EF" stroke="rgba(19,36,28,0.16)" strokeWidth="1" />
        </svg>
        <span
          className={`absolute inset-x-0 flex justify-center font-mono font-medium tabular-nums text-ink ${s.text}`}
          style={{ top: '57%', transform: 'translateY(-50%)' }}
        >
          {formatPrice(price)}
        </span>
      </span>
    </span>
  )
}
