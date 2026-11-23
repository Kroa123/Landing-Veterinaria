import { Minus, Plus, Trash2 } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import { useCart } from '../../context/cart.js'

// Control de cantidad: menos, número, más. En 1, el botón de la izquierda quita el producto.
export default function QuantityStepper({ product, className = '' }) {
  const { qtyOf, increment, decrement, maxQty } = useCart()
  const qty = qtyOf(product.id)
  const atOne = qty <= 1

  return (
    <div
      className={`inline-flex h-11 items-center rounded-control border border-line-strong bg-card ${className}`}
      role="group"
      aria-label={`Cantidad de ${product.name}`}
    >
      <button
        type="button"
        onClick={() => decrement(product.id)}
        className="flex size-11 items-center justify-center rounded-l-control text-ink-soft transition-colors hover:bg-raised hover:text-ink"
        aria-label={atOne ? `Quitar ${product.name} del carrito` : `Restar uno de ${product.name}`}
      >
        <Icon icon={atOne ? Trash2 : Minus} />
      </button>
      <span className="min-w-8 text-center font-mono text-[14px] tabular-nums text-ink">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => increment(product.id)}
        disabled={qty >= maxQty}
        className="flex size-11 items-center justify-center rounded-r-control text-ink-soft transition-colors hover:bg-raised hover:text-ink disabled:opacity-40"
        aria-label={`Sumar uno de ${product.name}`}
      >
        <Icon icon={Plus} />
      </button>
    </div>
  )
}
