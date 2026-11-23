import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cart.js'
import { getProduct } from '../data/products.js'

const STORAGE_KEY = 'vallevet.cart.v1'
const MAX_QTY = 20

function clampQty(value) {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(MAX_QTY, n)
}

// Lee el carrito guardado y descarta lo que no sea válido
// (productos que ya no existen, cantidades raras, JSON roto).
// Si un id aparece repetido, suma las cantidades.
function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const merged = new Map()
    for (const it of parsed) {
      if (!it || typeof it.id !== 'string' || !getProduct(it.id)) continue
      const prev = merged.get(it.id) || 0
      merged.set(it.id, Math.min(MAX_QTY, prev + clampQty(it.qty)))
    }
    return Array.from(merged, ([id, qty]) => ({ id, qty }))
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Modo privado o cuota llena: el carrito sigue funcionando en memoria
  }
}

function unitsLabel(n) {
  return `${n} ${n === 1 ? 'unidad' : 'unidades'}`
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)
  // n cambia en cada aviso para que el lector de pantalla repita mensajes iguales
  const [announcement, setAnnouncement] = useState({ text: '', n: 0 })

  const announce = useCallback((text) => {
    setAnnouncement((prev) => ({ text, n: prev.n + 1 }))
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  // Sincroniza el carrito entre pestañas abiertas.
  // e.key === null significa que se limpió todo el localStorage.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY || e.key === null) setItems(loadCart())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback(
    (id, qty = 1) => {
      const product = getProduct(id)
      if (!product) return
      const amount = clampQty(qty)
      const current = items.find((it) => it.id === id)?.qty || 0
      const next = Math.min(MAX_QTY, current + amount)
      setItems((prev) => {
        if (prev.some((it) => it.id === id)) {
          return prev.map((it) =>
            it.id === id ? { ...it, qty: Math.min(MAX_QTY, it.qty + amount) } : it,
          )
        }
        return [...prev, { id, qty: Math.min(MAX_QTY, amount) }]
      })
      announce(
        current === 0
          ? `${product.name} agregado al carrito`
          : `${product.name}: ${unitsLabel(next)} en el carrito`,
      )
    },
    [items, announce],
  )

  const increment = useCallback(
    (id) => {
      const product = getProduct(id)
      const current = items.find((it) => it.id === id)?.qty || 0
      if (!product || current === 0) return
      const next = Math.min(MAX_QTY, current + 1)
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, qty: Math.min(MAX_QTY, it.qty + 1) } : it)),
      )
      announce(`${product.name}: ${unitsLabel(next)}`)
    },
    [items, announce],
  )

  // Al bajar de 1 se quita la línea
  const decrement = useCallback(
    (id) => {
      const product = getProduct(id)
      const current = items.find((it) => it.id === id)?.qty || 0
      if (!product || current === 0) return
      setItems((prev) =>
        prev.flatMap((it) => {
          if (it.id !== id) return [it]
          return it.qty <= 1 ? [] : [{ ...it, qty: it.qty - 1 }]
        }),
      )
      announce(
        current <= 1
          ? `${product.name} quitado del carrito`
          : `${product.name}: ${unitsLabel(current - 1)}`,
      )
    },
    [items, announce],
  )

  const remove = useCallback(
    (id) => {
      const product = getProduct(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      if (product) announce(`${product.name} quitado del carrito`)
    },
    [announce],
  )

  const clear = useCallback(() => {
    setItems([])
    announce('Carrito vacío')
  }, [announce])

  // Al abrir o cerrar se limpia el aviso para no repetir uno viejo en la otra región
  const openCart = useCallback(() => {
    setAnnouncement((p) => ({ text: '', n: p.n }))
    setIsOpen(true)
  }, [])
  const closeCart = useCallback(() => {
    setAnnouncement((p) => ({ text: '', n: p.n }))
    setIsOpen(false)
  }, [])

  // Texto del aviso: un espacio duro alterno fuerza a releer un mensaje repetido
  const announcementText = announcement.text
    ? `${announcement.text}${announcement.n % 2 ? ' ' : ''}`
    : ''

  const value = useMemo(() => {
    const lines = items
      .map((it) => ({ product: getProduct(it.id), qty: it.qty }))
      .filter((l) => l.product)
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0)
    const qtyOf = (id) => items.find((it) => it.id === id)?.qty || 0
    return {
      lines,
      count,
      subtotal,
      qtyOf,
      maxQty: MAX_QTY,
      add,
      increment,
      decrement,
      remove,
      clear,
      isOpen,
      openCart,
      closeCart,
      announcement: announcementText,
    }
  }, [items, isOpen, add, increment, decrement, remove, clear, openCart, closeCart, announcementText])

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Aviso para lectores de pantalla. Con el carrito abierto (modal), el aviso vive dentro del panel */}
      <p className="sr-only" role="status" aria-live="polite">
        {isOpen ? '' : announcementText}
      </p>
    </CartContext.Provider>
  )
}
