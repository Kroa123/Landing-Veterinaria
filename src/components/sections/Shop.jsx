import { useMemo, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import CategoryFilter from '../shop/CategoryFilter.jsx'
import ProductCard from '../shop/ProductCard.jsx'
import NightBackdrop from '../motion/NightBackdrop.jsx'
import { gsap, ScrollTrigger, useGSAP, EASE, showNow } from '../motion/gsap.js'
import { categories, products } from '../../data/products.js'
import { useCart } from '../../context/cart.js'
import { formatPrice } from '../../lib/formatPrice.js'

export default function Shop() {
  const [category, setCategory] = useState('todo')
  const { count, subtotal, openCart } = useCart()
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const gridRef = useRef(null)

  const options = useMemo(
    () => [
      { id: 'todo', label: 'Todo', count: products.length },
      ...categories.map((c) => ({
        ...c,
        count: products.filter((p) => p.category === c.id).length,
      })),
    ],
    [],
  )

  const visible = category === 'todo' ? products : products.filter((p) => p.category === category)
  const activeLabel = options.find((o) => o.id === category)?.label

  // Encabezado: entra una vez al llegar a la tienda
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(headRef.current.children, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.1,
          ease: EASE,
          scrollTrigger: { trigger: headRef.current, start: 'top 82%', once: true },
        })
      })
    },
    { scope: sectionRef },
  )

  // Grilla: las tarjetas entran en cascada por filas. Al cambiar el filtro se rearma
  // con los productos nuevos (los que ya están en pantalla entran de inmediato).
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray(gridRef.current.children)
        if (!items.length) return
        // transition: none mientras entran (la tarjeta transiciona transform en el tilt);
        // al terminar se limpian los estilos en línea
        const clearProps = 'opacity,transform,transition'
        gsap.set(items, { opacity: 0, y: 40, transition: 'none' })
        let shown = false
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          interval: 0.08,
          onEnter: (batch) => {
            if (shown) return
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE, overwrite: true, clearProps })
          },
        })
        // Tab dentro de la grilla antes de revelarse: se muestra al instante
        const grid = gridRef.current
        const onFocusIn = () => {
          if (shown) return
          shown = true
          showNow(items)
        }
        grid.addEventListener('focusin', onFocusIn)
        return () => grid.removeEventListener('focusin', onFocusIn)
      })
    },
    { scope: sectionRef, dependencies: [category], revertOnUpdate: true },
  )

  return (
    <section
      id="tienda"
      ref={sectionRef}
      aria-labelledby="tienda-title"
      className="theme-night relative isolate overflow-hidden bg-night pb-24 pt-20 text-on-night lg:pb-32 lg:pt-28"
    >
      {/* Fundido superior: empalma con la franja de datos sin costura */}
      <NightBackdrop fadeTop />
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div ref={headRef} className="max-w-[40rem]">
            <h2
              id="tienda-title"
              tabIndex={-1}
              className="text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-on-night focus:outline-none sm:text-[36px] lg:text-[44px]"
            >
              Tienda
            </h2>
            <p className="mt-4 text-[17px] leading-[1.6] text-on-night-soft">
              Lo que usamos y recomendamos en consulta: alimento, antiparasitarios e higiene. Arma tu pedido, envíalo por WhatsApp y te confirmamos el total.
            </p>
          </div>
          {count > 0 ? (
            <Button variant="night-secondary" size="sm" onClick={openCart} className="self-start lg:self-auto">
              <Icon icon={ShoppingBag} className="text-on-night-soft" />
              Ver carrito
              <span className="font-mono text-[13px] font-normal tabular-nums text-on-night-soft">
                {count} · {formatPrice(subtotal)}
              </span>
            </Button>
          ) : null}
        </div>

        <div className="mt-10">
          <CategoryFilter options={options} value={category} onChange={setCategory} />
        </div>

        <p className="sr-only" aria-live="polite">
          {`Mostrando ${visible.length} ${visible.length === 1 ? 'producto' : 'productos'} de ${activeLabel}`}
        </p>

        <ul ref={gridRef} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
