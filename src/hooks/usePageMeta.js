import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../config/site.js'

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(attrs.rel ? 'link' : 'meta')
    for (const [k, v] of Object.entries(attrs)) if (k !== 'content' && k !== 'href') el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  if ('content' in attrs) el.setAttribute('content', attrs.content)
  if ('href' in attrs) el.setAttribute('href', attrs.href)
}

// Fija el título del documento ("Tienda · Valle Vet"), la meta description, la URL
// canónica y los títulos de Open Graph y Twitter. Sin title usa el título base del sitio.
// noindex: agrega <meta name="robots" content="noindex"> (404, producto inexistente) y lo
// quita al salir de la página.
// El <head> inicial lo genera siteHead() en vite.config.js; este hook solo lo actualiza
// al navegar entre páginas (Google ejecuta JS y lee los valores actualizados).
export function usePageMeta({ title, description, noindex = false } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${site.name}` : site.seo.title
    const text = description || site.seo.description
    const socialTitle = title ? fullTitle : site.seo.ogTitle
    const socialText = description || site.seo.ogDescription
    // Canonical sin barra final (salvo la raíz): /tienda/ y /tienda son la misma página
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '') || '/'
    const url = `${site.url}${path}`

    document.title = fullTitle
    setMeta('meta[name="description"]', { name: 'description', content: text })
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: url })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: socialTitle })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: socialText })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: socialTitle })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: socialText })
  }, [title, description, pathname])

  useEffect(() => {
    if (!noindex) return undefined
    setMeta('meta[name="robots"]', { name: 'robots', content: 'noindex' })
    return () => document.head.querySelector('meta[name="robots"]')?.remove()
  }, [noindex])
}
