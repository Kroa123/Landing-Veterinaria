import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout.jsx'
import RouteError from './components/layout/RouteError.jsx'
import { lazyPage } from './pages/lazy.js'

// Rutas del sitio (contrato en docs/DESIGN_DIRECTION.md, sección v4).
// El servidor reescribe toda URL (salvo /assets/) a /index.html (vercel.json y netlify.toml).
// - Páginas con `lazy` de React Router: al navegar, la página actual sigue visible hasta que
//   el chunk nuevo está listo (useNavigation().state === 'loading' → barra de progreso).
// - Carga inicial: mientras llega el chunk de la primera página se muestra el mismo layout
//   con un bloque "Cargando…" (hydrateFallbackElement, mismo componente: no se remonta).
// - Errores: los de una página se muestran dentro del layout (ruta sin path con
//   errorElement); si falla el layout mismo, el errorElement de la raíz ocupa todo.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    hydrateFallbackElement: <RootLayout hydrating />,
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError inLayout />,
        children: [
          { index: true, lazy: lazyPage('home') },
          { path: 'tienda', lazy: lazyPage('shop') },
          { path: 'tienda/:slug', lazy: lazyPage('productDetail') },
          { path: 'servicios', lazy: lazyPage('services') },
          { path: 'agendar', lazy: lazyPage('book') },
          { path: 'nosotros', lazy: lazyPage('about') },
          { path: 'contacto', lazy: lazyPage('contact') },
          { path: '*', lazy: lazyPage('notFound') },
        ],
      },
    ],
  },
])
