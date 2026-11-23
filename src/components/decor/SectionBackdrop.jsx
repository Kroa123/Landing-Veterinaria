// Fondo decorativo de las secciones noche: glows de aurora, patrón fino y grano.
// La sección padre debe ser `relative isolate`. Todo es estático (sin animación):
// barato en móvil y sin trabajo fuera de pantalla.
//
// glows:   'a' | 'b' | 'c' | 'd' | 'e'  (posición y tono de las luces)
// pattern: 'grid' | 'contour' | 'dots' | 'none'
// band:    true pinta una franja night-raised con bordes difuminados (sin cortes duros)
export default function SectionBackdrop({ glows = 'a', pattern = 'grid', band = false, className = '' }) {
  return (
    <div className={`section-backdrop ${className}`} aria-hidden="true">
      {band ? <div className="sb-band" /> : null}
      <div className={`sb-glows sb-glows--${glows}`} />
      {pattern !== 'none' ? <div className={`sb-pattern sb-pattern--${pattern}`} /> : null}
      <div className="sb-grain" />
    </div>
  )
}
