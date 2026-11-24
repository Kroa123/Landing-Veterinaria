import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import ProductPackage from './ProductPackage.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { useCart } from '../../context/cart.js'
import { formatPrice } from '../../lib/formatPrice.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../../lib/whatsapp.js'
import { productPath } from '../../data/navigation.js'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const DELIVERY_OPTIONS = [
  { id: 'despacho', label: 'Despacho en la comuna', hint: 'En el día' },
  { id: 'retiro', label: 'Retiro en tienda', hint: 'Sin costo' },
]

export default function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, remove, clear, announcement } = useCart()
  const [delivery, setDelivery] = useState('despacho')
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // Si se cierra con "Ver productos" estando ya en /tienda, el foco va al título de la página
  // y no al botón que abrió el carrito (si se navega, el cambio de ruta mueve el foco)
  const focusShopOnClose = useRef(false)

  // Al abrir: foco en cerrar, bloqueo de scroll, Esc cierra y Tab queda dentro.
  // Al cerrar: el foco vuelve a donde estaba.
  useEffect(() => {
    if (!isOpen) return undefined

    const previous = document.activeElement
    const { body, documentElement } = document
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
      htmlOverflow: documentElement.style.overflow,
    }
    const scrollbar = window.innerWidth - documentElement.clientWidth
    // html y body: iOS Safari ignora el bloqueo si solo se aplica al body
    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    // El panel ya es visible en este commit (la visibilidad solo se anima al cerrar).
    // Respaldo: si el foco no entró al panel, se reintenta en el siguiente frame.
    closeRef.current?.focus({ preventScroll: true })
    let frame = 0
    if (!panelRef.current?.contains(document.activeElement)) {
      frame = window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeCart()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (!panelRef.current.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      documentElement.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.paddingRight = prev.bodyPadding
      if (focusShopOnClose.current) {
        focusShopOnClose.current = false
        const heading = document.querySelector('#contenido h1')
        if (heading) {
          if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
          heading.focus()
        }
      } else if (previous instanceof HTMLElement && document.contains(previous)) {
        previous.focus()
      }
    }
  }, [isOpen, closeCart])

  // Si se quita una línea y el foco queda en el body, vuelve al panel
  useEffect(() => {
    if (!isOpen) return
    const active = document.activeElement
    if (!active || active === document.body) closeRef.current?.focus()
  }, [lines.length, isOpen])

  const message = buildOrderMessage(lines, subtotal, delivery)
  const orderUrl = buildWhatsAppUrl(message)

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'visible transition-none' : 'invisible transition-[visibility] duration-300'}`}
      aria-hidden={!isOpen}
    >
      {/* Fondo: clic para cerrar */}
      <div
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-card shadow-float transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Avisos de cantidades mientras el panel está abierto */}
        <p className="sr-only" role="status" aria-live="polite">
          {isOpen ? announcement : ''}
        </p>

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pl-6 pr-3">
          <h2 id="cart-title" className="flex items-baseline gap-2 text-[18px] font-medium text-ink">
            Tu carrito
            <span className="font-mono text-[13px] font-normal tabular-nums text-muted">
              {count} {count === 1 ? 'producto' : 'productos'}
            </span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="flex size-11 items-center justify-center rounded-control text-ink-soft transition-colors hover:bg-raised hover:text-ink"
            aria-label="Cerrar carrito"
          >
            <Icon icon={X} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-6">
            <p className="text-[18px] font-medium text-ink">Tu carrito está vacío</p>
            <p className="mt-2 text-[15px] leading-6 text-ink-soft">
              Agrega alimento, antiparasitarios o productos de higiene y envíanos el pedido por WhatsApp.
            </p>
            <Button
              to="/tienda"
              variant="secondary"
              className="mt-6"
              onClick={(e) => {
                e.preventDefault()
                if (pathname === '/tienda') focusShopOnClose.current = true
                closeCart()
                if (pathname !== '/tienda') navigate('/tienda')
              }}
            >
              Ver productos
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <div className="w-20 shrink-0 rounded-[8px] bg-page p-1">
                    <ProductPackage product={product} className="block h-auto w-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium leading-5 text-ink">
                          <Link
                            to={productPath(product)}
                            onClick={closeCart}
                            className="rounded-[4px] underline-offset-4 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </p>
                        <p className="mt-1 font-mono text-[12px] leading-4 text-muted">
                          {product.size} · {formatPrice(product.price)} c/u
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-[14px] tabular-nums text-ink">
                        {formatPrice(product.price * qty)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper product={product} />
                      <Button variant="quiet" size="sm" onClick={() => remove(product.id)}>
                        Quitar
                        <span className="sr-only"> {product.name}</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="shrink-0 border-t border-line px-6 pb-6 pt-5">
              <fieldset>
                <legend className="text-[14px] font-medium text-ink">Entrega</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const active = delivery === opt.id
                    return (
                      <label
                        key={opt.id}
                        className={`flex min-h-11 cursor-pointer flex-col justify-center rounded-control border px-3 py-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                          active ? 'border-brand bg-leaf-soft' : 'border-line-strong hover:bg-raised'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={opt.id}
                          checked={active}
                          onChange={() => setDelivery(opt.id)}
                          className="sr-only"
                        />
                        <span className={`text-[14px] leading-5 ${active ? 'font-medium text-brand-hover' : 'text-ink'}`}>
                          {opt.label}
                        </span>
                        <span className={`font-mono text-[12px] leading-4 ${active ? 'text-ink-soft' : 'text-muted'}`}>
                          {opt.hint}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-[15px] text-ink-soft">Subtotal</span>
                <span className="font-mono text-[20px] font-medium tabular-nums text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-5 text-muted">
                {delivery === 'retiro'
                  ? 'Te avisamos por WhatsApp cuando esté listo para retirar.'
                  : 'El costo de despacho se confirma por WhatsApp según tu dirección.'}
              </p>

              <Button href={orderUrl} external size="lg" className="mt-4 w-full">
                <Icon icon={MessageCircle} />
                Pedir por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </Button>
              <Button variant="quiet" size="sm" onClick={clear} className="mt-2 w-full">
                Vaciar carrito
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
