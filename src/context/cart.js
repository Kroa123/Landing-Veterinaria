import { createContext, useContext } from 'react'

// Contexto y hook separados del proveedor para que Fast Refresh funcione bien.
export const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
