import { useEffect, useMemo } from 'react'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { PACK, PACK_VIEWER } from './labels.js'

// Piezas 3D compartidas por las escenas (hero, visor de producto, chapita chica).
// Viven solo en el chunk 3D. Todo local: sin HDR remoto ni fuentes externas (CSP 'self').

/* ---------- Colores ---------- */

// Chapita v4: verde vivo anodizado (leaf → brand) con canto plateado
const CHAPITA = {
  face: '#22C55E',
  faceDeep: '#0F7A47',
  edge: '#E4E9E6',
  mark: '#FFFFFF',
}

/* ---------- Chapita V ---------- */

// Medidas de la chapita (unidades de escena). Proporciones del LogoMark.
const DISC_R = 1
const DISC_DEPTH = 0.14
const BEVEL = 0.05
const HOLE_Y = 0.74
const HOLE_R = 0.15
const RING_R = 0.24
const RING_TUBE = 0.04
const FACE_Z = DISC_DEPTH / 2 + BEVEL

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

// Modelo estático de la chapita (sin animación): disco verde anodizado con canto plateado,
// V en relieve adelante y atrás, y argolla que pasa por el agujero.
export function ChapitaModel() {
  const { disc, discOpts, v, vOpts } = useChapitaShapes()
  return (
    <group>
      {/* Disco: grupo 0 = caras (verde anodizado), grupo 1 = canto y bisel (plata) */}
      <mesh position-z={-DISC_DEPTH / 2}>
        <extrudeGeometry args={[disc, discOpts]} />
        <meshPhysicalMaterial
          attach="material-0"
          color={CHAPITA.face}
          metalness={0.75}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          sheen={0.4}
          sheenColor={CHAPITA.faceDeep}
          envMapIntensity={1.1}
        />
        <meshPhysicalMaterial attach="material-1" color={CHAPITA.edge} metalness={1} roughness={0.16} envMapIntensity={1.3} />
      </mesh>

      {/* V en relieve, adelante y atrás */}
      <mesh position-z={FACE_Z - 0.006}>
        <extrudeGeometry args={[v, vOpts]} />
        <meshPhysicalMaterial color={CHAPITA.mark} metalness={0.4} roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.1} envMapIntensity={1.2} />
      </mesh>
      <mesh position-z={-FACE_Z + 0.006} rotation-y={Math.PI}>
        <extrudeGeometry args={[v, vOpts]} />
        <meshPhysicalMaterial color={CHAPITA.mark} metalness={0.4} roughness={0.25} envMapIntensity={1.2} />
      </mesh>

      {/* Argolla: pasa por el agujero, en el plano perpendicular al disco */}
      <mesh position={[0, HOLE_Y - HOLE_R + RING_TUBE + 0.006 + RING_R, 0]} rotation={[0, Math.PI / 2, 0.08]}>
        <torusGeometry args={[RING_R, RING_TUBE, 16, 48]} />
        <meshStandardMaterial color={CHAPITA.edge} metalness={1} roughness={0.2} envMapIntensity={1.3} />
      </mesh>
    </group>
  )
}

/* ---------- Empaques ---------- */

// Material de la etiqueta. En el visor (product) se suma una emisión leve con la misma
// textura: el blanco y el texto no se agrisan cuando la cara queda a contraluz.
function LabelMaterial({ texture, variant, side }) {
  if (variant === 'product') {
    return (
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#FFFFFF" emissiveIntensity={0.35} roughness={0.55} side={side} />
    )
  }
  return <meshStandardMaterial map={texture} roughness={0.6} side={side} />
}

// Bolsa: caja subdividida y deformada en "almohada" (más fina en bordes y sello).
// gusset: fuelle lateral (bolsas de alimento paradas), aplana menos los costados.
function useBagGeometry(w, h, d, gusset = false) {
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(w, h, d, 10, 14, 4)
    const pos = geo.attributes.position
    const sidePinch = gusset ? 0.25 : 0.55
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i) / (w / 2)
      const ny = pos.getY(i) / (h / 2)
      const pinch =
        (1 - Math.pow(Math.abs(nx), 4) * sidePinch) *
        (1 - Math.pow(Math.max(0, ny), 6) * 0.85) *
        (1 - Math.pow(Math.max(0, -ny), 6) * (gusset ? 0.1 : 0.35))
      pos.setZ(i, pos.getZ(i) * pinch)
      pos.setX(i, pos.getX(i) * (1 + 0.035 * (1 - ny * ny)))
    }
    geo.computeVertexNormals()
    return geo
  }, [w, h, d, gusset])

  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

// Medidas por tipo: corta (hero, etiqueta cuadrada) o alta (visor, etiqueta de producto)
const BAG = { short: [0.92, 1.22, 0.4, 0.56, 0.56], product: [1.05, 1.5, 0.52, 0.78, 0.975] }

export function Bag({ pack, texture, variant = 'short' }) {
  const [W, H, D, lw, lh] = BAG[variant] || BAG.short
  const geometry = useBagGeometry(W, H, D, variant === 'product')
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
        <planeGeometry args={[lw, lh]} />
        <LabelMaterial texture={texture} variant={variant} />
      </mesh>
    </group>
  )
}

const BOX = { short: [0.98, 0.64, 0.26, 0.5, 0.5, 0.12], product: [0.92, 1.22, 0.34, 0.72, 0.9, 0] }

export function Box({ pack, texture, variant = 'short' }) {
  const [W, H, D, lw, lh, lx] = BOX[variant] || BOX.short
  return (
    <group>
      <RoundedBox args={[W, H, D]} radius={0.035} smoothness={3}>
        <meshPhysicalMaterial color={pack.body} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* Franja de categoría */}
      <mesh position={variant === 'product' ? [0, -H / 2 + 0.09, D / 2 + 0.003] : [-W / 2 + 0.17, 0, D / 2 + 0.003]}>
        <planeGeometry args={variant === 'product' ? [W - 0.06, 0.12] : [0.2, H - 0.06]} />
        <meshStandardMaterial color={pack.ink} roughness={0.5} />
      </mesh>
      <mesh position={[lx, variant === 'product' ? 0.08 : 0, D / 2 + 0.004]}>
        <planeGeometry args={[lw, lh]} />
        <LabelMaterial texture={texture} variant={variant} />
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

export function Bottle({ pack, texture, variant = 'short' }) {
  const tall = variant === 'product'
  return (
    <group scale={tall ? [1.25, 1.35, 1.25] : 1}>
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
        <cylinderGeometry args={[0.284, 0.284, tall ? 0.56 : 0.42, 32, 1, true, -0.85, 1.7]} />
        <LabelMaterial texture={texture} variant={variant} side={THREE.FrontSide} />
      </mesh>
    </group>
  )
}

// Accesorio: cartón colgador con la etiqueta y la correa/collar enrollado debajo,
// con mosquetón metálico. Formas simples (toros), color de la categoría.
export function Hanger({ pack, texture, variant = 'short' }) {
  const tall = variant === 'product'
  return (
    <group>
      {/* Cartón colgador (en el visor, más alto para una etiqueta grande y legible) */}
      <RoundedBox args={tall ? [0.94, 0.88, 0.04] : [0.9, 0.78, 0.04]} radius={0.03} smoothness={2} position={[0, tall ? 0.6 : 0.5, 0]}>
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
      </RoundedBox>
      {/* La etiqueta del visor es más alta que ancha (1:1,25): el plano respeta esa proporción */}
      <mesh position={[0, tall ? 0.6 : 0.5, 0.022]}>
        <planeGeometry args={tall ? [0.66, 0.825] : [0.62, 0.62]} />
        <LabelMaterial texture={texture} variant={variant} />
      </mesh>
      {/* Correa enrollada: dos vueltas. En el visor baja un poco para no tapar la unidad de la etiqueta */}
      <mesh position={[0, tall ? -0.39 : -0.32, 0]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[0.46, 0.07, 14, 64]} />
        <meshPhysicalMaterial color={pack.body} roughness={0.55} sheen={0.6} sheenColor={pack.ink} />
      </mesh>
      <mesh position={[0, tall ? -0.35 : -0.28, 0.05]} rotation={[0.25, 0, 0.3]}>
        <torusGeometry args={[0.34, 0.06, 14, 56]} />
        <meshPhysicalMaterial color={pack.ink} roughness={0.55} />
      </mesh>
      {/* Mosquetón */}
      <mesh position={[0, tall ? -0.02 : 0.05, 0.08]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.018, 10, 32]} />
        <meshStandardMaterial color="#C9D0CC" metalness={1} roughness={0.22} />
      </mesh>
    </group>
  )
}

const PACK_SHAPES = { bag: Bag, box: Box, bottle: Bottle, hanger: Hanger }

// Empaque según la forma del producto (product.pack) con el color de su categoría
// (visor: paleta saturada PACK_VIEWER; hero: pasteles de PACK)
export function PackModel({ shape = 'bag', category = 'alimento', texture, variant = 'short' }) {
  const Shape = PACK_SHAPES[shape] || Bag
  const palette = variant === 'product' ? PACK_VIEWER : PACK
  const pack = palette[category] || palette.alimento
  return <Shape pack={pack} texture={texture} variant={variant} />
}

/* ---------- Luz de estudio (fondo claro) ---------- */

// Estudio claro armado con Lightformers locales (se renderiza una sola vez a un cubemap).
// Sin presets ni HDR remoto. Los reflejos del metal salen de estas placas de luz.
export function StudioLights({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.55 * intensity} />
      <directionalLight position={[3, 5, 5]} intensity={1.3 * intensity} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6 * intensity} color="#DCFCE7" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#EEF4EF']} />
        <Lightformer form="rect" intensity={2.6} position={[0, 5, 2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.8} position={[-5, 1, 2]} scale={[2.5, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[5, -0.5, 3]} scale={[2.5, 5, 1]} />
        <Lightformer form="rect" intensity={1} position={[0, 0, 7]} scale={[7, 5, 1]} />
        <Lightformer form="ring" color="#E0F2FE" intensity={2} position={[3.5, 2, -4]} scale={2.5} />
        <Lightformer form="rect" color="#DCFCE7" intensity={1.4} position={[-3, -3, -3]} scale={[7, 1, 1]} />
      </Environment>
    </>
  )
}
