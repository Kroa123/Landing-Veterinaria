// Detección de WebGL sin cargar three.js (vive en el bundle principal).
let cached = null

// true si hay WebGL acelerado. failIfMajorPerformanceCaveat descarta el render por software.
export function hasWebGL() {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const opts = { failIfMajorPerformanceCaveat: true }
    const gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts)
    cached = Boolean(gl)
    // Libera el contexto de prueba: los navegadores limitan los contextos activos
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

// Equipo modesto o ahorro de datos: en móvil se usa la chapita estática
export function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false
  const { connection, deviceMemory, hardwareConcurrency } = navigator
  return Boolean(
    connection?.saveData || (deviceMemory && deviceMemory <= 4) || (hardwareConcurrency && hardwareConcurrency <= 4),
  )
}
