import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ChapitaModel, StudioLights } from './parts.jsx'

// Chapita V 3D chica (404 y Agendar). Chunk 3D, se carga con React.lazy desde scenes.js.
// Gira lento sobre su eje, flota y se inclina un poco hacia el puntero.
//
// Props:
//   active      false pausa el render (fuera de pantalla)
//   pointerRef  ref { x, y } normalizado -1..1 (usePointer)
//   onLost      se llama si el navegador pierde el contexto WebGL

const { damp } = THREE.MathUtils

function Spinner({ pointerRef }) {
  const group = useRef(null)
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const { x, y } = pointerRef?.current || { x: 0, y: 0 }
    g.rotation.y = damp(g.rotation.y, t * 0.6 + x * 0.4, 3, dt)
    g.rotation.x = damp(g.rotation.x, -y * 0.25 + Math.sin(t * 0.7) * 0.05, 3, dt)
    g.position.y = Math.sin(t * 1.1) * 0.06
  })
  return (
    <group ref={group}>
      <ChapitaModel />
    </group>
  )
}

export default function ChapitaMiniScene({ active = true, pointerRef, onLost }) {
  return (
    <Canvas
      className="chapita-mini-scene"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, 5.2], fov: 30, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => onLost?.(e), { once: true })
      }}
      style={{ pointerEvents: 'none' }}
    >
      <StudioLights />
      <Spinner pointerRef={pointerRef} />
      <ContactShadows position={[0, -1.3, 0]} scale={3.5} blur={2.2} far={2} opacity={0.22} resolution={128} color="#0F3D27" />
    </Canvas>
  )
}
