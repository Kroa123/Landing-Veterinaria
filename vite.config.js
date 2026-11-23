import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.js'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// "9:00" -> "09:00"
function pad(time) {
  const [h, m] = time.split(':')
  return `${h.padStart(2, '0')}:${m}`
}

// Texto para <title>: escapa & y <
function escapeText(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

// JSON dentro de <script>: escapa "<" para que ningún texto pueda cerrar la etiqueta
function safeJson(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
}

function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: site.name,
    description: `${site.tagline} para perros y gatos.`,
    url: `${site.url}/`,
    telephone: site.phone.href.replace(/^tel:/, ''),
    image: `${site.url}${site.seo.ogImage}`,
    priceRange: site.seo.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours
      .filter((h) => h.open)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => SCHEMA_DAYS[d]),
        opens: pad(h.open),
        closes: pad(h.close),
      })),
  }
}

// Genera el <head> (título, descripción, Open Graph, Twitter, canonical, JSON-LD)
// desde src/config/site.js, la única fuente de datos de la clínica.
function siteHead() {
  return {
    name: 'valle-vet-site-head',
    transformIndexHtml() {
      const { seo } = site
      const pageUrl = `${site.url}/`
      const image = `${site.url}${seo.ogImage}`
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })
      return [
        { tag: 'title', children: escapeText(seo.title), injectTo: 'head' },
        meta({ name: 'description', content: seo.description }),
        meta({ name: 'theme-color', content: seo.themeColor }),
        { tag: 'link', attrs: { rel: 'canonical', href: pageUrl }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:locale', content: seo.locale }),
        meta({ property: 'og:site_name', content: site.name }),
        meta({ property: 'og:title', content: seo.ogTitle }),
        meta({ property: 'og:description', content: seo.ogDescription }),
        meta({ property: 'og:url', content: pageUrl }),
        meta({ property: 'og:image', content: image }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ property: 'og:image:alt', content: `${site.name} · ${site.tagline}` }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:title', content: seo.ogTitle }),
        meta({ name: 'twitter:description', content: seo.ogDescription }),
        meta({ name: 'twitter:image', content: image }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: safeJson(buildJsonLd()),
          injectTo: 'head',
        },
      ]
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteHead()],
  build: {
    // Nada en línea como data: (fuentes incluidas): la CSP solo permite font-src 'self'
    assetsInlineLimit: 0,
  },
})
