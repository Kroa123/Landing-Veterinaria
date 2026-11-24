import { useId } from 'react'

// Empaque dibujado en código. El color sólido depende de la categoría,
// la forma depende de product.pack. Es "material": solo vive dentro de la tarjeta.
// La luz viene de arriba a la izquierda: cara frontal con un leve degradé del
// mismo tono, lateral más oscuro, sombra de apoyo neutra.

const PACK_COLORS = {
  alimento: '#C9D8C5',
  antiparasitarios: '#D6DCE8',
  higiene: '#E8DED0',
  accesorios: '#DCD6E4',
}

// Tinta de cada categoría para la franja de la etiqueta (mismo tono, más oscuro)
const PACK_INK = {
  alimento: '#5E7A5A',
  antiparasitarios: '#5B6A8A',
  higiene: '#8A7458',
  accesorios: '#6E6386',
}

const INK = '#16201B'
const INK_SOFT = '#4A5550'
const SHADE = 'rgba(22,32,27,0.08)'
const SHADE_STRONG = 'rgba(22,32,27,0.16)'
const FONT = 'Figtree, ui-sans-serif, system-ui, sans-serif'
const MONO = '"IBM Plex Mono", ui-monospace, monospace'

// "15 kg" → ["15", "kg"], "3 comprimidos" → ["3", "comprimidos"]
function splitSize(size) {
  const i = size.indexOf(' ')
  return i === -1 ? [size, ''] : [size.slice(0, i), size.slice(i + 1)]
}

function Label({ x, y, w, h, product, band }) {
  const cx = x + w / 2
  const [qty, unit] = splitSize(product.size)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#FFFFFF" />
      <rect x={x} y={y} width={w} height={h} rx="5" fill="none" stroke={SHADE} />
      <text x={cx} y={y + 15} textAnchor="middle" fontFamily={FONT} fontSize={product.brand.length > 11 ? 9 : 10} fontWeight="600" fill={INK}>
        {product.brand}
      </text>
      <rect x={x + 8} y={y + 21} width={w - 16} height="3" rx="1.5" fill={band} />
      <text x={cx} y={y + h - 18} textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight="600" fill={INK} letterSpacing="-0.4">
        {qty}
      </text>
      <text x={cx} y={y + h - 6} textAnchor="middle" fontFamily={MONO} fontSize="9" fill={INK_SOFT}>
        {unit}
      </text>
    </g>
  )
}

function Bag({ color, band, product, light }) {
  return (
    <g>
      {/* Cuerpo */}
      <path d="M72 42 H168 L172 170 Q172 176 166 176 H74 Q68 176 68 170 Z" fill={color} />
      <path d="M72 42 H168 L172 170 Q172 176 166 176 H74 Q68 176 68 170 Z" fill={`url(#${light})`} />
      {/* Fuelle lateral */}
      <path d="M150 42 H168 L172 170 Q172 176 166 176 H154 Z" fill={SHADE} />
      <path d="M150 42 L154 176" stroke={SHADE_STRONG} strokeWidth="0.75" />
      {/* Pliegue del fondo */}
      <path d="M70 160 Q110 166 152 160" fill="none" stroke={SHADE} strokeWidth="1.5" />
      {/* Cierre sellado */}
      <rect x="70" y="30" width="100" height="14" rx="2" fill={color} />
      <rect x="70" y="30" width="100" height="14" rx="2" fill={SHADE_STRONG} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line key={i} x1={78 + i * 11} x2={78 + i * 11} y1="33" y2="41" stroke={SHADE_STRONG} />
      ))}
      <Label x={74} y={72} w={72} h={72} product={product} band={band} />
    </g>
  )
}

function Box({ color, band, product, light }) {
  return (
    <g>
      {/* Tapa */}
      <path d="M66 74 L82 58 H170 L154 74 Z" fill={color} />
      <path d="M66 74 L82 58 H170 L154 74 Z" fill="rgba(255,255,255,0.45)" />
      {/* Lateral */}
      <path d="M154 74 L170 58 V158 L154 174 Z" fill={color} />
      <path d="M154 74 L170 58 V158 L154 174 Z" fill={SHADE_STRONG} />
      {/* Frente */}
      <rect x="66" y="74" width="88" height="100" fill={color} />
      <rect x="66" y="74" width="88" height="100" fill={`url(#${light})`} />
      <rect x="66" y="74" width="88" height="3" fill="rgba(255,255,255,0.5)" />
      <rect x="66" y="162" width="88" height="12" fill={band} opacity="0.85" />
      <Label x={73} y={84} w={74} h={72} product={product} band={band} />
    </g>
  )
}

function Bottle({ color, band, product, light }) {
  return (
    <g>
      {/* Tapa dosificadora */}
      <rect x="106" y="34" width="28" height="20" rx="4" fill={INK_SOFT} />
      <rect x="108" y="36" width="6" height="16" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="110" y="54" width="20" height="10" fill={color} />
      <rect x="110" y="54" width="20" height="10" fill={SHADE_STRONG} />
      {/* Cuerpo */}
      <rect x="86" y="62" width="68" height="114" rx="16" fill={color} />
      <rect x="86" y="62" width="68" height="114" rx="16" fill={`url(#${light})`} />
      <rect x="140" y="72" width="8" height="94" rx="4" fill={SHADE} />
      <rect x="92" y="72" width="6" height="94" rx="3" fill="rgba(255,255,255,0.4)" />
      <Label x={91} y={90} w={58} h={70} product={product} band={band} />
    </g>
  )
}

function Hanger({ color, band, product }) {
  const [qty, unit] = splitSize(product.size)
  return (
    <g>
      {/* Cartón colgador con perforación */}
      <rect x="82" y="28" width="76" height="62" rx="6" fill="#FFFFFF" />
      <rect x="82" y="28" width="76" height="62" rx="6" fill="none" stroke={SHADE} />
      <rect x="110" y="35" width="20" height="8" rx="4" fill="#ECEFEA" stroke={SHADE_STRONG} />
      <text x="120" y="57" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fontWeight="600" fill={INK}>
        {product.brand}
      </text>
      <rect x="92" y="62" width="56" height="3" rx="1.5" fill={band} />
      <text x="120" y="83" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="600" fill={INK}>
        {qty}
        <tspan fontFamily={MONO} fontSize="9" fontWeight="400" fill={INK_SOFT}> {unit}</tspan>
      </text>
      {/* Correa enrollada */}
      <ellipse cx="120" cy="140" rx="42" ry="30" fill="none" stroke={color} strokeWidth="12" />
      <ellipse cx="120" cy="140" rx="42" ry="30" fill="none" stroke={SHADE_STRONG} strokeWidth="12" strokeDasharray="6 10" />
      <ellipse cx="120" cy="143" rx="28" ry="19" fill="none" stroke={color} strokeWidth="10" />
      <ellipse cx="120" cy="143" rx="28" ry="19" fill="none" stroke={SHADE} strokeWidth="10" />
      {/* Mosquetón */}
      <rect x="113" y="92" width="14" height="20" rx="7" fill="none" stroke="#8A938E" strokeWidth="3" />
    </g>
  )
}

const SHAPES = { bag: Bag, box: Box, bottle: Bottle, hanger: Hanger }

// Sombra de apoyo neutra con tinte verde (todas las superficies son claras)
const GROUND = ['rgba(22,32,27,0.12)', 'rgba(22,32,27,0.10)']

// Clases .pack-body y .pack-shadow: el cuerpo se eleva y la sombra se achica al pasar el cursor
// por una tarjeta .tilt-card (ver styles.css).
export default function ProductPackage({ product, className = '' }) {
  const ground = GROUND
  const light = `luz-${useId().replace(/:/g, '')}`
  const color = PACK_COLORS[product.category] || PACK_COLORS.alimento
  const band = PACK_INK[product.category] || PACK_INK.alimento
  const Shape = SHAPES[product.pack] || Bag
  return (
    <svg viewBox="48 22 144 166" className={className} role="img" aria-label={`Empaque de ${product.name}, ${product.size}`}>
      <defs>
        {/* Luz lateral: brillo a la izquierda, sombra suave a la derecha */}
        <linearGradient id={light} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#16201B" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {/* Sombra de apoyo, neutra */}
      <g className="pack-shadow">
        <ellipse cx="120" cy="180" rx="60" ry="6" fill={ground[0]} />
        <ellipse cx="120" cy="179" rx="44" ry="3" fill={ground[1]} />
      </g>
      <g className="pack-body">
        <Shape color={color} band={band} product={product} light={light} />
      </g>
    </svg>
  )
}
