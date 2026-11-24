import { RouterProvider } from 'react-router-dom'
import CartProvider from './context/CartContext.jsx'
import { router } from './router.jsx'

// El carrito envuelve todo el router: persiste entre páginas.
// React Router 7: las navegaciones usan startTransition por defecto (la página anterior
// sigue visible hasta que la nueva, lazy, está lista).
export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
