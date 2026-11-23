import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { pointerMotionOk } from '../../lib/motionOk.js'

// Botón base. Con href se renderiza como enlace; sin href, como <button>.
// Todas las variantes miden al menos 44 px de alto (objetivo táctil).
// Hover (solo mouse/trackpad): se eleva 2 px, barrido de brillo y halo. Al presionar, escala 0.97.
// Las variantes principales tienen un efecto magnético leve que sigue al cursor
// (desactivado con prefers-reduced-motion y en pantallas táctiles). Estilos en styles.css (.btn-fx).

const base =
  'btn-fx inline-flex items-center justify-center gap-2 rounded-control font-medium leading-none select-none ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const variants = {
  // Acción principal: agendar, pedir, enviar
  primary: 'bg-pine text-white hover:bg-pine-hover [--btn-glow:rgb(30_91_67/0.45)]',
  // Acción secundaria sobre fondo claro
  secondary:
    'border border-line-strong bg-card text-ink hover:bg-raised [--shine:rgb(30_91_67/0.10)] [--btn-glow:rgb(22_32_27/0.18)]',
  // Agregar al carrito: neutro, toma el acento al pasar el cursor
  shop: 'border border-line-strong bg-card text-ink hover:border-pine hover:bg-pine-soft [--shine:rgb(110_231_183/0.16)] [--btn-glow:rgb(110_231_183/0.22)]',
  // Estado ya elegido (producto en el carrito)
  selected: 'border border-pine bg-pine-soft text-pine hover:bg-card [--shine:rgb(30_91_67/0.10)]',
  // Sin borde, para acciones menores
  quiet: 'btn-flat text-ink-soft hover:bg-raised hover:text-ink [--shine:transparent]',
  // Sobre fondo noche: mint con texto oscuro (contraste 12:1) y halo mint
  'night-primary':
    'bg-mint text-night hover:bg-mint-deep focus-visible:outline-mint [--shine:rgb(255_255_255/0.55)] [--btn-glow:rgb(110_231_183/0.55)]',
  // Sobre fondo noche: contorno claro
  'night-secondary':
    'border border-on-night/30 bg-on-night/[0.03] text-on-night hover:border-mint/70 hover:bg-on-night/[0.08] focus-visible:outline-mint ' +
    '[--shine:rgb(110_231_183/0.18)] [--btn-glow:rgb(110_231_183/0.30)]',
}

const sizes = {
  sm: 'min-h-11 px-3 text-[14px]',
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-12 px-6 text-[15px]',
  // Alto táctil grande con poco padding: barra inferior móvil
  bar: 'min-h-12 px-3 text-[15px]',
}

const MAGNETIC = new Set(['primary', 'night-primary', 'night-secondary'])
// Desplazamiento máximo del efecto magnético, en px
const PULL_X = 8
const PULL_Y = 6

const Button = forwardRef(function Button(
  {
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    type = 'button',
    external = false,
    magnetic,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const node = useRef(null)
  const frame = useRef(0)
  const isMagnetic = magnetic ?? MAGNETIC.has(variant)

  const setRef = useCallback(
    (el) => {
      node.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    },
    [ref],
  )

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function handlePointerMove(e) {
    onPointerMove?.(e)
    if (!isMagnetic || e.pointerType !== 'mouse' || !pointerMotionOk()) return
    const { clientX, clientY } = e
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const el = node.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2)
      el.style.setProperty('--mag-x', `${(Math.max(-1, Math.min(1, dx)) * PULL_X).toFixed(2)}px`)
      el.style.setProperty('--mag-y', `${(Math.max(-1, Math.min(1, dy)) * PULL_Y).toFixed(2)}px`)
    })
  }

  function handlePointerLeave(e) {
    onPointerLeave?.(e)
    cancelAnimationFrame(frame.current)
    frame.current = 0
    node.current?.style.removeProperty('--mag-x')
    node.current?.style.removeProperty('--mag-y')
  }

  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`
  const shared = {
    ref: setRef,
    className: classes,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  }
  const shine = <span className="btn-shine" aria-hidden="true" />

  if (href) {
    const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} {...extra} {...rest} {...shared}>
        {shine}
        {children}
      </a>
    )
  }

  return (
    <button type={type} {...rest} {...shared}>
      {shine}
      {children}
    </button>
  )
})

export default Button
