import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Home, RefreshCw } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { site } from '../../config/site.js'

// Falló el import dinámico de una página (típico después de publicar una versión nueva:
// el chunk viejo ya no existe). Mensajes de Chrome/Edge, Safari, Firefox y webpack.
const CHUNK_ERROR =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i

function isChunkLoadError(error) {
  if (!error) return false
  if (error.name === 'ChunkLoadError') return true
  return CHUNK_ERROR.test(String(error.message || error))
}

// Error de ruta. Dos lugares (router.jsx):
// - inLayout: error de una página; se muestra dentro del layout (header y footer siguen)
// - sin inLayout: falló el layout mismo; ocupa toda la pantalla y no depende de él
// Si el error es de carga de chunk, ofrece recargar (versión nueva); si no, un mensaje
// genérico con enlace a Inicio.
export default function RouteError({ inLayout = false }) {
  const error = useRouteError()
  // Solo en desarrollo: el detalle ayuda a depurar
  if (import.meta.env.DEV) console.error(error)

  const chunk = isChunkLoadError(error)
  const notFound = isRouteErrorResponse(error) && error.status === 404

  let title = 'Algo salió mal al mostrar esta página'
  let text = 'Fue un error nuestro. Puedes volver al inicio o intentar de nuevo en un momento.'
  if (chunk) {
    title = 'No pudimos cargar esta página'
    text = 'Puede ser la conexión o que publicamos una versión nueva del sitio. Recarga la página para seguir.'
  } else if (notFound) {
    title = 'Esta página no existe'
    text = 'Puede que el enlace esté mal escrito o que la página ya no exista.'
  }

  const body = (
    <Container className="max-w-[40rem]">
      <p className="font-mono text-[13px] text-muted">{site.name}</p>
      <h1 className="mt-3 text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">{title}</h1>
      <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {chunk ? (
          <Button onClick={() => window.location.reload()} size="lg">
            <Icon icon={RefreshCw} />
            Recargar
          </Button>
        ) : inLayout ? (
          <Button to="/" size="lg">
            <Icon icon={Home} />
            Ir al inicio
          </Button>
        ) : null}
        {/* Fuera del layout (o con chunk viejo) se recarga el documento al ir al inicio */}
        {chunk || !inLayout ? (
          <Link
            to="/"
            reloadDocument
            className="inline-flex min-h-12 items-center rounded-control px-4 text-[15px] font-medium text-brand underline underline-offset-4"
          >
            Ir al inicio
          </Link>
        ) : null}
      </div>
    </Container>
  )

  // Dentro del layout ya existe <main id="contenido">
  if (inLayout) {
    return <section className="flex min-h-[70svh] items-center bg-page py-24 lg:py-32">{body}</section>
  }

  return <main id="contenido" className="flex min-h-svh items-center bg-page py-24">{body}</main>
}
