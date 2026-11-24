import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { site } from '../../config/site.js'
import { useCart } from '../../context/cart.js'
import { bookPath, mainNav } from '../../data/navigation.js'

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
          className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-mono text-[11px] font-medium leading-none tabular-nums text-white ring-2 ring-card motion-safe:animate-bump"
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

// Tono del header según el scroll:
// "top"   transparente sobre el hero / encabezado de página (fondos claros: texto ink),
// "solid" barra blanca translúcida con hairline, sombra suave y blur en cuanto hay scroll.
function useHeaderTone() {
  const [tone, setTone] = useState('top')

  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      setTone(window.scrollY < 12 ? 'top' : 'solid')
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

// Blur solo desde tablet (en móvil cuesta demasiado): ahí el fondo es casi opaco
const TONES = {
  top: 'border-transparent bg-transparent',
  solid:
    'border-line bg-card/95 shadow-soft md:bg-card/90 md:backdrop-blur-xl md:backdrop-saturate-150',
}

// Clases del enlace de navegación según si es la ruta actual (NavLink pone aria-current="page").
// Activo: texto ink + peso medio + barra brand fija debajo (styles.css: .nav-link.is-active).
function navClass({ isActive }) {
  return `nav-link flex min-h-11 items-center rounded-control px-3 text-[15px] transition-colors hover:text-ink ${
    isActive ? 'is-active font-medium text-ink' : 'text-ink-soft'
  }`
}

function mobileNavClass({ isActive }) {
  return `mobile-nav-link flex min-h-12 items-center rounded-control px-3 text-[16px] ${
    isActive ? 'is-active font-semibold' : 'text-ink hover:bg-raised active:bg-raised'
  }`
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const scrollTone = useHeaderTone()
  // Con el menú móvil abierto sobre el hero, la barra necesita fondo propio
  const tone = menuOpen && scrollTone === 'top' ? 'solid' : scrollTone

  // Cambiar de ruta cierra el menú móvil (ajuste de estado durante el render, sin efecto)
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setMenuOpen(false)
  }
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
    // -mb-16: el header (64 px) se superpone al primer bloque de cada página (hero o
    // encabezado de página), que reserva ese espacio arriba (pt ≥ 64 px)
    <header
      data-tone={tone}
      className={`sticky top-0 z-40 -mb-16 border-b transition-[background-color,border-color,box-shadow] duration-300 ${TONES[tone]}`}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="-ml-1 flex min-h-11 items-center rounded-control px-1" aria-label={`${site.name}, ir al inicio`}>
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button to={bookPath} variant="primary" className="max-md:hidden" aria-current={pathname === bookPath ? 'page' : undefined}>
            Agendar
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

      {/* Panel superpuesto (absolute): abrir o cerrar el menú no cambia el alto del header */}
      <nav
        id="menu-movil"
        aria-label="Principal móvil"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full border-y border-line bg-card shadow-float md:hidden"
      >
        <Container as="ul" className="flex flex-col py-2">
          {mainNav.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={mobileNavClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to={bookPath} onClick={() => setMenuOpen(false)} className={mobileNavClass}>
              Agendar consulta
            </NavLink>
          </li>
        </Container>
      </nav>
    </header>
  )
}
