import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Cena, Halo, Fluido, PontosFluxo, Flecha, limite, numDe } from './Base'
import { formatarResultado } from '../../data/conteudo'

// Gira o conjunto inteiro bem devagar.
function GiroLento({ children, vel = 0.05 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * vel
  })
  return <group ref={ref}>{children}</group>
}

// Vai-e-vem calmo (ímã da cena de Faraday).
function VaiVem({ children, amplitude = 1.7, vel = 0.8, fase = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = amplitude * Math.sin(clock.getElapsedTime() * vel + fase)
  })
  return <group ref={ref}>{children}</group>
}

// Laço fechado de campo: entra pelo núcleo e retorna por fora (tubo + partículas).
function LacoCampo({ escalaZ = 1, c = '#38bdf8', vel = 0.14, brilho = 0.35 }) {
  const refs = useRef([])
  const curva = useMemo(() => {
    const base = [
      [-3, 0, 0], [-1.4, 0, 0], [0, 0, 0], [1.4, 0, 0], [3, 0, 0],
      [3.55, 0, 0.85], [3.15, 0, 1.9], [1.6, 0, 2.5], [0, 0, 2.65],
      [-1.6, 0, 2.5], [-3.15, 0, 1.9], [-3.55, 0, 0.85],
    ]
    return new THREE.CatmullRomCurve3(base.map((p) => new THREE.Vector3(p[0], p[1], p[2] * escalaZ)), true)
  }, [escalaZ])
  const geo = useMemo(() => new THREE.TubeGeometry(curva, 110, 0.024, 8, true), [curva])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const prog = (((t * vel + i / 6) % 1) + 1) % 1
      ref.position.copy(curva.getPoint(prog))
    })
  })
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} transparent opacity={brilho} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#bae6fd" />
        </mesh>
      ))}
    </group>
  )
}

// Cenas reativas de eletromagnetismo: força, solenoide, fluxo e Faraday.
export default function SimEletromagnetismo({ tipo, valores, resultado }) {
  if (tipo === 'forca') {
    const theta = limite(numDe(valores, 'theta', 90), 0, 180)
    const I = numDe(valores, 'I', 3)
    const L = numDe(valores, 'L', 0.5)
    const B = numDe(valores, 'B', 0.2)
    const rad = (theta * Math.PI) / 180
    const F = Math.abs(resultado ?? I * L * B * Math.sin(rad))
    const forcaLen = limite(0.2 + (Math.log10(Math.max(F, 1e-3)) + 3) * 0.42, 0.12, 2.1)
    const velCorrente = 0.2 + limite(Math.abs(I) / 15, 0, 1) * 0.7
    const velCampo = 0.15 + limite(Math.abs(B) / 2, 0, 1) * 0.5
    const eCampo = 0.02 + limite(Math.abs(B) / 2, 0, 1) * 0.03
    const corrente = Math.abs(I) > 0.01
    const fatorF = limite(F / 60, 0, 1)
    return (
      <Cena legenda={F < 0.01 ? `F ≈ 0 N — θ = ${theta}° (condutor quase paralelo ao campo)` : `F = ${formatarResultado(F)} N — a flecha cresce com I · L · B · sen θ`}>
        <RoundedBox args={[0.9, 1.6, 1.5]} radius={0.12} position={[-3.3, 0.85, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.28} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[0.9, 1.6, 1.5]} radius={0.12} position={[-3.3, -0.85, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.28} roughness={0.35} />
        </RoundedBox>
        {[-1.2, 0, 1.2].map((z) => (
          <group key={z}>
            <Fluido de={[-2.8, 0, z]} ate={[3.6, 0, z]} fase={z + 1} e={eCampo} />
            <PontosFluxo de={[-2.8, 0, z]} ate={[3.6, 0, z]} fase={z * 0.3} qtd={3} vel={velCampo} />
          </group>
        ))}
        <group rotation={[0, 0, Math.PI / 2 - rad]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 3.3, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.2} />
          </mesh>
          {corrente && <PontosFluxo de={[0, -1.3, 0]} ate={[0, 1.3, 0]} c="#f59e0b" qtd={4} vel={velCorrente} tam={0.07} />}
        </group>
        {F >= 0.01 && (
          <>
            <Halo r={0.9 + fatorF * 0.5} c="#fbbf24" o={0.05 + fatorF * 0.1} />
            <Flecha de={[0, 0.5, 0]} ate={[0, 0.5 + forcaLen, 0]} />
          </>
        )}
      </Cena>
    )
  }

  if (tipo === 'solenoide') {
    const N = limite(Math.round(numDe(valores, 'N', 8)), 4, 12)
    const I = Math.abs(numDe(valores, 'I', 3))
    const fatorI = limite(I / 15, 0, 1)
    const vel = 0.1 + fatorI * 0.55
    return (
      <Cena legenda={`B = ${formatarResultado(Math.abs(resultado ?? 0))} T · ${N} espiras · I = ${I} A — mais corrente: laço mais rápido, opaco e espiras brilhantes`}>
        <GiroLento vel={0.04}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.55, 0.55, 4.6, 32]} />
            <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.35} />
          </mesh>
          {Array.from({ length: N }, (_, i) => {
            const x = -2 + (i * 4) / Math.max(N - 1, 1)
            return (
              <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.78, 0.065, 14, 48]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.25 + fatorI * 0.45} metalness={0.4} roughness={0.3} />
              </mesh>
            )
          })}
          <LacoCampo escalaZ={1} vel={vel} brilho={0.18 + fatorI * 0.3} />
          <LacoCampo escalaZ={-1} vel={vel} brilho={0.18 + fatorI * 0.3} />
          <Halo r={1.4} c="#38bdf8" o={0.05 + fatorI * 0.08} />
        </GiroLento>
      </Cena>
    )
  }

  if (tipo === 'fluxo') {
    const theta = limite(numDe(valores, 'theta', 0), 0, 90)
    const B = Math.abs(numDe(valores, 'B', 0.2))
    const rad = (theta * Math.PI) / 180
    const phi = Math.abs(resultado ?? 0)
    const fatorB = limite(B / 2, 0, 1)
    const fatorPhi = limite(phi * 8, 0, 1)
    return (
      <Cena legenda={`Φ = ${formatarResultado(phi)} Wb — B engrossa e acelera as linhas; Φ acende o disco da espira`}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i}>
            <Fluido de={[-2.4 + i * 1.6, -2.3, 0]} ate={[-2.4 + i * 1.6, 2.3, 0]} fase={i} e={0.02 + fatorB * 0.05} />
            <PontosFluxo de={[-2.4 + i * 1.6, -2.3, 0]} ate={[-2.4 + i * 1.6, 2.3, 0]} fase={i * 0.27} qtd={2} vel={0.12 + fatorB * 0.35} />
          </group>
        ))}
        <group rotation={[rad, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.45, 0.075, 14, 64]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.45, 48]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.04 + fatorPhi * 0.14} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
        <Halo r={1.9} c="#38bdf8" o={0.04 + limite(phi * 10, 0, 1) * 0.06} />
      </Cena>
    )
  }

  // tipo === 'faraday'
  const N = limite(Math.round(numDe(valores, 'N', 6)), 3, 10)
  const fem = Math.abs(resultado ?? 0)
  const vel = 0.3 + limite(fem * 1.5, 0, 1.4)
  const brilho = 0.2 + limite(fem * 1.2, 0, 1.1)
  return (
    <Cena legenda={`fem = ${formatarResultado(fem)} V nas ${N} espiras — ímã mais rápido e espiras mais brilhantes com maior fem`}>
      {Array.from({ length: N }, (_, i) => {
        const x = -0.9 + (i * 1.8) / Math.max(N - 1, 1)
        return (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.82, 0.05, 12, 44]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={brilho} metalness={0.4} roughness={0.3} />
          </mesh>
        )
      })}
      <VaiVem amplitude={1.7} vel={vel}>
        <mesh position={[-2.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 1.7, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.85, 28]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[-1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.85, 28]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} roughness={0.35} />
        </mesh>
      </VaiVem>
      <Halo r={1 + limite(fem * 0.5, 0, 0.8)} c="#38bdf8" o={0.04 + limite(fem * 0.15, 0, 0.14)} />
    </Cena>
  )
}