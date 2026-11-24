import { forwardRef } from 'react'

/**
 * Chip interactivo (filtros de categoría, orden, selección simple). Es un <button> con
 * aria-pressed: el lector anuncia "presionado" en el activo. Alto táctil 44 px.
 * Activo: fondo brand + texto blanco (5.4:1). Inactivo: blanco con hairline, texto ink.
 * Hover (solo puntero fino): borde brand. Estilos de transición en styles.css (.chip).
 *
 * @param {object} props
 * @param {boolean} [props.selected=false] estado activo (aria-pressed).
 * @param {React.ComponentType} [props.icon] icono lucide decorativo (16 px).
 * @param {React.ReactNode} [props.count] número opcional a la derecha (p. ej. productos).
 * @param {string} [props.className]
 * Resto de props (onClick, aria-controls, ...) van al <button>.
 */
export const Chip = forwardRef(function Chip(
  { selected = false, icon: Glyph, count, className = '', children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={`chip inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-medium leading-none active:scale-[0.97] ${
        selected
          ? 'border-brand bg-brand text-white'
          : 'border-line-strong bg-card text-ink'
      } ${className}`}
      {...rest}
    >
      {Glyph ? <Glyph size={16} strokeWidth={1.5} className="shrink-0" aria-hidden="true" focusable="false" /> : null}
      {children}
      {count != null ? (
        <span
          className={`font-mono text-[12px] tabular-nums ${selected ? 'text-leaf-soft' : 'text-muted'}`}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
})
