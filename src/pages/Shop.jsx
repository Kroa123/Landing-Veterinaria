import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, ShoppingBag, X } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import PageHero from '../components/decor/PageHero.jsx'
import CategoryFilter from '../components/shop/CategoryFilter.jsx'
import ProductGrid from '../components/shop/ProductGrid.jsx'
import { categories, products } from '../data/products.js'
import { useCart } from '../context/cart.js'
import { formatPrice } from '../lib/formatPrice.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

const SORTS = [
  { id: 'destacados', label: 'Destacados primero' },
  { id: 'precio-asc', label: 'Precio: menor a mayor' },
  { id: 'precio-desc', label: 'Precio: mayor a menor' },
  { id: 'nombre', label: 'Nombre: A a la Z' },
]
const DEFAULT_SORT = 'destacados'
const MAX_QUERY = 60

// Minúsculas y sin tildes: "Cachorro pequeño" encuentra "pequeno" y al revés
function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

// Texto donde se busca cada producto (precalculado una vez)
const searchIndex = new Map(
  products.map((p) => [p.id, normalize([p.name, p.brand, p.species, p.detail, p.size, categoryLabel[p.category]].join(' '))]),
)

function matches(product, query) {
  if (!query) return true
  const haystack = searchIndex.get(product.id) || ''
  // Todas las palabras de la búsqueda deben aparecer (en cualquier orden)
  return query.split(/\s+/).every((word) => haystack.includes(word))
}

const sorters = {
  destacados: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  'precio-asc': (a, b) => a.price - b.price,
  'precio-desc': (a, b) => b.price - a.price,
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
}

// Lee y valida los filtros de la URL (?cat=&q=&orden=). Valores desconocidos se ignoran.
// Solo claves propias (Object.hasOwn / lista de categorías): "__proto__" o "constructor"
// no son órdenes válidos.
function readFilters(params) {
  const cat = params.get('cat')
  const orden = params.get('orden')
  return {
    cat: categories.some((c) => c.id === cat) ? cat : 'todo',
    q: (params.get('q') || '').slice(0, MAX_QUERY),
    orden: orden && Object.hasOwn(sorters, orden) ? orden : DEFAULT_SORT,
  }
}

// Tienda: catálogo completo con filtro por categoría, búsqueda y orden.
// El estado vive en la URL (se puede compartir y sobrevive al volver atrás).
export default function Shop() {
  usePageMeta({
    title: 'Tienda',
    description:
      'Alimento, antiparasitarios, higiene y accesorios para perros y gatos. Arma tu pedido y envíalo por WhatsApp: despacho en el día dentro de la comuna o retiro en tienda.',
  })

  const [params, setParams] = useSearchParams()
  const { cat, q, orden } = readFilters(params)
  const { count, subtotal, openCart } = useCart()

  // El campo de búsqueda tiene estado propio (escritura fluida) y se sincroniza con la URL.
  // Si la URL cambia desde fuera (Atrás, enlace), el campo se actualiza (ajuste durante el render).
  const [query, setQuery] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)
  if (q !== syncedQ) {
    setSyncedQ(q)
    setQuery(q)
  }

  // Actualiza la URL sin agregar entradas al historial por cada tecla o filtro
  function update(next) {
    const merged = { cat, q: query, orden, ...next }
    const out = new URLSearchParams()
    if (merged.cat && merged.cat !== 'todo') out.set('cat', merged.cat)
    const trimmed = merged.q.trim().slice(0, MAX_QUERY)
    if (trimmed) out.set('q', trimmed)
    if (merged.orden && merged.orden !== DEFAULT_SORT) out.set('orden', merged.orden)
    setParams(out, { replace: true, preventScrollReset: true })
  }

  function onQueryChange(value) {
    const v = value.slice(0, MAX_QUERY)
    setQuery(v)
    setSyncedQ(v.trim())
    update({ q: v })
  }

  function clearAll() {
    setQuery('')
    setSyncedQ('')
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  }

  const normalizedQuery = normalize(q)
  const visible = useMemo(() => {
    const list = products.filter((p) => (cat === 'todo' || p.category === cat) && matches(p, normalizedQuery))
    // sort estable: a igualdad conserva el orden del catálogo
    return [...list].sort(sorters[orden])
  }, [cat, normalizedQuery, orden])

  // Conteo por categoría según la búsqueda actual
  const options = useMemo(() => {
    const found = products.filter((p) => matches(p, normalizedQuery))
    return [
      { id: 'todo', label: 'Todo', count: found.length },
      ...categories.map((c) => ({ ...c, count: found.filter((p) => p.category === c.id).length })),
    ]
  }, [normalizedQuery])

  const activeLabel = options.find((o) => o.id === cat)?.label || 'Todo'
  const hasFilters = cat !== 'todo' || Boolean(q) || orden !== DEFAULT_SORT
  const summary = `${visible.length} ${visible.length === 1 ? 'producto' : 'productos'}${
    cat !== 'todo' ? ` en ${activeLabel}` : ''
  }${q ? ` para «${q}»` : ''}`

  return (
    <>
      <PageHero
        eyebrow="Tienda"
        title="Lo que tu mascota necesita, con despacho en el día"
        lede="Alimento, antiparasitarios, higiene y accesorios que usamos y recomendamos en consulta. Arma tu pedido, envíalo por WhatsApp y te confirmamos el total."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Tienda' }]}
        tone="leaf"
      >
        {count > 0 ? (
          <Button variant="secondary" onClick={openCart}>
            <Icon icon={ShoppingBag} />
            Ver carrito
            <span className="font-mono text-[13px] font-normal tabular-nums text-ink-soft">
              {count} · {formatPrice(subtotal)}
            </span>
          </Button>
        ) : null}
      </PageHero>

      <section aria-labelledby="catalogo-title" className="band-page pb-24 pt-10 lg:pb-32 lg:pt-12">
        <Container>
          <h2 id="catalogo-title" className="sr-only">
            Catálogo
          </h2>

          {/* Barra de herramientas: búsqueda y orden arriba, categorías abajo */}
          <div className="shop-toolbar flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="shop-q" className="text-[14px] font-medium text-ink">
                  Buscar
                </label>
                <div className="relative mt-2">
                  <Icon icon={Search} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="shop-q"
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    maxLength={MAX_QUERY}
                    placeholder="Ej.: gato, antipulgas, Campo Norte"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="fx-input block min-h-12 w-full rounded-control border border-line bg-page pl-11 pr-11 text-[16px] text-ink placeholder:text-muted focus:bg-card"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => onQueryChange('')}
                      className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-control text-ink-soft hover:bg-raised hover:text-ink"
                      aria-label="Borrar búsqueda"
                    >
                      <Icon icon={X} />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="sm:w-64">
                <label htmlFor="shop-orden" className="text-[14px] font-medium text-ink">
                  Ordenar por
                </label>
                <select
                  id="shop-orden"
                  value={orden}
                  onChange={(e) => update({ orden: e.target.value })}
                  className="fx-input mt-2 block min-h-12 w-full rounded-control border border-line bg-page px-4 text-[16px] text-ink focus:bg-card"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <CategoryFilter options={options} value={cat} onChange={(id) => update({ cat: id })} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-ink-soft" aria-live="polite">
              {summary}
            </p>
            {hasFilters ? (
              <Button variant="quiet" size="sm" onClick={clearAll}>
                <Icon icon={X} />
                Limpiar filtros
              </Button>
            ) : null}
          </div>

          {visible.length > 0 ? (
            // revealKey sin la búsqueda: escribir no rearma la animación (las tarjetas no
            // parpadean por tecla); cambiar categoría u orden sí
            <ProductGrid products={visible} revealKey={`${cat}|${orden}`} className="mt-6" />
          ) : (
            <div className="shop-empty mt-6 flex flex-col items-start gap-4 rounded-card p-8 sm:p-10">
              <span className="flex size-12 items-center justify-center rounded-full bg-leaf text-ink" aria-hidden="true">
                <Icon icon={SearchX} size={22} />
              </span>
              <div>
                <p className="text-[19px] font-medium text-ink">No encontramos productos con esos filtros</p>
                <p className="mt-2 max-w-[36rem] text-[15px] leading-6 text-ink-soft">
                  Prueba con otra palabra o quita la categoría. Si buscas algo que no está en la tienda, pregúntanos por WhatsApp: muchas veces lo conseguimos.
                </p>
              </div>
              <Button variant="secondary" onClick={clearAll}>
                Ver todos los productos
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
