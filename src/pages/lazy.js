// Páginas con carga diferida: cada una es un chunk aparte. router.jsx las usa con
// `lazy` de React Router (la página anterior sigue visible mientras carga la nueva y la
// barra de progreso del layout avisa). Mismo import() en todos lados: Vite lo cachea, así
// que precargar en hover y la carga del router comparten la misma descarga.
export const pageLoaders = {
  home: () => import('./Home.jsx'),
  shop: () => import('./Shop.jsx'),
  productDetail: () => import('./ProductDetail.jsx'),
  services: () => import('./Services.jsx'),
  book: () => import('./Book.jsx'),
  about: () => import('./About.jsx'),
  contact: () => import('./Contact.jsx'),
  notFound: () => import('./NotFound.jsx'),
}

// Adaptador para route.lazy: el módulo exporta la página por defecto
export function lazyPage(name) {
  return () => pageLoaders[name]().then((m) => ({ Component: m.default }))
}

// Ruta interna ("/tienda/collar", "/nosotros#faq") → loader de su página, o null
function loaderFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return pageLoaders.home
  if (path === '/tienda') return pageLoaders.shop
  if (/^\/tienda\/[^/]+$/.test(path)) return pageLoaders.productDetail
  if (path === '/servicios') return pageLoaders.services
  if (path === '/agendar') return pageLoaders.book
  if (path === '/nosotros') return pageLoaders.about
  if (path === '/contacto') return pageLoaders.contact
  return null
}

// Precarga el chunk de una ruta (hover/focus de un enlace). Los errores se ignoran: si
// falla, la navegación real lo vuelve a intentar y muestra el error de ruta.
export function preloadPage(pathname) {
  const load = loaderFor(pathname)
  if (load) load().catch(() => {})
}
