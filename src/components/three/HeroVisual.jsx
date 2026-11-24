import { lazy, Suspense } from 'react'
import ChapitaFallback from './ChapitaFallback.jsx'
import SceneBoundary from './SceneBoundary.jsx'
import { useScene3D } from './useScene3D.js'
import { usePointer } from '../../hooks/usePointer.js'
import { useInView } from '../../hooks/useInView.js'

// three.js, R3F y drei viven solo en el chunk 3D (scenes.js, compartido con los otros visores)
const HeroScene = lazy(() => import('./scenes.js').then((m) => ({ default: m.HeroScene })))

// Visual del hero: escena 3D si hay WebGL acelerado y movimiento permitido; si no, chapita SVG estática.
// También cae al SVG en móvil modesto (ahorro de datos, ≤ 4 GB o ≤ 4 núcleos) y si se pierde el contexto WebGL.
// sectionRef: la sección del hero (pausa el render cuando sale de pantalla).
// progressRef: progreso de salida del hero (0 → 1), lo escribe el ScrollTrigger del Hero.
export default function HeroVisual({ sectionRef, progressRef }) {
  const { enabled, compact, onLost } = useScene3D()
  const pointerRef = usePointer()
  const inView = useInView(sectionRef)
  // En escritorio la chapita va arriba a la izquierda, como en la escena: la ficha ocupa abajo a la derecha
  const fallback = <ChapitaFallback className="lg:items-start lg:justify-start lg:pl-[10%] lg:pt-[12%]" />

  if (!enabled) return fallback

  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <HeroScene active={inView} compact={compact} pointerRef={pointerRef} progressRef={progressRef} onLost={onLost} />
      </Suspense>
    </SceneBoundary>
  )
}
