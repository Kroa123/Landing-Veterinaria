import { useCallback, useEffect, useRef, useState } from 'react'
import { hasWebGL, isLowEndDevice } from './webgl.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

// Decide si una escena 3D se puede mostrar o hay que usar el fallback estático:
// - prefers-reduced-motion
// - sin WebGL acelerado (failIfMajorPerformanceCaveat)
// - móvil modesto (ahorro de datos, ≤ 4 GB o ≤ 4 núcleos)
// - contexto WebGL perdido (onLost)
// Devuelve { enabled, compact, onLost }.
export function useScene3D() {
  const reduced = useReducedMotion()
  const compact = useMediaQuery('(max-width: 1023px)')
  const [lost, setLost] = useState(false)
  // Al desmontar, R3F fuerza la pérdida del contexto: ese aviso no debe tocar el estado
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // event: el webglcontextlost del canvas. R3F fuerza la pérdida del contexto ~500 ms
  // después de desmontar un canvas (cambio de escena, se apagó por reduced-motion): para
  // entonces el canvas ya no está en el documento y ese aviso se ignora.
  const onLost = useCallback((event) => {
    if (!alive.current) return
    const canvas = event?.target
    if (canvas && canvas.isConnected === false) return
    setLost(true)
  }, [])

  // hasWebGL guarda el resultado: solo crea un contexto de prueba la primera vez
  const enabled = !reduced && !lost && !(compact && isLowEndDevice()) && hasWebGL()
  return { enabled, compact, onLost }
}
