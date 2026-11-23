import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// Lectura directa, fuera de React (efectos, utilidades)
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && getSnapshot()
}

// true si el usuario pidió reducir el movimiento. Se actualiza en vivo.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
