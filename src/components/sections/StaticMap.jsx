import { site } from '../../config/site.js'

// Mapa estático claro dibujado en código (colores por token con utilidades fill-/stroke-):
// calles blancas, manzanas raised, la plaza en leaf-soft, la avenida resaltada en sun,
// la ruta sugerida en brand y el pin coral con pulso (styles.css: .map-pulse).
// Nombres de calles en muted (≥ 5:1 sobre blanco y raised).
export default function StaticMap() {
  return (
    <svg viewBox="0 0 400 240" className="block h-auto w-full" role="img" aria-label={`Mapa: ${site.address.street}, ${site.address.reference}`}>
      {/* Calles (fondo) */}
      <rect width="400" height="240" className="fill-card" />
      {/* Manzanas */}
      {[
        [0, 0, 120, 92], [136, 0, 128, 92], [280, 0, 120, 92],
        [0, 128, 120, 112], [280, 128, 120, 112],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="8" className="fill-raised stroke-line" />
      ))}
      {/* Plaza */}
      <rect x="142" y="134" width="116" height="100" rx="8" className="fill-leaf-soft" />
      <circle cx="200" cy="184" r="16" fill="none" className="stroke-leaf" strokeWidth="1.5" strokeDasharray="3 5" />
      {/* Avenida principal resaltada */}
      <path d="M0 110 H400" className="stroke-sun" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <path d="M128 0 V240 M272 0 V240" className="stroke-line-strong" strokeWidth="2" />
      {/* Ruta sugerida hasta el local */}
      <path d="M0 110 H190 Q200 110 200 104" fill="none" className="stroke-brand" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      {/* Nombres de calles. muestra: reemplazar con datos reales (calles del local) */}
      <text x="16" y="128" fontFamily="Figtree, sans-serif" fontSize="11" fontWeight="600" className="fill-ink-soft">Av. Los Aromos</text>
      <text x="122" y="60" fontFamily="Figtree, sans-serif" fontSize="10" className="fill-muted" transform="rotate(-90 122 60)" textAnchor="middle">Las Acacias</text>
      <text x="266" y="196" fontFamily="Figtree, sans-serif" fontSize="10" className="fill-muted" transform="rotate(-90 266 196)" textAnchor="middle">El Roble</text>
      <text x="200" y="216" fontFamily="Figtree, sans-serif" fontSize="10" className="fill-brand-hover" textAnchor="middle">Plaza</text>
      {/* Ubicación con pulso */}
      <circle className="map-pulse fill-coral/30" cx="200" cy="92" r="22" />
      <circle className="map-pulse map-pulse--late fill-coral/20" cx="200" cy="92" r="22" />
      <path d="M200 106 c-10 -12 -15 -19 -15 -26 a15 15 0 0 1 30 0 c0 7 -5 14 -15 26z" className="fill-coral stroke-card" strokeWidth="2" />
      <circle cx="200" cy="80" r="5" className="fill-card" />
    </svg>
  )
}
