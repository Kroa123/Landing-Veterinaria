import { useEffect, useState } from 'react'

// true mientras el elemento del ref está (aunque sea en parte) dentro del viewport.
// Sirve para pausar trabajo caro (render 3D) cuando no se ve.
export function useInView(ref, { rootMargin = '0px' } = {}) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  return inView
}
