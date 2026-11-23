// Envoltorio de lucide-react: un tamaño y un trazo en todo el sitio.
// Siempre decorativo: el texto del botón o enlace lleva el significado.
// El color lo hereda del texto (currentColor).

export default function Icon({ icon: Glyph, size = 18, className = '' }) {
  return <Glyph size={size} strokeWidth={1.5} className={`shrink-0 ${className}`} aria-hidden="true" focusable="false" />
}
