import { useEffect } from 'react'
import { preloadPage } from '../pages/lazy.js'

// Precarga el chunk de una página cuando el puntero pasa sobre un enlace interno o el
// enlace recibe el foco (teclado). Un solo listener delegado para todo el documento.
export function usePreloadLinks() {
  useEffect(() => {
    const done = new Set()

    function onIntent(e) {
      const link = e.target.closest?.('a[href]')
      if (!link) return
      const raw = link.getAttribute('href')
      if (!raw || raw.startsWith('#')) return
      let url
      try {
        url = new URL(raw, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (done.has(url.pathname)) return
      done.add(url.pathname)
      preloadPage(url.pathname)
    }

    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent)
    return () => {
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
    }
  }, [])
}
