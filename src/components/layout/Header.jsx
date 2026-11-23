import { useEffect, useRef, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { site } from '../../config/site.js'
import { useCart } from '../../context/cart.js'

export function CartButton({ className = '' }) {
  const { count, openCart, isOpen } = useCart()
  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
      data-cart-target=""
      className={`relative flex size-11 items-center justify-center rounded-control text-ink transition-[background-color,color,scale] hover:bg-raised active:scale-[0.94] ${className}`}
    >
      <Icon icon={ShoppingBag} />
      {count > 0 ? (
        <span
          key={count}
          className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pine px-1 font-mono text-[11px] font-medium leading-none tabular-nums text-white ring-2 ring-page motion-safe:animate-bump"
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

// Tono del header según el scroll (toda la página es noche):
// "top"   transparente sobre el hero,
// "night" barra noche con blur en cuanto hay scroll.
function useHeaderTone() {
  const [tone, setTone] = useState('top')

  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      setTone(window.scrollY < 12 ? 'top' : 'night')
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return tone
}

const TONES = {
  top: 'theme-night border-transparent bg-transparent',
  night:
    'theme-night border-night-line bg-night/90 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150 max-md:backdrop-blur-none max-md:backdrop-saturate-100 md:bg-night/75',
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollTone = useHeaderTone()
  // Con el menú móvil abierto sobre el hero, la barra necesita fondo propio
  const tone = menuOpen && scrollTone === 'top' ? 'night' : scrollTone
  const menuButtonRef = useRef(null)
  const { isOpen: cartOpen } = useCart()

  // Abrir el carrito cierra el menú móvil, así Esc solo tiene un destino.
  // Ajuste de estado durante el render (patrón recomendado por React, sin efecto).
  const [prevCartOpen, setPrevCartOpen] = useState(cartOpen)
  if (cartOpen !== prevCartOpen) {
    setPrevCartOpen(cartOpen)
    if (cartOpen) setMenuOpen(false)
  }

  // Esc cierra el menú móvil y devuelve el foco al botón
  useEffect(() => {
    if (!menuOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Si la ventana pasa a escritorio, el menú móvil se cierra
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    function onChange(e) {
      if (e.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    // -mb-16: el header (64 px) se superpone al hero oscuro, que reserva ese espacio arriba
    <header
      data-tone={tone}
      className={`sticky top-0 z-40 -mb-16 border-b transition-[background-color,border-color,box-shadow] duration-300 ${TONES[tone]}`}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#inicio" className="-ml-1 flex min-h-11 items-center rounded-control px-1" aria-label={`${site.name}, ir al inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-link flex min-h-11 items-center rounded-control px-3 text-[15px] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button href="#contacto" variant="night-primary" className="max-md:hidden">
            Agendar consulta
          </Button>
          <CartButton className="md:ml-2" />
          <button
            ref={menuButtonRef}
            type="button"
            className="flex size-11 items-center justify-center rounded-control text-ink transition-colors hover:bg-raised md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon icon={menuOpen ? X : Menu} />
          </button>
        </div>
      </Container>

      {/* Panel superpuesto (absolute): abrir o cerrar el menú no cambia el alto del header,
          así el scroll a la sección elegida no queda corrido */}
      <nav
        id="menu-movil"
        aria-label="Principal móvil"
        hidden={!menuOpen}
        className="theme-night absolute inset-x-0 top-full border-y border-night-line bg-night/95 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.45)] md:hidden"
      >
        <Container as="ul" className="flex flex-col py-2">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-control px-2 text-[16px] text-ink transition-colors hover:bg-raised active:bg-raised"
              >
                {item.label}
              </a>
            </li>
          ))}
        </Container>
      </nav>
    </header>
  )
}
