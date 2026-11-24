import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Espera antes de mostrar la barra: si el chunk ya estaba en caché no aparece
const SHOW_DELAY = 120
// Tiempo de la salida (completa y se desvanece) antes de volver a reposo
const HIDE_AFTER = 450

// Estilo de cada fase. Solo transform (scaleX) y opacity.
// idle: oculta · start: aparece corta · run: avanza lento hacia 85 % · done: completa y se va
const PHASES = {
  idle: { transform: 'scaleX(0)', opacity: 0, transition: 'none' },
  start: { transform: 'scaleX(0.08)', opacity: 1, transition: 'none' },
  run: { transform: 'scaleX(0.85)', opacity: 1, transition: 'transform 4s cubic-bezier(0.08, 0.7, 0.2, 1)' },
  done: { transform: 'scaleX(1)', opacity: 0, transition: 'transform 200ms ease-out, opacity 250ms ease 150ms' },
}
// prefers-reduced-motion: sin animación, la barra aparece llena y desaparece
const PHASES_REDUCED = {
  idle: PHASES.idle,
  start: { transform: 'scaleX(1)', opacity: 1, transition: 'none' },
  run: { transform: 'scaleX(1)', opacity: 1, transition: 'none' },
  done: { transform: 'scaleX(1)', opacity: 0, transition: 'none' },
}

// Barra fina arriba mientras React Router carga la página siguiente (chunk lazy).
// La página actual sigue visible; la barra es el único aviso. Para lectores de pantalla
// es un progressbar indeterminado con nombre, solo mientras carga.
export default function NavigationProgress() {
  const { state } = useNavigation()
  const busy = state !== 'idle'
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    let timer = 0
    let frame = 0
    if (busy) {
      timer = window.setTimeout(() => {
        setPhase('start')
        // Dos frames: el navegador pinta "start" antes de animar hacia "run"
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => setPhase('run'))
        })
      }, SHOW_DELAY)
    } else {
      frame = requestAnimationFrame(() => setPhase((p) => (p === 'idle' ? p : 'done')))
      timer = window.setTimeout(() => setPhase('idle'), HIDE_AFTER)
    }
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [busy])

  const visible = phase === 'start' || phase === 'run'
  const style = (reduced ? PHASES_REDUCED : PHASES)[phase]

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]" aria-hidden={visible ? undefined : 'true'}>
      <div
        role={visible ? 'progressbar' : undefined}
        aria-label={visible ? 'Cargando página' : undefined}
        className="h-full w-full origin-left bg-brand will-change-transform"
        style={style}
      />
    </div>
  )
}
