import { CalendarDays, ShoppingBag } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { useCart } from '../../context/cart.js'
import { formatPrice } from '../../lib/formatPrice.js'

// Barra fija inferior solo en móvil: agendar y carrito siempre a mano.
// Vidrio noche: se lee igual sobre el hero oscuro y sobre las secciones claras.
export default function MobileBar() {
  const { count, subtotal, openCart, isOpen } = useCart()

  return (
    <div className="theme-night fixed inset-x-0 bottom-0 z-30 border-t border-night-line bg-night/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-16px_rgb(0_0_0/0.5)] md:hidden">
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <Button href="#contacto" variant="night-primary" size="bar">
          <Icon icon={CalendarDays} />
          Agendar
        </Button>
        <Button
          variant="night-secondary"
          size="bar"
          onClick={openCart}
          data-cart-target-mobile=""
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="whitespace-nowrap"
        >
          <span className={`relative flex ${count > 0 ? 'mr-2' : ''}`}>
            <Icon icon={ShoppingBag} />
            {count > 0 ? (
              <span
                key={count}
                aria-hidden="true"
                className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pine px-1 font-mono text-[11px] leading-none tabular-nums text-white ring-2 ring-night motion-safe:animate-bump"
              >
                {count}
              </span>
            ) : null}
          </span>
          Carrito
          {count > 0 ? (
            <span className="font-mono text-[13px] font-normal tabular-nums text-ink-soft">
              {formatPrice(subtotal)}
            </span>
          ) : null}
          <span className="sr-only">
            , {count} {count === 1 ? 'producto' : 'productos'}
          </span>
        </Button>
      </div>
    </div>
  )
}
