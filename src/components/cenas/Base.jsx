import { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles, Trail } from '@react-three/drei'
import { parseValor } from '../../data/conteudo'

export const limite = (v, min, max) => Math.min(max, Math.max(min, v))

export const numDe = (valores, chave, padrao) => {
  const n = parseValor(valores?.[chave])
  return Number.isFinite(n) ? n : padrao
}

// Palco comum: iluminação em 3 pontos, estrelas discretas e órbita lenta.
export function Cena({ legenda, children }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="h-[300px] w-full max-w-2xl overflow-hidden rounded-2xl ring-1 ring-slate-900/10">
        <Canvas camera={{ position: [0, 1.9, 8.8], fov: 42 }} dpr={[1, 2]}>
          <color attach="background" args={['#0e1626']} />
          <fog attach="fog" args={['#0e1626', 18, 40]} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[6, 8, 4]} intensity={1.3} />
          <pointLight position={[-7, -2, -4]} intensity={8} distance={16} color="#60a5fa" />
          <pointLight position={[6, -3, 5]} intensity={4} distance={14} color="#f0abfc" />
          <Stars radius={50} depth={28} count={1000} factor={3} fade speed={0.2} />
          <Sparkles count={26} scale={[12, 7, 12]} size={2} speed={0.12} color="#bae6fd" opacity={0.4} />
          {children}
          <gridHelper args={[26, 26, '#1c2a40', '#152032']} position={[0, -3.4, 0]} />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={16} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>
      {legenda && (
        <p className="pb-1 pt-2 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">{legenda}</p>
      )}
    </div>
  )
}

// Esfera com material físico premium (clearcoat) e pulso suave opcional.
export function Esfera({ p = [0, 0, 0], r = 1, c = '#38bdf8', b = 0.25, pulso = 0, velPulso = 1.1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current && pulso > 0) ref.current.scale.setScalar(1 + pulso * Math.sin(clock.getElapsedTime() * velPulso))
  })
  return (
    <mesh ref={ref} position={p}>
      <sphereGeometry args={[r, 56, 56]} />
      <meshPhysicalMaterial
        color={c} emissive={c} emissiveIntensity={b}
        roughness={0.22} metalness={0.35}
        clearcoat={1} clearcoatRoughness={0.18}
      />
    </mesh>
  )
}

// Halo de brilho aditivo, pulsando devagar.
export function Halo({ p = [0, 0, 0], r = 1.4, c = '#38bdf8', o = 0.14 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + 0.06 * Math.sin(clock.getElapsedTime() * 1.1))
  })
  return (
    <mesh ref={ref} position={p}>
      <sphereGeometry args={[r, 28, 28]} />
      <meshBasicMaterial color={c} transparent opacity={o} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// Geometria de um segmento entre dois pontos (linhas e flechas 3D).
export function segmento(de, ate) {
  const a = new THREE.Vector3(...de)
  const b = new THREE.Vector3(...ate)
  const dir = b.clone().sub(a)
  const l = Math.max(dir.length(), 0.001)
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  const rot = new THREE.Euler().setFromQuaternion(quat)
  return { p: a.clone().add(dir.multiplyScalar(0.5)).toArray(), r: [rot.x, rot.y, rot.z], l }
}

// Linha de campo com respiração lenta e discreta.
export function Fluido({ de, ate, c = '#38bdf8', e = 0.028, fase = 0 }) {
  const ref = useRef()
  const { p, r, l } = segmento(de, ate)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) ref.current.material.opacity = 0.3 + 0.16 * (0.5 + 0.5 * Math.sin(t * 1.2 + fase))
  })
  return (
    <mesh ref={ref} position={p} rotation={r}>
      <cylinderGeometry args={[e, e, l, 10]} />
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.55} transparent opacity={0.42} />
    </mesh>
  )
}

// Partículas percorrendo a linha — fluxo calmo.
export function PontosFluxo({ de, ate, c = '#bae6fd', qtd = 3, vel = 0.25, tam = 0.055, fase = 0 }) {
  const refs = useRef([])
  const { p, r, l } = segmento(de, ate)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const prog = (((t * vel + i / qtd + fase) % 1) + 1) % 1
      ref.position.y = prog * l - l / 2
    })
  })
  return (
    <group position={p} rotation={r}>
      {Array.from({ length: qtd }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[tam, 14, 14]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
    </group>
  )
}

// Flecha 3D (corpo + ponta) para forças.
export function Flecha({ de, ate, c = '#fbbf24', e = 0.05 }) {
  const { p, r, l } = segmento(de, ate)
  const corpo = Math.max(l - 0.3, 0.05)
  return (
    <group position={p} rotation={r}>
      <mesh position={[0, corpo / 2, 0]}>
        <cylinderGeometry args={[e, e, corpo, 14]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, corpo + 0.15, 0]}>
        <coneGeometry args={[e * 2.4, 0.3, 16]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function Orbita({ raio = 2, inc = 0, giro = 0, vel = 0.45, fase = 0, c = '#38bdf8', rb = 0.14, trilha = false }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * vel + fase
    if (ref.current) ref.current.position.set(Math.cos(t) * raio, Math.sin(t * 1.25) * raio * 0.04, Math.sin(t) * raio)
  })
  const nucleo = (
    <group ref={ref}>
      <Esfera r={rb} c={c} b={2} />
    </group>
  )
  return (
    <group rotation={[inc, giro, 0]}>
      {trilha ? <Trail width={1.8} length={6} color={c} attenuation={(w) => w * w}>{nucleo}</Trail> : nucleo}
    </group>
  )
}