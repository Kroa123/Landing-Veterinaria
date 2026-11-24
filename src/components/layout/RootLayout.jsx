import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MobileBar from './MobileBar.jsx'
import PageFallback from './PageFallback.jsx'
import NavigationProgress from './NavigationProgress.jsx'
import CartDrawer from '../shop/CartDrawer.jsx'
import SmoothScroll from '../motion/SmoothScroll.jsx'
import FlyToCart from '../motion/FlyToCart.jsx'
import { useRouteScroll } from '../../hooks/useRouteScroll.js'
import { usePreloadLinks } from '../../hooks/usePreloadLinks.js'
import { focusWithoutScroll, jumpToElement } from '../../lib/scroll.js'

// Skip link: lleva el foco y el scroll al <main> sin cambiar el hash (el #contenido nativo
// agregaba una entrada al historial). Funciona igual con Lenis o con scroll nativo.
function skipToContent(e) {
  const main = document.getElementById('contenido')
  if (!main) return
  e.preventDefault()
  jumpToElement(main)
  focusWithoutScroll(main)
}

// Layout común de todas las páginas: header, contenido de la ruta, footer, barra móvil,
// carrito (global, persiste entre páginas) y vuelo al carrito.
// hydrating: carga inicial, mientras llega el chunk de la primera página (router.jsx).
export default function RootLayout({ hydrating = false }) {
  // Scroll al inicio / al #ancla / posición guardada y foco en cada cambio de ruta
  useRouteScroll()
  // Precarga el chunk de la página de destino en hover/foco de un enlace
  usePreloadLinks()

  return (
    <>
      {/* Scroll suave (Lenis + ScrollTrigger); se apaga con prefers-reduced-motion */}
      <SmoothScroll />
      <NavigationProgress />
      <a
        href="#contenido"
        onClick={skipToContent}
        className="sr-only rounded-control bg-ink px-4 py-3 text-[15px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<PageFallback />}>{hydrating ? <PageFallback /> : <Outlet />}</Suspense>
      </main>
      <Footer />
      <MobileBar />
      <CartDrawer />
      <FlyToCart />
    </>
  )
}
