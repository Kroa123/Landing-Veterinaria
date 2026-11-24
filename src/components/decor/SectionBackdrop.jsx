/**
 * Fondo decorativo de sección: banda de color, lavados suaves, patrón fino.
 * La sección padre debe ser `relative isolate`. Todo es estático (sin animación):
 * barato en móvil y sin trabajo fuera de pantalla.
 *
 * Lavados pastel entre tonos soft vecinos y patrones en ink muy tenue (sin grano ni glows).
 *
 * @param {object} props
 * @param {'page'|'white'|'raised'|'leaf'|'sky'|'sun'|'coral'|'brand'} [props.tone]
 *   pinta la banda de color de la sección (misma paleta que las clases .band-*). Si la
 *   sección ya lleva una clase .band-*, no hace falta. Con tone="brand" no se pintan lavados.
 * @param {'a'|'b'|'c'|'d'|'e'|'none'} [props.glows='a'] posición y tono de los lavados suaves.
 * @param {'grid'|'contour'|'dots'|'paws'|'none'} [props.pattern='grid'] patrón fino.
 * @param {boolean} [props.band=false] franja raised con bordes difuminados (sin cortes duros).
 * @param {string} [props.className]
 */
export default function SectionBackdrop({ tone, glows = 'a', pattern = 'grid', band = false, className = '' }) {
  const showGlows = glows !== 'none' && tone !== 'brand'
  return (
    <div className={`section-backdrop ${className}`} aria-hidden="true">
      {tone ? <div className={`sb-tone band-${tone}`} /> : null}
      {band ? <div className="sb-band" /> : null}
      {showGlows ? <div className={`sb-glows sb-glows--${glows}`} /> : null}
      {pattern !== 'none' ? <div className={`sb-pattern sb-pattern--${pattern}`} /> : null}
    </div>
  )
}
