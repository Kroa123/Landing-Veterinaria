import NotFoundContent from '../components/pages-kit/NotFoundContent.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'

// 404: cualquier ruta que no existe. Mensaje amable con la chapita 3D y enlaces útiles.
export default function NotFound() {
  usePageMeta({ title: 'Página no encontrada', description: 'La página que buscas no existe en el sitio de Valle Vet.', noindex: true })
  return <NotFoundContent />
}
