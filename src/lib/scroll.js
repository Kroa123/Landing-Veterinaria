// Scroll del sitio: guarda la instancia de Lenis (si existe) y ofrece helpers que
// funcionan igual con Lenis o con el scroll nativo (prefers-reduced-motion).
//
// Lenis recorta todo destino con su `limit` (alto scrolleable), que solo se recalcula con
// un ResizeObserver con debounce. Al cambiar de página el limit todavía es el de la página
// anterior: por eso cada helper llama a lenis.resize() antes de scrollTo.

let lenis = null

export function setLenis(instance) {
  lenis = instance
}

// Tiempo máximo para esperar a que la página crezca (secciones lazy, imágenes, fuentes)
const SETTLE_MS = 4000

// Sube al inicio de la página. immediate: sin animación (cambio de ruta).
export function scrollToTop({ immediate = true } = {}) {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(0, { immediate, force: true })
    return
  }
  window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'instant' : 'smooth' })
}

// Salta sin animación a una posición vertical
export function scrollToY(y) {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(y, { immediate: true, force: true })
    return
  }
  window.scrollTo({ top: y, left: 0, behavior: 'instant' })
}

// Repite un salto en cada frame mientras la página siga creciendo, hasta que done() sea
// true, pase el tiempo máximo, la ubicación deje de ser la actual o la persona haga scroll
// por su cuenta (rueda, toque, teclado). Devuelve una función para cancelar.
function settle(getY, { done = () => false, isCurrent = () => true, timeout = SETTLE_MS } = {}) {
  const start = performance.now()
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown']
  let frame = 0
  let stopped = false
  let lastY = null
  let lastHeight = -1

  function stop() {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    for (const type of events) window.removeEventListener(type, stop, true)
  }

  function step() {
    frame = 0
    if (stopped) return
    if (!isCurrent()) return stop()
    const y = Math.max(0, Math.round(getY()))
    const height = document.documentElement.scrollHeight
    // Solo vuelve a saltar si cambió el destino, el alto o la posición quedó corta
    if (y !== lastY || height !== lastHeight || Math.abs(window.scrollY - y) > 1) {
      lastY = y
      lastHeight = height
      scrollToY(y)
    }
    if (done(y) || performance.now() - start > timeout) return stop()
    frame = requestAnimationFrame(step)
  }

  for (const type of events) window.addEventListener(type, stop, { capture: true, passive: true })
  step()
  return stop
}

// Restaura una posición guardada (Atrás/Adelante). La página nueva puede no tener aún el
// alto necesario (secciones lazy de Inicio): reintenta hasta que
// scrollHeight >= y + innerHeight y la posición quede aplicada.
export function restoreScroll(y, { isCurrent } = {}) {
  return settle(() => y, {
    isCurrent,
    done: () =>
      document.documentElement.scrollHeight >= y + window.innerHeight && Math.abs(window.scrollY - y) <= 1,
  })
}

// Elemento de un hash ("#faq") o null. decodeURIComponent puede fallar con hashes rotos.
export function getHashTarget(hash) {
  if (!hash || hash.length < 2) return null
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return null
  }
}

// Posición de documento que deja el elemento bajo el header
// (scroll-padding-top del documento + scroll-margin-top del elemento)
function elementTop(el) {
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  return el.getBoundingClientRect().top + window.scrollY - pad - margin
}

// Salta sin animación a un elemento, una sola vez (skip link "Saltar al contenido")
export function jumpToElement(el) {
  if (el) scrollToY(Math.max(0, Math.round(elementTop(el))))
}

// Lleva el elemento bajo el header.
// - suave (misma página): un solo scroll animado
// - immediate (al llegar de otra página o en la carga inicial): salta y sigue corrigiendo
//   mientras el contenido de arriba crece (secciones lazy), hasta SETTLE_MS o hasta que la
//   persona haga scroll. Devuelve una función para cancelar.
export function scrollToElement(el, { immediate = false, isCurrent } = {}) {
  if (!el) return () => {}
  if (immediate) return settle(() => elementTop(el), { isCurrent })
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(el, { force: true, duration: 1.1 })
    return () => {}
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return () => {}
}

// Mueve el foco a un elemento sin desplazar la página. Si no es enfocable, se le da
// tabindex="-1" temporal (se quita al salir), como hace el navegador con un ancla.
export function focusWithoutScroll(el) {
  if (!el) return
  if (!el.hasAttribute('tabindex') && !el.matches('a[href], button, input, select, textarea')) {
    el.setAttribute('tabindex', '-1')
    el.setAttribute('data-anchor-focus', '')
    el.addEventListener(
      'blur',
      () => {
        el.removeAttribute('tabindex')
        el.removeAttribute('data-anchor-focus')
      },
      { once: true },
    )
  }
  el.focus({ preventScroll: true })
}
