import { lazy, Suspense, useRef } from 'react'
import SceneBoundary from './SceneBoundary.jsx'
import { useScene3D } from './useScene3D.js'
import ProductPackage from '../shop/ProductPackage.jsx'
import { useInView } from '../../hooks/useInView.js'

// Mismo chunk 3D que el hero (scenes.js)
const ProductViewerScene = lazy(() => import('./scenes.js').then((m) => ({ default: m.ProductViewerScene })))

// Visor del empaque en el detalle de producto. Con WebGL: modelo 3D que gira solo y se
// arrastra para verlo por todos lados. Sin WebGL, con reduced-motion, en móvil modesto o si
// se pierde el contexto: el empaque SVG de siempre (ProductPackage). Pausa fuera de pantalla.
// El contenedor define el alto (el canvas lo llena).
export default function ProductViewer3D({ product, className = '' }) {
  const wrapRef = useRef(null)
  const { enabled, onLost } = useScene3D()
  const inView = useInView(wrapRef, { rootMargin: '100px' })

  const fallback = (
    <div className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <ProductPackage product={product} className="block h-auto max-h-full w-full max-w-[320px]" />
    </div>
  )

  return (
    <div ref={wrapRef} className={`relative h-full w-full ${className}`}>
      {enabled ? (
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            {/* El canvas no tiene texto propio: el nombre está en el h1 de la página */}
            <div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              role="img"
              aria-label={`Vista 3D del empaque de ${product.name}, ${product.size}. Arrastra para girarlo.`}
            >
              <ProductViewerScene product={product} active={inView} onLost={onLost} />
            </div>
          </Suspense>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
