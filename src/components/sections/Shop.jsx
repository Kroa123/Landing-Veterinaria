import { useRef } from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import ProductGrid from '../shop/ProductGrid.jsx'
import { gsap, useGSAP, EASE } from '../motion/gsap.js'
import { getFeaturedProducts, products } from '../../data/products.js'
import { useCart } from '../../context/cart.js'
import { formatPrice } from '../../lib/formatPrice.js'

// Vitrina de la tienda dentro de una página (Inicio): productos destacados y enlace al
// catálogo completo (/tienda, con filtros, búsqueda y orden).
// Props:
//   featured  true: solo destacados (getFeaturedProducts); false: los primeros del catálogo
//   limit     cuántos productos mostrar (4)
export default function Shop({ featured = true, limit = 4 }) {
  const { count, subtotal, openCart } = useCart()
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const list = featured ? getFeaturedProducts(limit) : products.slice(0, limit)

  // Encabezado: entra una vez al llegar a la sección
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

  return (
    <section
      id="tienda"
      ref={sectionRef}
      aria-labelledby="tienda-title"
      className="band-leaf relative isolate overflow-hidden pb-24 pt-20 text-ink lg:pb-32 lg:pt-28"
    >
      {/* Banda verde suave de la tienda con huellas finas */}
      <div className="pattern-paws" aria-hidden="true" />
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div ref={headRef} className="max-w-[40rem]">
            <h2
              id="tienda-title"
              className="text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-ink sm:text-[36px] lg:text-[44px]"
            >
              {featured ? (
                <>
                  Destacados de la <span className="text-highlight">tienda</span>
                </>
              ) : (
                'Tienda'
              )}
            </h2>
            <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
              Lo que usamos y recomendamos en consulta: alimento, antiparasitarios e higiene. Arma tu pedido, envíalo por WhatsApp y te confirmamos el total.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 self-start lg:self-auto">
            {count > 0 ? (
              <Button variant="secondary" size="sm" onClick={openCart}>
                <Icon icon={ShoppingBag} className="text-ink-soft" />
                Ver carrito
                <span className="font-mono text-[13px] font-normal tabular-nums text-ink-soft">
                  {count} · {formatPrice(subtotal)}
                </span>
              </Button>
            ) : null}
          </div>
        </div>

        <ProductGrid products={list} className="mt-10" />

        <div className="mt-10 flex justify-center">
          <Button to="/tienda" variant="primary" size="lg">
            Ver toda la tienda
            <Icon icon={ArrowRight} />
          </Button>
        </div>
      </Container>
    </section>
  )
}
