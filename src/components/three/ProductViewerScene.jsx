import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { PackModel, StudioLights } from './parts.jsx'
import { PACK_VIEWER, useLabelTexture } from './labels.js'

// Visor 3D del empaque de un producto (chunk 3D, se carga con React.lazy desde scenes.js).
// Forma según product.pack (bolsa con fuelle, caja, frasco, colgador de accesorio),
// color de su categoría y etiqueta con marca, nombre y presentación en CanvasTexture.
// Gira solo y lento; se arrastra con OrbitControls (sin zoom ni pan, ángulo vertical
// limitado). En táctil, el gesto vertical sigue haciendo scroll de la página.
//
// Props:
//   product  producto del catálogo
//   active   false pausa el render (visor fuera de pantalla)
//   onLost   se llama si el navegador pierde el contexto WebGL (el padre muestra el fallback)

// Leve flotación del empaque (el giro lo hace OrbitControls con autoRotate)
function Bob({ children }) {
  const group = useRef(null)
  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.y = Math.sin(t * 0.9) * 0.04
    g.rotation.z = Math.sin(t * 0.6) * 0.02
  })
  return <group ref={group}>{children}</group>
}

function Package({ product }) {
  const label = useMemo(
    () => ({
      brand: product.brand,
      name: product.name,
      size: product.size,
      ink: (PACK_VIEWER[product.category] || PACK_VIEWER.alimento).ink,
    }),
    [product.brand, product.name, product.size, product.category],
  )
  // 640 px de ancho: texto nítido aunque el visor ocupe media pantalla con dpr 2
  const texture = useLabelTexture(label, 'product', 640)
  return <PackModel shape={product.pack} category={product.category} texture={texture} variant="product" />
}

// Controles: sin zoom ni pan, giro vertical acotado, autorrotación lenta.
// En táctil se cambia touch-action a pan-y: arrastrar en horizontal gira el empaque y
// en vertical la página sigue bajando (OrbitControls por defecto bloquea todo el gesto).
function Controls() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current?.domElement
    if (el) el.style.touchAction = 'pan-y'
  }, [])
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      autoRotate
      autoRotateSpeed={1.4}
      minPolarAngle={Math.PI * 0.34}
      maxPolarAngle={Math.PI * 0.6}
    />
  )
}

export default function ProductViewerScene({ product, active = true, onLost }) {
  return (
    <Canvas
      className="product-viewer-scene"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 4.6], fov: 30, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => onLost?.(e), { once: true })
      }}
    >
      <StudioLights />
      {/* Luz de contorno desde atrás: separa la silueta del empaque del fondo claro */}
      <directionalLight position={[-2.5, 2, -4]} intensity={1.4} color="#FFFFFF" />
      <directionalLight position={[3, 0.5, -3.5]} intensity={0.8} color="#DCFCE7" />
      <Bob>
        <Package product={product} />
      </Bob>
      <ContactShadows position={[0, -0.95, 0]} scale={4} blur={2} far={2} opacity={0.25} resolution={256} color="#0F3D27" frames={1} />
      <Controls />
    </Canvas>
  )
}
