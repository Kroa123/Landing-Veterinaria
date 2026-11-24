import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ChapitaModel, PackModel, StudioLights } from './parts.jsx'
import { PACK, useLabelTexture } from './labels.js'

// Escena 3D del hero (chunk 3D aparte, se carga con React.lazy desde scenes.js).
// v4, fondo claro: la chapita V en metal (cara verde vivo anodizada, canto plateado,
// V en relieve, argolla) y empaques flotando alrededor con sus colores de categoría.
// Canvas transparente: el fondo lo pone la sección. Estudio claro con Lightformers
// locales: sin HDR remoto ni fuentes externas (CSP 'self').
//
// Props:
//   active       false pausa el render (hero fuera de pantalla)
//   progressRef  ref con el progreso de salida del hero (0 → 1), lo escribe ScrollTrigger
//   pointerRef   ref { x, y } normalizado -1..1 (usePointer)
//   compact      móvil: menos objetos, menos resolución
//   onLost       se llama si el navegador pierde el contexto WebGL (el padre muestra el fallback)

const { damp, clamp } = THREE.MathUtils

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function Chapita({ pointerRef, progressRef, compact }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const { x, y } = pointerRef.current
    const p = progressRef.current || 0
    const appear = easeOut(clamp(t / 1.4, 0, 1))

    // Giro lento propio + inclinación hacia el puntero (suavizado)
    g.rotation.y = damp(g.rotation.y, Math.sin(t * 0.42) * 0.42 + x * 0.55 + p * 1.1 - (1 - appear) * 1.4, 4, dt)
    g.rotation.x = damp(g.rotation.x, -y * 0.32 + Math.sin(t * 0.6) * 0.05 + p * 0.35, 4, dt)
    g.rotation.z = damp(g.rotation.z, Math.sin(t * 0.3) * 0.06 - x * 0.08, 4, dt)
    // Flota; al salir del hero baja y se corre hacia la tienda
    // Escritorio: arriba a la izquierda del lienzo, la ficha ocupa la esquina inferior derecha
    const [bx, by] = compact ? [0, 0] : [-0.55, 0.55]
    g.position.y = by + Math.sin(t * 0.9) * 0.07 - p * 1.5
    g.position.x = bx + p * (compact ? 0.2 : 0.8)
    const s = (compact ? 0.92 : 1.1) * (0.6 + 0.4 * appear)
    g.scale.setScalar(s)
  })

  return (
    <group ref={group}>
      <ChapitaModel />
    </group>
  )
}

/* ---------- Empaques ---------- */

// Envoltorio de cada empaque: aparición, flotación, parallax con el puntero
// y, al salir del hero, se separan del centro y se desvanecen.
function Floater({ position, rotation, scale = 1, depth = 1, phase = 0, delay = 0, pointerRef, progressRef, children }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const { x, y } = pointerRef.current
    const p = progressRef.current || 0
    const appear = easeOut(clamp((t - delay) / 1.2, 0, 1))
    const spread = 1 + p * 0.9

    const tx = position[0] * spread + x * 0.22 * depth
    const ty = position[1] * spread + y * 0.16 * depth + Math.sin(t * 0.8 + phase) * 0.09
    g.position.x = damp(g.position.x, tx, 5, dt)
    g.position.y = damp(g.position.y, ty, 5, dt)
    g.position.z = position[2] - p * 1.2
    g.rotation.x = rotation[0] + Math.sin(t * 0.5 + phase) * 0.08
    g.rotation.y = rotation[1] + Math.sin(t * 0.35 + phase) * 0.2 + x * 0.15
    g.rotation.z = rotation[2] + Math.cos(t * 0.45 + phase) * 0.05
    g.scale.setScalar(scale * appear)

    const opacity = appear * clamp(1 - p * 1.4, 0, 1)
    g.visible = opacity > 0.01
    // Transparente solo mientras se desvanece: opaco se dibuja más barato y sin problemas de orden.
    // Pocas mallas por empaque (3–4): recorrerlas cada frame es barato
    const fading = opacity < 0.999
    g.traverse((obj) => {
      const m = obj.material
      if (!m) return
      m.opacity = opacity
      if (m.transparent !== fading) {
        m.transparent = fading
        m.needsUpdate = true
      }
    })
  })

  return (
    <group ref={group} position={position} scale={0}>
      {children}
    </group>
  )
}

const LABELS = {
  bag: { brand: 'Campo Norte', qty: '15', unit: 'kg', ink: PACK.alimento.ink },
  smallBag: { brand: 'Campo Norte', qty: '7,5', unit: 'kg', ink: PACK.alimento.ink },
  box: { brand: 'Protec', qty: '3', unit: 'comprimidos', ink: PACK.antiparasitarios.ink },
  bottle: { brand: 'Dermacalm', qty: '500', unit: 'ml', ink: PACK.higiene.ink },
}

// Empaque con su etiqueta corta (la textura se crea y se libera con el componente)
function HeroPack({ shape, category, label }) {
  const texture = useLabelTexture(label)
  return <PackModel shape={shape} category={category} texture={texture} />
}

function Products({ compact, pointerRef, progressRef }) {
  const shared = { pointerRef, progressRef }
  if (compact) {
    return (
      <>
        <Floater {...shared} position={[-1.5, -0.62, -0.6]} rotation={[0.05, 0.5, -0.12]} scale={0.8} depth={1.2} delay={0.35}>
          <HeroPack shape="bag" category="alimento" label={LABELS.bag} />
        </Floater>
        <Floater {...shared} position={[1.45, -0.8, 0.2]} rotation={[0.25, -0.5, 0.18]} scale={0.78} depth={1.6} phase={1.7} delay={0.5}>
          <HeroPack shape="box" category="antiparasitarios" label={LABELS.box} />
        </Floater>
      </>
    )
  }
  return (
    <>
      <Floater {...shared} position={[-1.6, -1.1, -0.3]} rotation={[0.05, 0.45, -0.12]} scale={0.9} depth={1.2} delay={0.35}>
        <HeroPack shape="bag" category="alimento" label={LABELS.bag} />
      </Floater>
      <Floater {...shared} position={[1.2, 0.2, 0.4]} rotation={[0.25, -0.5, 0.18]} scale={0.85} depth={1.7} phase={1.7} delay={0.5}>
        <HeroPack shape="box" category="antiparasitarios" label={LABELS.box} />
      </Floater>
      <Floater {...shared} position={[1.2, 1.45, -0.8]} rotation={[0.1, -0.3, -0.2]} scale={0.82} depth={0.9} phase={3.1} delay={0.65}>
        <HeroPack shape="bottle" category="higiene" label={LABELS.bottle} />
      </Floater>
      <Floater {...shared} position={[-1.85, 1.45, -1.5]} rotation={[-0.1, 0.6, 0.2]} scale={0.6} depth={0.6} phase={4.4} delay={0.8}>
        <HeroPack shape="bag" category="alimento" label={LABELS.smallBag} />
      </Floater>
    </>
  )
}

/* ---------- Cámara y luz ---------- */

function Rig({ progressRef, compact }) {
  useFrame((state, delta) => {
    const camera = state.camera
    const dt = Math.min(delta, 0.05)
    const p = progressRef.current || 0
    // Al hacer scroll la cámara se aleja y baja un poco
    camera.position.z = damp(camera.position.z, (compact ? 8.2 : 8) + p * 4, 6, dt)
    camera.position.y = damp(camera.position.y, -p * 0.5, 6, dt)
    camera.lookAt(0, -p * 0.8, 0)
  })
  return null
}

export default function HeroScene({ active = true, progressRef, pointerRef, compact = false, onLost }) {
  return (
    <Canvas
      className="hero-scene"
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, compact ? 8.2 : 8], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => onLost?.(e), { once: true })
      }}
      // El canvas no recibe el puntero (se lee en toda la ventana): no tapa enlaces ni scroll
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} compact={compact} />
      <StudioLights />
      <Chapita pointerRef={pointerRef} progressRef={progressRef} compact={compact} />
      <Products compact={compact} pointerRef={pointerRef} progressRef={progressRef} />
      {/* Los objetos flotan: la sombra se recalcula cada frame, pero a baja resolución y con poco blur */}
      <ContactShadows
        position={[0, compact ? -1.75 : -2.1, 0]}
        scale={6}
        blur={1.6}
        far={3.2}
        opacity={0.28}
        resolution={compact ? 128 : 256}
        color="#0F3D27"
      />
    </Canvas>
  )
}
