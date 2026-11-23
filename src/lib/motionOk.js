// true si el dispositivo tiene puntero fino con hover y el usuario no pidió reducir el movimiento.
// Para efectos que siguen al cursor (botón magnético, tilt de tarjetas). Las media queries se crean una vez.
let queries = null

export function pointerMotionOk() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  queries ??= {
    fine: window.matchMedia('(hover: hover) and (pointer: fine)'),
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)'),
  }
  return queries.fine.matches && !queries.reduce.matches
}
