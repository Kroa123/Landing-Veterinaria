import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, MessageCircle, Minus, Plus, ShoppingBag, Store, Truck } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import PriceTag from '../components/ui/PriceTag.jsx'
import Breadcrumbs from '../components/pages-kit/Breadcrumbs.jsx'
import NotFoundContent from '../components/pages-kit/NotFoundContent.jsx'
import ProductGrid from '../components/shop/ProductGrid.jsx'
import ProductViewer3D from '../components/three/ProductViewer3D.jsx'
import { getCategory, getProductBySlug, getRelatedProducts } from '../data/products.js'
import { useCart } from '../context/cart.js'
import { formatPrice } from '../lib/formatPrice.js'
import { buildWhatsAppUrl } from '../lib/whatsapp.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { site } from '../config/site.js'

// Fondo suave de la vitrina según la categoría (tokens día)
const VITRINE = {
  alimento: 'bg-leaf-soft',
  antiparasitarios: 'bg-sky-soft',
  higiene: 'bg-sun-soft',
  accesorios: 'bg-coral-soft',
}

// Selector de cantidad antes de agregar (el del carrito, QuantityStepper, edita el carrito)
function QtyPicker({ value, onChange, max, name }) {
  return (
    <div className="inline-flex h-12 items-center rounded-control border border-line bg-card" role="group" aria-label={`Cantidad de ${name}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex size-12 items-center justify-center rounded-l-control text-ink-soft transition-colors hover:bg-raised hover:text-ink disabled:opacity-40"
        aria-label="Restar uno"
      >
        <Icon icon={Minus} />
      </button>
      <output className="min-w-10 text-center font-mono text-[15px] tabular-nums text-ink" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex size-12 items-center justify-center rounded-r-control text-ink-soft transition-colors hover:bg-raised hover:text-ink disabled:opacity-40"
        aria-label="Sumar uno"
      >
        <Icon icon={Plus} />
      </button>
    </div>
  )
}

function Detail({ product }) {
  const category = getCategory(product.category)
  const related = getRelatedProducts(product, 4)
  const { add, qtyOf, openCart, maxQty } = useCart()
  const [qty, setQty] = useState(1)
  const inCart = qtyOf(product.id)
  // El carrito admite hasta maxQty por producto: no se ofrece más de lo que cabe
  const room = Math.max(0, maxQty - inCart)
  const pickQty = Math.min(qty, Math.max(1, room))
  const questionUrl = buildWhatsAppUrl(`Hola ${site.name}, tengo una consulta sobre ${product.name} ${product.size}.`)

  usePageMeta({
    title: product.name,
    description: `${product.name} ${product.size} de ${product.brand}: ${formatPrice(product.price)}. ${product.detail}. Pídelo por WhatsApp con despacho en el día dentro de la comuna.`,
  })

  return (
    <>
      <section aria-labelledby="producto-title" className="band-page pb-16 pt-24 lg:pb-24 lg:pt-28">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Tienda', to: '/tienda' },
              { label: category?.label || 'Productos', to: `/tienda?cat=${product.category}` },
              { label: product.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
            {/* Visor 3D del empaque (fallback: empaque SVG) */}
            <div className={`product-vitrine relative aspect-square overflow-hidden rounded-panel border border-line ${VITRINE[product.category] || 'bg-raised'}`}>
              <ProductViewer3D product={product} />
              <PriceTag price={product.price} size="md" className="tag-swing pointer-events-none absolute right-4 top-4 -rotate-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[14px] leading-5 text-muted">
                {product.brand} · {product.species}
              </p>
              <h1 id="producto-title" className="mt-2 text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-ink sm:text-[40px]">
                {product.name}
              </h1>
              <p className="mt-2 font-mono text-[15px] text-ink-soft">{product.presentation}</p>

              <p className="mt-6 font-mono text-[32px] font-medium tabular-nums text-ink">{formatPrice(product.price)}</p>
              <p className="mt-1 text-[13px] text-muted">Precio en pesos chilenos, sujeto a stock.</p>

              <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-ink-soft">{product.description}</p>

              {/* Comprar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <QtyPicker value={pickQty} onChange={setQty} max={Math.max(1, room)} name={product.name} />
                <Button size="lg" onClick={() => add(product.id, pickQty)} disabled={room === 0} className="flex-1 sm:flex-none">
                  <Icon icon={Plus} />
                  Agregar al carrito
                  <span className="sr-only">: {pickQty} de {product.name}</span>
                </Button>
              </div>
              {inCart > 0 ? (
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-ink">
                  <span className="inline-flex items-center gap-2 font-medium text-brand">
                    <Icon icon={Check} />
                    {inCart} en el carrito
                  </span>
                  <button type="button" onClick={openCart} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-brand underline underline-offset-4">
                    <Icon icon={ShoppingBag} size={16} />
                    Ver carrito
                  </button>
                </p>
              ) : null}

              <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[15px] text-ink-soft sm:grid-cols-2">
                <li className="flex items-start gap-3">
                  <Icon icon={Truck} className="mt-0.5 text-brand" />
                  {site.delivery}
                </li>
                <li className="flex items-start gap-3">
                  <Icon icon={Store} className="mt-0.5 text-brand" />
                  {site.pickup}
                </li>
              </ul>

              <a
                href={questionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-brand underline-offset-4 hover:underline"
              >
                <Icon icon={MessageCircle} />
                ¿Dudas con la dosis o el tamaño? Pregúntanos por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>
          </div>

          {/* Ficha: modo de uso, para quién, presentación */}
          <div className="mt-16 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <section aria-labelledby="uso-title" className="surface-card p-6 sm:p-8">
              <h2 id="uso-title" className="text-[22px] font-medium tracking-[-0.01em] text-ink">
                Modo de uso
              </h2>
              <ol className="mt-5 space-y-3">
                {product.usage.map((step, i) => (
                  <li key={step} className="flex gap-4 text-[16px] leading-6 text-ink-soft">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf-soft font-mono text-[13px] tabular-nums text-ink"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[14px] leading-5 text-muted">
                Ante cualquier duda, consulta con tu veterinario. Esta información no reemplaza una consulta.
              </p>
            </section>

            <section aria-labelledby="ficha-title" className="surface-card p-6 sm:p-8">
              <h2 id="ficha-title" className="text-[22px] font-medium tracking-[-0.01em] text-ink">
                Ficha
              </h2>
              <dl className="mt-5 divide-y divide-line">
                <div className="py-3">
                  <dt className="text-[14px] text-muted">Para quién</dt>
                  <dd className="mt-1 text-[16px] leading-6 text-ink">{product.forWho}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-[14px] text-muted">Presentación</dt>
                  <dd className="mt-1 text-[16px] leading-6 text-ink">{product.presentation}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-[14px] text-muted">Marca</dt>
                  <dd className="mt-1 text-[16px] leading-6 text-ink">{product.brand}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-[14px] text-muted">Categoría</dt>
                  <dd className="mt-1 text-[16px] leading-6 text-ink">{category?.label}</dd>
                </div>
              </dl>
            </section>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section aria-labelledby="relacionados-title" className="band-white border-t border-line py-16 lg:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="relacionados-title" className="text-[28px] font-medium tracking-[-0.02em] text-ink sm:text-[34px]">
                También te puede servir
              </h2>
              <Button to="/tienda" variant="secondary">
                Ver toda la tienda
              </Button>
            </div>
            <ProductGrid products={related} revealKey={product.id} className="mt-8" />
          </Container>
        </section>
      ) : null}
    </>
  )
}

// Detalle de producto: /tienda/:slug. Si el slug no existe, muestra "no encontrado".
export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <ProductNotFound />
  // key: al pasar de un producto a otro (relacionados) se reinicia la cantidad elegida
  return <Detail key={product.id} product={product} />
}

function ProductNotFound() {
  usePageMeta({ title: 'Producto no encontrado', description: 'El producto que buscas ya no está en la tienda de Valle Vet.', noindex: true })
  return (
    <NotFoundContent
      title="Este producto ya no está en la tienda"
      lede="Puede que lo hayamos retirado o que el enlace esté incompleto. Revisa el catálogo: seguro hay una alternativa."
    />
  )
}
