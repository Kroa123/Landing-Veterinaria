import { useRef } from 'react'
import { Check, MapPin, Plus } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import ProductPackage from '../shop/ProductPackage.jsx'
import HeroVisual from '../three/HeroVisual.jsx'
import NightBackdrop from '../motion/NightBackdrop.jsx'
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE } from '../motion/gsap.js'
import { useCart } from '../../context/cart.js'
import { getProduct } from '../../data/products.js'
import { formatPrice } from '../../lib/formatPrice.js'
import { site } from '../../config/site.js'

// Paciente de ejemplo para la ficha del hero
const patient = {
  file: 'Ficha 0482',
  name: 'Luna',
  species: 'Perra · Border Collie mestiza',
  vet: 'Dra. Paula Rojas',
  rows: [
    { label: 'Próxima vacuna', value: '03 dic 2026', note: 'Óctuple, refuerzo', highlight: true },
    { label: 'Antiparasitario', value: '01 dic 2026', note: 'Dosis mensual' },
  ],
  recommendedId: 'antiparasitario-masticable-10-20',
}


// Ficha de paciente: tarjeta de vidrio flotando sobre la escena, con el producto indicado
function PatientCard() {
  const { add, qtyOf, openCart } = useCart()
  const product = getProduct(patient.recommendedId)
  // Si el producto recomendado deja de existir en el catálogo, la ficha no se muestra
  if (!product) return null
  const inCart = qtyOf(product.id) > 0

  // Agrega al carrito; FlyToCart detecta el clic y anima el vuelo hasta el icono
  function onAdd() {
    add(product.id)
  }

  return (
    <div className="rounded-panel border border-night-line bg-night-raised/85 p-4 text-on-night shadow-[0_24px_60px_rgb(0_0_0/0.45)] backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between font-mono text-[12px] leading-4 text-on-night-soft">
        <span>{patient.file}</span>
        <span>{site.name}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mint/15 text-[17px] font-medium text-mint"
          aria-hidden="true"
        >
          L
        </div>
        <div className="min-w-0">
          <p className="text-[19px] font-medium leading-tight tracking-[-0.01em]">{patient.name}</p>
          <p className="mt-0.5 truncate text-[13px] leading-5 text-on-night-soft">{patient.species}</p>
        </div>
      </div>

      <dl className="mt-3 divide-y divide-night-line border-y border-night-line">
        {patient.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-[14px] text-on-night">
              {row.label}
              <span className="block text-[12px] leading-4 text-on-night-soft">{row.note}</span>
            </dt>
            <dd className={`font-mono text-[14px] tabular-nums ${row.highlight ? 'font-medium text-mint' : 'text-on-night'}`}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Producto recomendado: el puente entre la consulta y la tienda */}
      <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3">
        <ProductPackage product={product} className="block h-auto w-full drop-shadow-[0_8px_10px_rgb(0_0_0/0.35)]" />
        <div className="min-w-0">
          <p className="text-[12px] leading-4 text-on-night-soft">Indicado por {patient.vet}</p>
          <p className="mt-1 text-[15px] font-medium leading-5">{product.name}</p>
          <p className="mt-1 font-mono text-[15px] font-medium tabular-nums text-on-night">{formatPrice(product.price)}</p>
        </div>
      </div>
      {inCart ? (
        <Button variant="night-secondary" onClick={openCart} magnetic={false} className="mt-3 w-full">
          <Icon icon={Check} />
          En el carrito · ver pedido
        </Button>
      ) : (
        <Button variant="night-primary" onClick={onAdd} magnetic={false} className="mt-3 w-full">
          <Icon icon={Plus} />
          Agregar al carrito
        </Button>
      )}
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const copyRef = useRef(null)
  const visualRef = useRef(null)
  const cardRef = useRef(null)
  // Progreso de salida del hero (0 arriba → 1 cuando el hero ya salió); lo lee la escena 3D
  const progressRef = useRef(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Titular por líneas, cada una sale de su máscara
        SplitText.create(titleRef.current, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.09, ease: EASE, delay: 0.1 }),
        })
        gsap.from('[data-hero-fade]', { opacity: 0, y: 24, duration: 0.9, stagger: 0.08, ease: EASE, delay: 0.45 })
        gsap.from(visualRef.current, { opacity: 0, scale: 0.94, duration: 1.6, ease: EASE })
        gsap.from(cardRef.current, { opacity: 0, y: 40, duration: 1, ease: EASE, delay: 0.85 })

        // Al salir, el texto sube un poco más lento que el scroll
        gsap.to(copyRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-night text-on-night"
    >
      {/* El header (transparente, -mb-16) queda encima: pt ≥ 64 px. Abajo, la franja de datos
          se monta ~48 px sobre el hero: pb amplio y sin z-index propio en la sección */}
      <NightBackdrop fadeBottom />
      <Container className="grid gap-8 pb-24 pt-20 sm:pb-28 lg:min-h-[min(100svh,960px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-6 lg:gap-y-0 lg:pb-28 lg:pt-24">
        {/* Escena: arriba en móvil, a la derecha y sangrando en escritorio */}
        <div
          ref={visualRef}
          aria-hidden="true"
          className="relative order-first h-[min(84vw,380px)] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto"
        >
          <div className="absolute -inset-x-5 inset-y-0 sm:-inset-x-6 lg:-left-6 lg:-right-24 lg:-inset-y-12">
            <HeroVisual sectionRef={sectionRef} progressRef={progressRef} />
          </div>
        </div>

        <div ref={copyRef} className="relative z-10 self-center lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <h1
            id="hero-title"
            ref={titleRef}
            className="max-w-[15ch] text-[38px] font-medium leading-[1.06] tracking-[-0.03em] text-on-night sm:text-[48px] lg:max-w-[17ch] lg:text-[60px] lg:leading-[1.03]"
          >
            La consulta de tu perro o gato y su alimento, en el mismo lugar
          </h1>
          <p data-hero-fade className="mt-6 max-w-[36rem] text-[18px] leading-[1.6] text-on-night-soft lg:text-[19px]">
            Agenda control, vacunas o esterilización y llévate el alimento y el antiparasitario que te indicó el veterinario. Pide por WhatsApp y te lo despachamos en el día dentro de la comuna.
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Button href="#contacto" variant="night-primary" size="lg">
              Agendar consulta
            </Button>
            <Button href="#tienda" variant="night-secondary" size="lg">
              Ver tienda
            </Button>
          </div>
          <p data-hero-fade className="mt-8 flex items-center gap-2 text-[14px] leading-5 text-on-night-soft">
            <Icon icon={MapPin} />
            {site.address.street}
          </p>
        </div>

        <div
          ref={cardRef}
          className="relative z-10 w-full max-w-[24rem] lg:col-start-2 lg:row-start-2 lg:mb-0 lg:max-w-[19rem] lg:justify-self-end"
        >
          <PatientCard />
        </div>
      </Container>
    </section>
  )
}
