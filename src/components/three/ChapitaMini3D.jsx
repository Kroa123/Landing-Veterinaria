import { lazy, Suspense, useRef } from 'react'
import ChapitaFallback from './ChapitaFallback.jsx'
import SceneBoundary from './SceneBoundary.jsx'
import { useScene3D } from './useScene3D.js'
import { usePointer } from '../../hooks/usePointer.js'
import { useInView } from '../../hooks/useInView.js'

// Mismo chunk 3D que el hero (scenes.js)
const ChapitaMiniScene = lazy(() => import('./scenes.js').then((m) => ({ default: m.ChapitaMiniScene })))

// Chapita V 3D chica y decorativa (404, Agendar). Mismos fallbacks que el hero:
// sin WebGL, reduced-motion, móvil modesto o contexto perdido → chapita SVG estática.
// El contenedor define el tamaño (className con alto/ancho).
export default function ChapitaMini3D({ className = '' }) {
  const wrapRef = useRef(null)
  const { enabled, onLost } = useScene3D()
  const pointerRef = usePointer()
  const inView = useInView(wrapRef)
  const fallback = <ChapitaFallback size="sm" />

  return (
    <div ref={wrapRef} className={`relative ${className}`} aria-hidden="true">
      {enabled ? (
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <ChapitaMiniScene active={inView} pointerRef={pointerRef} onLost={onLost} />
          </Suspense>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
