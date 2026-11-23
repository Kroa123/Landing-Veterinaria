import { useEffect, useRef } from 'react'

// Posición del puntero en toda la ventana, normalizada de -1 a 1 (y hacia arriba positiva).
// Devuelve un ref (no estado): se lee dentro de un loop de animación sin provocar renders.
export function usePointer() {
  const ref = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e) {
      // Solo mouse: en táctil/lápiz el "puntero" salta con cada toque
      if (e.pointerType !== 'mouse') return
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    // Al salir de la ventana, vuelve suave al centro
    function onLeave() {
      ref.current.x = 0
      ref.current.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return ref
}
