import { formatPrice } from '../../lib/formatPrice.js'

// Firma de Valle Vet: el precio va en una chapita de collar (disco con argolla).
// Solo se usa para precios de productos y en el logo.
// className se aplica al envoltorio exterior, así se puede posicionar (absolute, rotate).

const sizes = {
  sm: { w: 80, text: 'text-[13px]' },
  md: { w: 96, text: 'text-[15px]' },
}

export default function PriceTag({ price, size = 'md', className = '' }) {
  const s = sizes[size] || sizes.md
  const h = Math.round(s.w * 1.16)
  return (
    <span className={`inline-block shrink-0 ${className}`} style={{ width: s.w, height: h }}>
      <span className="relative block" style={{ width: s.w, height: h }}>
        <svg
          viewBox="0 0 84 98"
          width={s.w}
          height={h}
          className="absolute inset-0 overflow-visible drop-shadow-[0_3px_4px_rgb(22_32_27/0.10)]"
          aria-hidden="true"
          focusable="false"
        >
          {/* Argolla */}
          <circle cx="42" cy="9" r="7" fill="none" stroke="#5C665F" strokeWidth="2.25" />
          {/* Disco */}
          <circle cx="42" cy="56" r="38" fill="#FFFFFF" stroke="rgba(22,32,27,0.16)" strokeWidth="1" />
          {/* Canto estampado */}
          <circle cx="42" cy="56" r="33" fill="none" stroke="rgba(22,32,27,0.10)" strokeWidth="1" />
          {/* Agujero */}
          <circle cx="42" cy="25" r="3.5" fill="#ECEFEA" stroke="rgba(22,32,27,0.16)" strokeWidth="1" />
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
