import CartProvider from './context/CartContext.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import MobileBar from './components/layout/MobileBar.jsx'
import Hero from './components/sections/Hero.jsx'
import InfoStrip from './components/sections/InfoStrip.jsx'
import Shop from './components/sections/Shop.jsx'
import Stats from './components/sections/Stats.jsx'
import Services from './components/sections/Services.jsx'
import HowToBook from './components/sections/HowToBook.jsx'
import Team from './components/sections/Team.jsx'
import Testimonials from './components/sections/Testimonials.jsx'
import Faq from './components/sections/Faq.jsx'
import Contact from './components/sections/Contact.jsx'
import CartDrawer from './components/shop/CartDrawer.jsx'
import SmoothScroll from './components/motion/SmoothScroll.jsx'
import FlyToCart from './components/motion/FlyToCart.jsx'

export default function App() {
  return (
    <CartProvider>
      {/* Scroll suave (Lenis + ScrollTrigger); se apaga con prefers-reduced-motion */}
      <SmoothScroll />
      <a
        href="#contenido"
        className="sr-only rounded-control bg-ink px-4 py-3 text-[15px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <InfoStrip />
        <Shop />
        <Stats />
        <Services />
        <HowToBook />
        <Team />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <CartDrawer />
      <FlyToCart />
    </CartProvider>
  )
}
