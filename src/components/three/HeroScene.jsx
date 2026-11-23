import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// Escena 3D del hero (chunk aparte, se carga con React.lazy).
// La chapita V en metal (cara pino anodizada, canto plateado, V en relieve, argolla)
// y empaques flotando alrededor. Todo local: sin HDR remoto ni fuentes externas (CSP 'self').
//
// Props:
//   active       false pausa el render (hero fuera de pantalla)
//   progressRef  ref con el progreso de salida del hero (0 → 1), lo escribe ScrollTrigger
//   pointerRef   ref { x, y } normalizado -1..1 (usePointer)
//   compact      móvil: menos objetos, menos resolución
//   onLost       se llama si el navegador pierde el contexto WebGL (el padre muestra el fallback)

const { damp, clamp } = THREE.MathUtils

// Colores de empaque del contrato (material) y su tinta de etiqueta
const PACK = {
  alimento: { body: '#C9D8C5', ink: '#5E7A5A' },
  antiparasitarios: { body: '#D6DCE8', ink: '#5B6A8A' },
  higiene: { body: '#E8DED0', ink: '#8A7458' },
}

// Medidas de la chapita (unidades de escena). Proporciones del LogoMark.
const DISC_R = 1
const DISC_DEPTH = 0.14
const BEVEL = 0.05
const HOLE_Y = 0.74
const HOLE_R = 0.15
const RING_R = 0.24
const RING_TUBE = 0.04
const FACE_Z = DISC_DEPTH / 2 + BEVEL

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

/* ---------- Etiquetas dibujadas en canvas (usa las fuentes del propio sitio) ---------- */

function drawLabel(canvas, { brand, qty, unit, ink }) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, 28)
  ctx.fill()
  ctx.fillStyle = '#16201B'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = '600 40px Figtree, ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(brand, w / 2, h * 0.24)
  ctx.fillStyle = ink
  ctx.beginPath()
  ctx.roundRect(w * 0.14, h * 0.31, w * 0.72, 12, 6)
  ctx.fill()
  ctx.fillStyle = '#16201B'
  ctx.font = '600 120px Figtree, ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(qty, w / 2, h * 0.7)
  ctx.fillStyle = '#4A5550'
  ctx.font = '400 38px "IBM Plex Mono", ui-monospace, monospace'
  ctx.fillText(unit, w / 2, h * 0.87)
}

function useLabelTexture(label) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 320
    drawLabel(canvas, label)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [label])

  // Redibuja cuando Figtree / Plex Mono terminan de cargar
  useEffect(() => {
    let alive = true
    const fonts = document.fonts
    if (fonts?.load) {
      Promise.all([fonts.load('600 40px Figtree'), fonts.load('400 38px "IBM Plex Mono"')])
        .then(() => {
          if (!alive) return
          drawLabel(texture.image, label)
          texture.needsUpdate = true
        })
        .catch(() => {})
    }
    return () => {
      alive = false
      texture.dispose()
    }
  }, [texture, label])

  return texture
}

/* ---------- Chapita V ---------- */

function useChapitaShapes() {
  return useMemo(() => {
    const disc = new THREE.Shape()
    disc.absarc(0, 0, DISC_R, 0, Math.PI * 2, false)
    const hole = new THREE.Path()
    hole.absarc(0, HOLE_Y, HOLE_R, 0, Math.PI * 2, true)
    disc.holes.push(hole)

    // V con trazo grueso, centrada algo por debajo del centro como en el logo
    const v = new THREE.Shape()
    v.moveTo(-0.49, 0.3)
    v.lineTo(-0.29, 0.3)
    v.lineTo(0, -0.24)
    v.lineTo(0.29, 0.3)
    v.lineTo(0.49, 0.3)
    v.lineTo(0.095, -0.5)
    v.lineTo(-0.095, -0.5)
    v.closePath()

    return {
      disc,
      discOpts: {
        depth: DISC_DEPTH,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 5,
        curveSegments: 72,
      },
      v,
      vOpts: {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.014,
        bevelSize: 0.014,
        bevelSegments: 3,
        curveSegments: 4,
      },
    }
  }, [])
}

function Chapita({ pointerRef, progressRef, compact }) {
  const group = useRef(null)
  const { disc, discOpts, v, vOpts } = useChapitaShapes()

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
      {/* Disco: grupo 0 = caras (pino anodizado), grupo 1 = canto y bisel (plata) */}
      <mesh position-z={-DISC_DEPTH / 2}>
        <extrudeGeometry args={[disc, discOpts]} />
        <meshPhysicalMaterial
          attach="material-0"
          color="#2B7F5D"
          metalness={1}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.25}
        />
        <meshPhysicalMaterial
          attach="material-1"
          color="#DDE3E0"
          metalness={1}
          roughness={0.16}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* V en relieve, adelante y atrás */}
      <mesh position-z={FACE_Z - 0.006}>
        <extrudeGeometry args={[v, vOpts]} />
        <meshPhysicalMaterial color="#F4F7F5" metalness={0.55} roughness={0.22} clearcoat={0.8} clearcoatRoughness={0.1} envMapIntensity={1.6} />
      </mesh>
      <mesh position-z={-FACE_Z + 0.006} rotation-y={Math.PI}>
        <extrudeGeometry args={[v, vOpts]} />
        <meshPhysicalMaterial color="#F4F7F5" metalness={0.55} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      {/* Argolla: pasa por el agujero, en el plano perpendicular al disco */}
      <mesh position={[0, HOLE_Y - HOLE_R + RING_TUBE + 0.006 + RING_R, 0]} rotation={[0, Math.PI / 2, 0.08]}>
        <torusGeometry args={[RING_R, RING_TUBE, 16, 48]} />
        <meshStandardMaterial color="#D9DFDC" metalness={1} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
    </group>
  )
}

/* ---------- Empaques ---------- */

// Bolsa de alimento: caja subdividida y deformada en "almohada" (más fina en bordes y sello)
function useBagGeometry(w, h, d) {
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(w, h, d, 10, 14, 2)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i) / (w / 2)
      const ny = pos.getY(i) / (h / 2)
      const pinch =
        (1 - Math.pow(Math.abs(nx), 4) * 0.55) *
        (1 - Math.pow(Math.max(0, ny), 6) * 0.85) *
        (1 - Math.pow(Math.max(0, -ny), 6) * 0.35)
      pos.setZ(i, pos.getZ(i) * pinch)
      pos.setX(i, pos.getX(i) * (1 + 0.035 * (1 - ny * ny)))
    }
    geo.computeVertexNormals()
    return geo
  }, [w, h, d])

  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

function Bag({ pack, label }) {
  const W = 0.92
  const H = 1.22
  const D = 0.4
  const geometry = useBagGeometry(W, H, D)
  const tex = useLabelTexture(label)
  return (
    <group>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color={pack.body} roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.4} />
      </mesh>
      {/* Sello superior */}
      <mesh position={[0, H / 2 - 0.035, 0]}>
        <boxGeometry args={[W * 0.98, 0.07, 0.05]} />
        <meshStandardMaterial color={pack.ink} roughness={0.5} />
      </mesh>
      {/* Etiqueta */}
      <mesh position={[0, -0.04, D / 2 + 0.006]}>
        <planeGeometry args={[0.56, 0.56]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Box({ pack, label }) {
  const W = 0.98
  const H = 0.64
  const D = 0.26
  const tex = useLabelTexture(label)
  return (
    <group>
      <RoundedBox args={[W, H, D]} radius={0.035} smoothness={3}>
        <meshPhysicalMaterial color={pack.body} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* Franja de categoría */}
      <mesh position={[-W / 2 + 0.17, 0, D / 2 + 0.003]}>
        <planeGeometry args={[0.2, H - 0.06]} />
        <meshStandardMaterial color={pack.ink} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0, D / 2 + 0.004]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
    </group>
  )
}

const BOTTLE_PROFILE = [
  [0, -0.55],
  [0.22, -0.55],
  [0.27, -0.5],
  [0.28, -0.22],
  [0.28, 0.24],
  [0.25, 0.36],
  [0.13, 0.45],
  [0.1, 0.5],
  [0, 0.5],
].map(([x, y]) => new THREE.Vector2(x, y))

function Bottle({ pack, label }) {
  const tex = useLabelTexture(label)
  return (
    <group>
      <mesh>
        <latheGeometry args={[BOTTLE_PROFILE, 40]} />
        <meshPhysicalMaterial color={pack.body} roughness={0.22} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.17, 24]} />
        <meshStandardMaterial color={pack.ink} roughness={0.4} />
      </mesh>
      {/* Etiqueta envolvente, solo al frente */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.284, 0.284, 0.42, 32, 1, true, -0.85, 1.7]} />
        <meshStandardMaterial map={tex} roughness={0.6} side={THREE.FrontSide} />
      </mesh>
    </group>
  )
}

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

function Products({ compact, pointerRef, progressRef }) {
  const shared = { pointerRef, progressRef }
  if (compact) {
    return (
      <>
        <Floater {...shared} position={[-1.5, -0.62, -0.6]} rotation={[0.05, 0.5, -0.12]} scale={0.8} depth={1.2} delay={0.35}>
          <Bag pack={PACK.alimento} label={LABELS.bag} />
        </Floater>
        <Floater {...shared} position={[1.45, -0.8, 0.2]} rotation={[0.25, -0.5, 0.18]} scale={0.78} depth={1.6} phase={1.7} delay={0.5}>
          <Box pack={PACK.antiparasitarios} label={LABELS.box} />
        </Floater>
      </>
    )
  }
  return (
    <>
      <Floater {...shared} position={[-1.6, -1.1, -0.3]} rotation={[0.05, 0.45, -0.12]} scale={0.9} depth={1.2} delay={0.35}>
        <Bag pack={PACK.alimento} label={LABELS.bag} />
      </Floater>
      <Floater {...shared} position={[1.2, 0.2, 0.4]} rotation={[0.25, -0.5, 0.18]} scale={0.85} depth={1.7} phase={1.7} delay={0.5}>
        <Box pack={PACK.antiparasitarios} label={LABELS.box} />
      </Floater>
      <Floater {...shared} position={[1.2, 1.45, -0.8]} rotation={[0.1, -0.3, -0.2]} scale={0.82} depth={0.9} phase={3.1} delay={0.65}>
        <Bottle pack={PACK.higiene} label={LABELS.bottle} />
      </Floater>
      <Floater {...shared} position={[-1.85, 1.45, -1.5]} rotation={[-0.1, 0.6, 0.2]} scale={0.6} depth={0.6} phase={4.4} delay={0.8}>
        <Bag pack={PACK.alimento} label={LABELS.smallBag} />
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

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      {/* Contraluz menta sutil */}
      <directionalLight position={[-4, 1.5, -4]} intensity={2.4} color="#6EE7B7" />
      {/* Reflejos: estudio armado con Lightformers locales, se renderiza una sola vez */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#0E2119']} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} scale={[2.5, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[5, -0.5, 3]} scale={[2.5, 5, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 0, 7]} scale={[7, 5, 1]} />
        <Lightformer form="ring" color="#6EE7B7" intensity={4} position={[3.5, 2, -4]} scale={2.5} />
        <Lightformer form="rect" color="#34D399" intensity={2} position={[-3, -3, -3]} scale={[7, 1, 1]} />
      </Environment>
    </>
  )
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
        gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), { once: true })
      }}
      // El canvas no recibe el puntero (se lee en toda la ventana): no tapa enlaces ni scroll
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} compact={compact} />
      <Lights />
      <Chapita pointerRef={pointerRef} progressRef={progressRef} compact={compact} />
      <Products compact={compact} pointerRef={pointerRef} progressRef={progressRef} />
      {/* Los objetos flotan: la sombra se recalcula cada frame, pero a baja resolución y con poco blur */}
      <ContactShadows
        position={[0, compact ? -1.75 : -2.1, 0]}
        scale={6}
        blur={1.6}
        far={3.2}
        opacity={0.45}
        resolution={compact ? 128 : 256}
        color="#000000"
      />
    </Canvas>
  )
}
