import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { pointerMotionOk } from '../../lib/motionOk.js'

// Botón base. Con `to` se renderiza como <Link> de react-router (navegación interna sin
// recargar); con href, como <a>; sin ninguno, como <button>.
// Variantes v4: primary, secondary, shop, selected, accent, inverse (sobre .band-brand), quiet.
// Todas las variantes miden al menos 44 px de alto (objetivo táctil).
// Hover (solo mouse/trackpad): se eleva 2 px, barrido de brillo y halo. Al presionar, escala 0.97.
// Las variantes principales tienen un efecto magnético leve que sigue al cursor
// (desactivado con prefers-reduced-motion y en pantallas táctiles). Estilos en styles.css (.btn-fx).

const base =
  'btn-fx inline-flex items-center justify-center gap-2 rounded-control font-medium leading-none select-none ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

// Variantes del tema día (v4). Contraste: blanco/brand 5.4:1, ink/coral 5.8:1,
// brand-hover/blanco 7.5:1, ink/blanco 16:1. El halo (--btn-glow) es una sombra neutra
// con tinte, no un glow de neón.
const variants = {
  // Acción principal: agendar, pedir, enviar
  primary:
    'bg-brand text-white hover:bg-brand-hover [--shine:rgb(255_255_255/0.28)] [--btn-glow:rgb(15_122_71/0.35)]',
  // Acción secundaria: contorno sobre blanco
  secondary:
    'border border-line-strong bg-card text-ink hover:border-brand hover:text-brand-hover [--shine:rgb(15_122_71/0.08)] [--btn-glow:rgb(19_50_34/0.16)]',
  // Agregar al carrito: neutro, toma el verde suave al pasar el cursor
  shop: 'border border-line-strong bg-card text-ink hover:border-brand hover:bg-leaf-soft [--shine:rgb(34_197_94/0.14)] [--btn-glow:rgb(19_50_34/0.16)]',
  // Estado ya elegido (producto en el carrito): brand-hover sobre leaf-soft 6.8:1
  selected:
    'border border-brand bg-leaf-soft text-brand-hover hover:bg-card [--shine:rgb(15_122_71/0.10)]',
  // Acento cálido: ofertas, promociones. Texto ink (nunca blanco sobre coral)
  accent:
    'bg-coral text-ink [--shine:rgb(255_255_255/0.4)] [--btn-glow:rgb(255_107_74/0.35)]',
  // Sobre .band-brand: botón blanco con texto brand-hover; anillo de foco blanco
  inverse:
    'bg-card text-brand-hover hover:bg-leaf-soft focus-visible:outline-white [--shine:rgb(15_122_71/0.10)] [--btn-glow:rgb(8_60_35/0.35)]',
  // Sin borde, para acciones menores
  quiet: 'btn-flat text-ink-soft hover:bg-raised hover:text-ink [--shine:transparent]',
}

const sizes = {
  sm: 'min-h-11 px-3 text-[14px]',
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-12 px-6 text-[15px]',
  // Alto táctil grande con poco padding: barra inferior móvil
  bar: 'min-h-12 px-3 text-[15px]',
}

const MAGNETIC = new Set(['primary', 'accent', 'inverse'])
// Desplazamiento máximo del efecto magnético, en px
const PULL_X = 8
const PULL_Y = 6

const Button = forwardRef(function Button(
  {
    to,
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

  if (to != null) {
    return (
      <Link to={to} {...rest} {...shared}>
        {shine}
        {children}
      </Link>
    )
  }

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
