import { CalendarDays, ShoppingBag } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { useCart } from '../../context/cart.js'
import { formatPrice } from '../../lib/formatPrice.js'
import { bookPath } from '../../data/navigation.js'

// Barra fija inferior solo en móvil: agendar y carrito siempre a mano.
// Blanca casi opaca con hairline y sombra suave hacia arriba: se lee sobre cualquier banda.
export default function MobileBar() {
  const { count, subtotal, openCart, isOpen } = useCart()

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-bar md:hidden">
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <Button to={bookPath} variant="primary" size="bar">
          <Icon icon={CalendarDays} />
          Agendar
        </Button>
        <Button
          variant="secondary"
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
                className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-mono text-[11px] leading-none tabular-nums text-white ring-2 ring-card motion-safe:animate-bump"
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
