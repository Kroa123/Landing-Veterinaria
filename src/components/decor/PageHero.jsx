import Container from '../ui/Container.jsx'
import Breadcrumbs from '../pages-kit/Breadcrumbs.jsx'
import DayBackdrop from '../motion/DayBackdrop.jsx'

const TONE_CLASS = {
  sky: 'hero-sky',
  leaf: 'hero-leaf',
  sun: 'hero-sun',
  coral: 'hero-coral',
  white: 'band-white',
  page: 'band-page',
}

/**
 * Encabezado de página interior (Tienda, Servicios, Agendar, Nosotros, Contacto, 404).
 * Fondo de banda clara con degradado suave y, opcionalmente, formas orgánicas animadas.
 * El título es el <h1> de la página. Sin animación de entrada propia (la de la ruta basta).
 *
 * @param {object}  props
 * @param {string}  [props.id]          id del <h1> (para aria-labelledby de la sección).
 * @param {string}  [props.eyebrow]     texto corto sobre el título (mono, brand).
 * @param {React.ReactNode} props.title título de la página.
 * @param {React.ReactNode} [props.lede] bajada (máx. ~36rem).
 * @param {{label: string, to?: string}[]} [props.breadcrumbs] ruta de navegación. El último
 *   ítem es la página actual (sin enlace, aria-current="page"). Se dibuja con pages-kit/Breadcrumbs.
 * @param {'sky'|'leaf'|'sun'|'coral'|'white'|'page'} [props.tone='sky'] fondo del encabezado.
 * @param {boolean|'fresh'|'warm'|'calm'} [props.shapes=true] formas animadas (DayBackdrop);
 *   false las quita, un string elige el mood.
 * @param {'none'|'dots'|'paws'} [props.pattern='none'] patrón fino sobre el fondo.
 * @param {'left'|'center'} [props.align='left']
 * @param {React.ReactNode} [props.aside] visual a la derecha (desde lg). Se apila debajo en móvil.
 * @param {React.ReactNode} [props.children] acciones (botones) bajo la bajada.
 * @param {string}  [props.className]
 */
export default function PageHero({
  id,
  eyebrow,
  title,
  lede,
  breadcrumbs,
  tone = 'sky',
  shapes = true,
  pattern = 'none',
  align = 'left',
  aside,
  children,
  className = '',
}) {
  const center = align === 'center' && !aside
  const mood = typeof shapes === 'string' ? shapes : 'fresh'
  const bandClass = TONE_CLASS[tone] || TONE_CLASS.sky
  return (
    <header className={`${bandClass} relative isolate overflow-hidden pb-14 pt-28 sm:pb-16 lg:pb-20 lg:pt-36 ${className}`}>
      {shapes ? <DayBackdrop mood={mood} pattern={pattern} fadeBottom /> : null}
      {!shapes && pattern !== 'none' ? <div className={`pattern-${pattern}`} aria-hidden="true" /> : null}
      <Container className={aside ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16' : ''}>
        <div className={center ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[44rem]'}>
          {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} center={center} /> : null}
          {eyebrow ? <p className={`eyebrow ${breadcrumbs?.length ? 'mt-6' : ''} ${center ? 'justify-center' : ''}`}>{eyebrow}</p> : null}
          <h1
            id={id}
            className="heading-display mt-4 text-[36px] text-ink sm:text-[48px] lg:text-[60px]"
          >
            {title}
          </h1>
          {lede ? (
            <p className={`mt-5 max-w-[36rem] text-[18px] leading-[1.6] text-ink-soft sm:text-[19px] ${center ? 'mx-auto' : ''}`}>
              {lede}
            </p>
          ) : null}
          {children ? (
            <div className={`mt-8 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>{children}</div>
          ) : null}
        </div>
        {aside ? <div className="relative">{aside}</div> : null}
      </Container>
    </header>
  )
}
