import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from '../components/motion/gsap.js'
import {
  focusWithoutScroll,
  getHashTarget,
  restoreScroll,
  scrollToElement,
  scrollToTop,
} from '../lib/scroll.js'

// Tiempo máximo para esperar a que exista el destino de un #hash (página lazy montándose)
const HASH_WAIT_MS = 5000
// Posiciones guardadas por entrada del historial (sobreviven a recargar la pestaña)
const STORAGE_KEY = 'vallevet:scroll'
const MAX_SAVED = 50

// Espera hasta HASH_WAIT_MS a que exista el destino de un hash. Devuelve cancelar.
function whenHashTarget(hash, cb, isCurrent) {
  const start = performance.now()
  let frame = 0
  function look() {
    frame = 0
    if (!isCurrent()) return
    const el = getHashTarget(hash)
    if (el) cb(el)
    else if (performance.now() - start < HASH_WAIT_MS) frame = requestAnimationFrame(look)
  }
  look()
  return () => cancelAnimationFrame(frame)
}

// Clave de la entrada del historial que React Router tiene en history.state ahora mismo.
// Sin estado (primera entrada de la pestaña) React Router usa 'default'.
function historyKey() {
  try {
    return window.history.state?.key ?? 'default'
  } catch {
    return 'default'
  }
}

// Clave para guardar la posición. La primera entrada de la pestaña tiene key 'default'
// (no es única): se distingue por su URL, así F5 en esa entrada también restaura.
function entryKey({ key, pathname, search }) {
  return key === 'default' ? `default:${pathname}${search}` : key
}

function loadPositions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Map(Array.isArray(list) ? list.filter((e) => Array.isArray(e) && typeof e[1] === 'number') : [])
  } catch {
    return new Map()
  }
}

function savePositions(map) {
  try {
    // Solo las últimas entradas
    const list = [...map].slice(-MAX_SAVED)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // sessionStorage no disponible (modo privado estricto): solo se pierde la restauración al recargar
  }
}

// Foco al navegar: el h1 de la página (o el <main>), sin mover el scroll.
// Así lectores de pantalla y teclado empiezan en el contenido nuevo.
function focusPage() {
  const main = document.getElementById('contenido')
  const heading = main?.querySelector('h1')
  focusWithoutScroll(heading || main)
}

// Scroll y foco en los cambios de ruta (compatible con Lenis):
// - ruta nueva: sube al inicio
// - Atrás/Adelante (o recarga): restaura la posición guardada de esa entrada, aunque la URL
//   tenga #hash; reintenta mientras la página crece (lib/scroll.js)
// - URL con #hash: lleva al ancla (suave en la misma página, inmediato al llegar de otra)
// - solo cambian los parámetros (?cat=, ?q=): no mueve nada ni recalcula ScrollTrigger
// - al cambiar de página (y en la carga inicial) recalcula ScrollTrigger
// En la carga inicial no roba el foco; si la URL trae hash, solo hace scroll.
export function useRouteScroll() {
  const location = useLocation()
  const navType = useNavigationType()
  const prev = useRef(null)
  const positions = useRef(null)
  if (positions.current === null) positions.current = loadPositions()

  // El navegador no restaura por su cuenta: lo hace este hook (con Lenis). ScrollTrigger
  // también queda en 'manual' (clearScrollMemory en motion/gsap.js), si no lo repone a 'auto'
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Recuerda la posición de cada entrada del historial; la persiste al salir de la pestaña.
  // Solo escribe mientras history.state siga siendo esta entrada: al navegar, history ya
  // cambió antes de que React desmonte este listener, y el scroll a 0 (o el recorte) de la
  // página nueva pisaba la posición de la anterior.
  const { key: locKey, pathname: locPath, search: locSearch } = location
  useEffect(() => {
    const key = locKey
    const store = entryKey({ key: locKey, pathname: locPath, search: locSearch })
    const isMine = () => historyKey() === key
    let frame = 0
    function record() {
      if (isMine()) positions.current.set(store, window.scrollY)
    }
    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        record()
      })
    }
    // Atrás/Adelante: history.state ya es la entrada de destino, pero el scroll todavía es
    // el de esta página (restauración manual): se guarda tal cual, antes de cualquier cambio
    function onPop() {
      cancelAnimationFrame(frame)
      frame = 0
      positions.current.set(store, window.scrollY)
    }
    function onHide() {
      record()
      savePositions(positions.current)
    }
    // Captura: corre antes que el listener de React Router
    window.addEventListener('popstate', onPop, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', onHide)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('popstate', onPop, true)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', onHide)
    }
  }, [locKey, locPath, locSearch])

  useEffect(() => {
    const { pathname, hash, key } = location
    const before = prev.current
    // StrictMode repite el efecto con la misma ubicación: no hace nada la segunda vez.
    // Por eso el trabajo diferido no se cancela en el cleanup: comprueba antes de actuar
    // que la ubicación siga siendo la misma.
    if (before?.key === key) return
    prev.current = { pathname, hash, key }
    const initial = before === null
    const pathChanged = !initial && before.pathname !== pathname
    // Misma página y mismo hash: solo cambiaron los parámetros (?cat=, ?q=)
    const paramsOnly = !initial && !pathChanged && before.hash === hash
    const current = () => prev.current?.key === key
    const saved = navType === 'POP' ? positions.current.get(entryKey(location)) : undefined

    if (saved != null && !paramsOnly) {
      // Atrás/Adelante o recarga: la posición guardada manda (también con #hash)
      restoreScroll(saved, { isCurrent: current })
      if (pathChanged) focusPage()
    } else if (hash) {
      whenHashTarget(
        hash,
        (el) => {
          scrollToElement(el, { immediate: initial || pathChanged, isCurrent: current })
          if (!initial) focusWithoutScroll(el)
        },
        current,
      )
    } else if (pathChanged) {
      scrollToTop()
      focusPage()
    }

    // La página nueva cambia alturas: los disparadores se recalculan al pintar.
    // Si solo cambiaron los parámetros (búsqueda, filtros) no hace falta.
    if (initial || pathChanged) {
      requestAnimationFrame(() => {
        if (current()) ScrollTrigger.refresh()
      })
    }
  }, [location, navType])
}
