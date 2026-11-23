import { useEffect, useRef } from 'react'
import { Check, Plus } from 'lucide-react'
import ProductPackage from './ProductPackage.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import PriceTag from '../ui/PriceTag.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { useCart } from '../../context/cart.js'
import { pointerMotionOk } from '../../lib/motionOk.js'

// Inclinación máxima de la tarjeta al seguir el cursor, en grados (contrato: ≤ 8)
const MAX_TILT = 6

// <article> con tilt 3D + luz que sigue al cursor. Escribe variables CSS (--rx, --ry, --lx, --ly)
// una vez por frame; los estilos viven en styles.css (.tilt-card, .tilt-light).
function TiltArticle({ className = '', children }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const point = useRef(null)
  const rect = useRef(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function paint() {
    frame.current = 0
    const el = ref.current
    const p = point.current
    const r = rect.current
    if (!el || !p || !r) return
    // Si hubo scroll desde que se midió, la tarjeta se movió: corrige con el desplazamiento
    const left = r.left - (window.scrollX - r.sx)
    const top = r.top - (window.scrollY - r.sy)
    const x = Math.min(1, Math.max(0, (p.x - left) / r.width))
    const y = Math.min(1, Math.max(0, (p.y - top) / r.height))
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`)
    el.style.setProperty('--lx', `${(x * r.width).toFixed(1)}px`)
    el.style.setProperty('--ly', `${(y * r.height).toFixed(1)}px`)
  }

  function onPointerEnter(e) {
    if (e.pointerType !== 'mouse' || !pointerMotionOk() || !ref.current) return
    // Medimos sin inclinación para que el cálculo no se retroalimente
    const b = ref.current.getBoundingClientRect()
    rect.current = { left: b.left, top: b.top, width: b.width, height: b.height, sx: window.scrollX, sy: window.scrollY }
    ref.current.classList.add('is-tilting')
  }

  function onPointerMove(e) {
    if (e.pointerType !== 'mouse' || !rect.current) return
    point.current = { x: e.clientX, y: e.clientY }
    if (!frame.current) frame.current = requestAnimationFrame(paint)
  }

  function onPointerLeave() {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    point.current = null
    rect.current = null
    const el = ref.current
    if (!el) return
    el.classList.remove('is-tilting')
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
  }

  return (
    <article
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`tilt-card ${className}`}
    >
      {/* Luz que sigue al cursor (decorativa) */}
      <span className="tilt-light" aria-hidden="true" />
      {children}
    </article>
  )
}

export default function ProductCard({ product }) {
  const { qtyOf, add } = useCart()
  const inCart = qtyOf(product.id) > 0
  const actionRef = useRef(null)
  const refocus = useRef(false)

  // Agrega al carrito. La animación "vuela al carrito" la dispara FlyToCart solo,
  // al ver subir el contador justo después de este clic (sin evento manual: un solo punto)
  function handleAdd() {
    add(product.id)
  }

  // Al pasar de "Agregar" al control de cantidad (o al revés) el botón pulsado
  // desaparece. Si el clic fue en esta tarjeta y el foco se perdió, lo devolvemos
  // al nuevo control. Cambios hechos desde el carrito no mueven el foco.
  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    const active = document.activeElement
    if (!active || active === document.body) {
      const buttons = actionRef.current?.querySelectorAll('button')
      if (buttons?.length) buttons[buttons.length - 1].focus()
    }
  }, [inCart])

  return (
    <TiltArticle className="theme-night flex w-full gap-3 rounded-card border border-night-line bg-night-raised p-2 text-on-night sm:flex-col sm:gap-0">
      {/* Vitrina: radio interior = 16 − 8. En móvil va a la izquierda y la tarjeta queda horizontal */}
      <div className="vitrine-night relative flex w-32 shrink-0 items-start rounded-[8px] px-2 pb-2 pt-4 sm:block sm:w-auto sm:px-6 sm:pb-2 sm:pt-8">
        <ProductPackage product={product} tone="night" className="mx-auto block h-auto w-full max-w-[240px] overflow-visible" />
        <PriceTag price={product.price} size="md" className="theme-light tag-swing absolute right-2 top-2 -rotate-6 max-sm:hidden" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-2 pr-2 sm:px-3 sm:pb-3 sm:pt-4">
        <p className="text-[13px] leading-5 text-muted">
          {product.brand} · {product.species}
        </p>
        <h3 className="mt-1 text-[16px] font-medium leading-[1.3] text-ink">
          {product.name} <span className="whitespace-nowrap text-ink-soft">{product.size}</span>
        </h3>
        <p className="mt-1 text-[14px] leading-5 text-ink-soft">{product.detail}</p>
        <PriceTag price={product.price} size="sm" className="theme-light tag-swing -ml-1 mt-2 -rotate-6 sm:hidden" />

        <div
          ref={actionRef}
          className="mt-auto pt-3 sm:pt-4"
          onClickCapture={() => {
            refocus.current = true
            window.setTimeout(() => {
              refocus.current = false
            }, 0)
          }}
        >
          {inCart ? (
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-mint">
                <Icon icon={Check} />
                En el carrito
              </span>
              <QuantityStepper product={product} />
            </div>
          ) : (
            <Button variant="shop" onClick={handleAdd} className="w-full">
              <Icon icon={Plus} />
              <span>
                Agregar<span className="max-sm:hidden"> al carrito</span>
              </span>
              <span className="sr-only">: {product.name} {product.size}</span>
            </Button>
          )}
        </div>
      </div>
    </TiltArticle>
  )
}
