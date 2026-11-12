import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Cena, Esfera, Halo, Fluido, PontosFluxo, Flecha, Orbita, limite, numDe } from './Base'
import { formatarResultado } from '../../data/conteudo'

const K = 8.99e9
const frac = (v, max) => limite(Math.abs(v) / max, 0, 1)

// Gira o conjunto inteiro bem devagar.
function GiroLento({ children, vel = 0.06 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * vel
  })
  return <group ref={ref}>{children}</group>
}

// Tubo curvo (Bézier) com partículas que o percorrem.
function Arco({ de, ate, curva = 1, c = '#38bdf8', e = 0.026, fase = 0, vel = 0.22, qtd = 2 }) {
  const tubo = useRef()
  const refs = useRef([])
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...de)
    const b = new THREE.Vector3(...ate)
    const dir = b.clone().sub(a)
    const len = Math.max(dir.length(), 0.001)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const ctrl = mid.clone().add(new THREE.Vector3(0, 0, 1).cross(dir.clone().normalize()).multiplyScalar(len * curva))
    return new THREE.QuadraticBezierCurve3(a, ctrl, b)
  }, [de, ate, curva])
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 40, e, 8, false), [curve, e])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (tubo.current) tubo.current.material.opacity = 0.32 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.2 + fase))
    refs.current.forEach((r, i) => {
      if (r) r.position.copy(curve.getPoint((((t * vel + i / qtd) % 1) + 1) % 1))
    })
  })
  return (
    <group>
      <mesh ref={tubo} geometry={geo}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.55} transparent opacity={0.42} />
      </mesh>
      {Array.from({ length: qtd }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#bae6fd" />
        </mesh>
      ))}
    </group>
  )
}

// Cenas reativas de eletrostática: carga, Coulomb e campo elétrico.
export default function SimEletrostatica({ tipo, valores, resultado }) {
  if (tipo === 'carga') {
    const n = numDe(valores, 'n', 2)
    const negativo = n < 0
    const inten = frac(n, 30)
    const qtd = limite(Math.round(Math.sqrt(Math.abs(n)) * 4) + 6, 6, 30)
    const corP = negativo ? '#38bdf8' : '#f87171'
    const fator = 1 + inten * 0.18
    const orbitas = [
      { i: 0.15, g: 0, r: 2.0 },
      { i: 1.05, g: 0.6, r: 2.0 },
      { i: -0.95, g: -0.5, r: 2.15 },
      { i: 0.55, g: 2.2, r: 2.15 },
      { i: -0.4, g: 3.9, r: 2.0 },
      { i: 1.35, g: 1.3, r: 2.3 },
    ].map((o) => ({ ...o, r: o.r * fator }))
    return (
      <Cena legenda={`|n| = ${Math.abs(n)} · ${qtd} partículas — mais carga: órbitas maiores, mais rápidas e halo mais forte`}>
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.35}>
          <Esfera r={1.15} c="#334155" b={0.12} pulso={0.03} />
          <Halo r={1.5 + inten * 0.3} c={corP} o={0.06 + inten * 0.16} />
        </Float>
        <GiroLento vel={0.07}>
          {orbitas.map((o, idx) => (
            <mesh key={idx} rotation={[o.i, o.g, 0]}>
              <torusGeometry args={[o.r, 0.014, 8, 90]} />
              <meshBasicMaterial color={corP} transparent opacity={0.16} />
            </mesh>
          ))}
          {Array.from({ length: qtd }, (_, i) => {
            const o = orbitas[i % orbitas.length]
            return <Orbita key={i} raio={o.r} inc={o.i} giro={o.g} vel={0.25 + inten * 0.5 + (i % 5) * 0.06} fase={i * 1.1} c={corP} trilha={i < 12} />
          })}
        </GiroLento>
      </Cena>
    )
  }

  if (tipo === 'coulomb') {
    const d = Math.max(numDe(valores, 'd', 0.3), 0.01)
    const Q1 = numDe(valores, 'Q1', 2e-6)
    const Q2 = numDe(valores, 'Q2', -2e-6)
    const atracao = Q1 * Q2 < 0
    const F = Math.abs(resultado ?? (K * Math.abs(Q1 * Q2)) / (d * d))
    const forcaLen = limite(0.15 + (Math.log10(Math.max(F, 1e-8)) + 8) * 0.16, 0.15, 1.7)
    const qMag = frac(Math.min(Math.abs(Q1), Math.abs(Q2)), 1e-5)
    const qtdLinhas = limite(Math.round(3 + qMag * 7), 3, 10)
    const velFluxo = 0.12 + qMag * 0.28
    const brilho = limite(0.08 + (Math.log10(Math.max(F, 1e-4)) + 4) * 0.05, 0.08, 0.25)
    const gap = limite(2.6 + d * 2.6, 3, 7)
    const x1 = -gap / 2
    const x2 = gap / 2
    const corDe = (q) => (q >= 0 ? '#ef4444' : '#3b82f6')
    const espalhes = [-0.5, -0.28, 0, 0.28, 0.5].flatMap((oy) => [-0.35, 0.35].map((oz) => ({ oy, oz }))).slice(0, qtdLinhas)
    return (
      <Cena legenda={`F = ${formatarResultado(F)} N · ${atracao ? 'atração' : 'repulsão'} — a flecha cresce com F; as linhas, com a carga`}>
        <Esfera p={[x1, 0, 0]} r={0.72} c={corDe(Q1)} b={0.45} pulso={0.03} />
        <Halo p={[x1, 0, 0]} r={1.02} c={corDe(Q1)} o={brilho} />
        <Esfera p={[x2, 0, 0]} r={0.72} c={corDe(Q2)} b={0.45} pulso={0.03} />
        <Halo p={[x2, 0, 0]} r={1.02} c={corDe(Q2)} o={brilho} />
        {atracao
          ? espalhes.map((o, i) => (
              <Arco
                key={i}
                de={[x1 + 0.75, o.oy, o.oz]}
                ate={[x2 - 0.75, o.oy * 0.35, o.oz * 0.35]}
                curva={o.oy * 0.42}
                fase={i}
                vel={velFluxo}
                qtd={2}
              />
            ))
          : espalhes.map((o, i) => (
              <group key={i}>
                <Arco de={[x1 - 0.75, o.oy, o.oz]} ate={[x1 - 2.7, o.oy * 2.8, o.oz * 2.8]} curva={-o.oy * 0.3} fase={i} vel={velFluxo} qtd={1} />
                <Arco de={[x2 + 0.75, o.oy, o.oz]} ate={[x2 + 2.7, o.oy * 2.8, o.oz * 2.8]} curva={o.oy * 0.3} fase={i + 4} vel={velFluxo} qtd={1} />
              </group>
            ))}
        <Flecha
          de={atracao ? [x1 + 0.85, 1.4, 0] : [x1 - 0.85, 1.4, 0]}
          ate={atracao ? [x1 + 0.85 + forcaLen, 1.4, 0] : [x1 - 0.85 - forcaLen, 1.4, 0]}
        />
        <Flecha
          de={atracao ? [x2 - 0.85, 1.4, 0] : [x2 + 0.85, 1.4, 0]}
          ate={atracao ? [x2 - 0.85 - forcaLen, 1.4, 0] : [x2 + 0.85 + forcaLen, 1.4, 0]}
        />
      </Cena>
    )
  }

  // tipo === 'campo'
  const DIRS = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  ].map((v) => {
    const norma = Math.hypot(...v)
    return v.map((c) => c / norma)
  })
  const d = Math.max(numDe(valores, 'd', 0.2), 0.02)
  const Q = numDe(valores, 'Q', 5e-6)
  const positivo = Q >= 0
  const forcaQ = frac(Q, 2e-5)
  const espessura = 0.016 + forcaQ * 0.034
  const velCampo = 0.1 + forcaQ * 0.3
  const qtdPart = 1 + Math.round(forcaQ * 2)
  const E = Math.abs(resultado ?? (K * Math.abs(Q)) / (d * d))
  const flechaLen = limite(0.2 + (Math.log10(Math.max(E, 100)) - 2) * 0.35, 0.18, 1.5)
  const xT = limite(2.8 + d * 2.2, 3.2, 3.9)
  const cor = positivo ? '#ef4444' : '#3b82f6'
  return (
    <Cena legenda={`E = ${formatarResultado(E)} N/C no ponto de prova — mais carga: linhas grossas e fluxo rápido`}>
      <Esfera r={0.78} c={cor} b={0.45} pulso={0.04} />
      <Halo r={1.12} c={cor} o={0.11} />
      <mesh>
        <sphereGeometry args={[3.9, 40, 40]} />
        <meshBasicMaterial color={cor} transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <GiroLento vel={0.05}>
        {DIRS.map((dir, i) => {
          const alcance = 3.4 + (i % 3) * 0.28
          const de = positivo ? dir.map((c) => c * 0.9) : dir.map((c) => c * alcance)
          const ate = positivo ? dir.map((c) => c * alcance) : dir.map((c) => c * 0.9)
          return (
            <group key={i}>
              <Fluido de={de} ate={ate} fase={i} e={espessura} />
              <PontosFluxo de={de} ate={ate} fase={(i % 4) * 0.25} qtd={qtdPart} vel={velCampo} />
              {i < 6 && (
                <Flecha
                  de={positivo ? dir.map((c) => c * (alcance - 0.72)) : dir.map((c) => c * 1.62)}
                  ate={positivo ? dir.map((c) => c * alcance) : dir.map((c) => c * 0.9)}
                />
              )}
            </group>
          )
        })}
        <Esfera p={[xT, 0, 0]} r={0.2} c="#f8fafc" b={0.7} />
        <mesh position={[xT, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.015, 8, 40]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.5} />
        </mesh>
        <Flecha
          de={positivo ? [xT + 0.32, 0, 0] : [xT - 0.32, 0, 0]}
          ate={positivo ? [xT + 0.32 + flechaLen, 0, 0] : [xT - 0.32 - flechaLen, 0, 0]}
        />
      </GiroLento>
    </Cena>
  )
}