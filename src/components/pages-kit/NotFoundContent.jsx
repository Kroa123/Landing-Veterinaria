import { Link } from 'react-router-dom'
import { ArrowRight, Home, ShoppingBag } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import ChapitaMini3D from '../three/ChapitaMini3D.jsx'
import DayBackdrop from '../motion/DayBackdrop.jsx'
import { mainNav } from '../../data/navigation.js'

// Contenido de "no encontrado" (ruta inexistente o producto que ya no está).
// title/lede permiten adaptar el texto (p. ej. producto no encontrado).
export default function NotFoundContent({
  title = 'Esta página se nos perdió',
  lede = 'Puede que el enlace esté mal escrito o que la página ya no exista. Te dejamos los caminos más usados.',
}) {
  return (
    <section className="hero-sky relative isolate overflow-hidden">
      <DayBackdrop mood="calm" pattern="paws" fadeBottom />
      <Container className="grid min-h-[70svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:pb-24 lg:pt-36">
        <div>
          <p className="font-mono text-[14px] text-muted">Error 404</p>
          <h1 className="mt-3 max-w-[18ch] text-[36px] font-medium leading-[1.06] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
            {title}
          </h1>
          <p className="mt-5 max-w-[36rem] text-[18px] leading-[1.6] text-ink-soft">{lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/" size="lg">
              <Icon icon={Home} />
              Ir al inicio
            </Button>
            <Button to="/tienda" variant="secondary" size="lg">
              <Icon icon={ShoppingBag} />
              Ver la tienda
            </Button>
          </div>
          <nav aria-label="Otras páginas" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[15px]">
              {mainNav
                .filter((item) => item.to !== '/' && item.to !== '/tienda')
                .map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-brand underline-offset-4 hover:underline">
                      {item.label}
                      <Icon icon={ArrowRight} size={16} />
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
        <ChapitaMini3D className="mx-auto aspect-square w-full max-w-[22rem]" />
      </Container>
    </section>
  )
}
