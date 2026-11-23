// Formato único de precio en todo el sitio: $24.990 (punto de miles, sin decimales).
// No depende de Intl para que el resultado sea idéntico en todos los navegadores.
export function formatPrice(value) {
  const n = Math.round(Number(value) || 0)
  const sign = n < 0 ? '-' : ''
  const digits = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${sign}$${digits}`
}
