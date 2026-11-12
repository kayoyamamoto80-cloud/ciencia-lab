import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Cena, Esfera, Halo, Fluido, limite, numDe } from './Base'
import { formatarResultado } from '../../data/conteudo'

// Gira o conjunto inteiro bem devagar.
function GiroLento({ children, vel = 0.05 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * vel
  })
  return <group ref={ref}>{children}</group>
}

// Molécula em órbita elíptica serena (O₂, ATP, íons...).
function Molecula({ raio = 1.2, fase = 0, c = '#38bdf8', tam = 0.09, vel = 0.28, altura = 0.45 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * vel + fase
    ref.current.position.set(Math.cos(t) * raio, Math.sin(t * 0.85 + fase) * altura, Math.sin(t) * raio)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[tam, 14, 14]} />
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.1} roughness={0.25} />
    </mesh>
  )
}

// Bolha serpenteando para cima, devagar.
function Bolha({ x, vel = 0.15, fase = 0, raio = 0.05 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = (((t * vel + fase) % 2) + 2) % 2
    ref.current.position.set(x + Math.sin(p * Math.PI) * 0.08, -0.85 + p * 1.55, Math.sin(t * 0.7 + fase) * 0.13)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[raio, 10, 10]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.05} />
    </mesh>
  )
}

// Fótons viajando do Sol até a folha, em arco suave.
function Fotons({ de, ate, c = '#fde68a', qtd = 3, vel = 0.16, fase = 0 }) {
  const refs = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const p = (((t * vel + i / qtd + fase) % 1) + 1) % 1
      ref.position.set(
        de[0] + (ate[0] - de[0]) * p,
        de[1] + (ate[1] - de[1]) * p - Math.sin(p * Math.PI) * 0.3,
        de[2] + (ate[2] - de[2]) * p
      )
    })
  })
  return (
    <group>
      {Array.from({ length: qtd }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
    </group>
  )
}

// Cor contínua do pH: vermelho (0) → verde (7) → azul (14).
function corPh(v) {
  const c = new THREE.Color('#ef4444')
  if (v <= 7) c.lerp(new THREE.Color('#22c55e'), v / 7)
  else c.set('#22c55e').lerp(new THREE.Color('#3b82f6'), (v - 7) / 7)
  return `#${c.getHexString()}`
}

/* ---------- Química ---------- */
export function SimQuimica({ tipo, valores, resultado }) {
  if (tipo === 'mols') {
    const m = numDe(valores, 'm', 18)
    const M = numDe(valores, 'M', 18)
    const n = Math.max(resultado ?? m / M, 0)
    const fatorN = limite(Math.log10(1 + n) / 2.3, 0, 1) // escala log: responde de n=1 a 200
    const escala = 0.4 + fatorN * 0.95
    const qtdBolhas = 3 + Math.round(fatorN * 4)
    const velBolhas = 0.12 + fatorN * 0.28
    return (
      <Cena legenda={`n = ${formatarResultado(n)} mol — mais mols: líquido cresce, bolhas se multiplicam e aceleram`}>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[1.3, 40, 40]} />
          <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.15} roughness={0.06} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[1.14 * escala, 40, 40]} />
          <meshStandardMaterial color="#34d399" transparent opacity={0.78} emissive="#34d399" emissiveIntensity={0.12 + fatorN * 0.15} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.72, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.35, 24, 1, true]} />
          <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.18} roughness={0.06} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.028, 10, 32]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.3} metalness={0.3} />
        </mesh>
        <Halo r={1.8} c="#34d399" o={0.04 + fatorN * 0.08} />
        {Array.from({ length: qtdBolhas }, (_, i) => (
          <Bolha
            key={i}
            x={(-0.4 + (i * 0.8) / Math.max(qtdBolhas - 1, 1)) * escala}
            vel={velBolhas + i * 0.02}
            fase={i * 1.35}
            raio={0.04 + (i % 2) * 0.014}
          />
        ))}
      </Cena>
    )
  }

  // tipo === 'ph'
  const phNum = parseFloat(String(resultado ?? '').replace(',', '.'))
  const ph = limite(Number.isFinite(phNum) ? phNum : 7, 0, 14)
  const cor = corPh(ph)
  const rotulo = ph < 6.5 ? 'ácida' : ph > 7.5 ? 'básica' : 'neutra'
  const agit = limite(Math.abs(ph - 7) / 7, 0, 1) // longe do neutro = mais agitação
  const velMol = 0.12 + agit * 0.32
  const brilho = 0.14 + agit * 0.22
  return (
    <Cena legenda={`pH ${formatarResultado(ph)} · solução ${rotulo} — quanto mais longe do neutro, mais agitadas e brilhantes as moléculas`}>
      <mesh>
        <cylinderGeometry args={[1.35, 1.35, 2.6, 40, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.18} roughness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 1.9, 40]} />
        <meshStandardMaterial color={cor} transparent opacity={0.72} emissive={cor} emissiveIntensity={brilho} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.015, 8, 48]} />
        <meshStandardMaterial color={cor} transparent opacity={0.5} emissive={cor} emissiveIntensity={0.5} />
      </mesh>
      <Halo r={1.6} c={cor} o={0.07 + agit * 0.07} />
      <GiroLento vel={0.03 + agit * 0.05}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Molecula key={i} raio={1.02} fase={i} c={cor} tam={0.085} vel={velMol} altura={0.45} />
        ))}
      </GiroLento>
    </Cena>
  )
}

/* ---------- Biologia ---------- */
export function SimBiologia({ tipo }) {
  if (tipo === 'fotossintese') {
    return (
      <Cena legenda="A folha absorve os fótons do Sol e libera O₂ — fluxo calmo e contínuo">
        <Esfera p={[-3.5, 2.2, -1]} r={0.75} c="#fbbf24" b={1.6} pulso={0.02} />
        <Halo p={[-3.5, 2.2, -1]} r={1.3} c="#fbbf24" o={0.15} />
        <Fluido de={[-2.75, 1.7, -0.65]} ate={[-0.8, 0.8, 0.1]} c="#fcd34d" e={0.018} />
        <Fotons de={[-2.75, 1.7, -0.65]} ate={[-0.8, 0.8, 0.1]} />
        <mesh position={[0, -2.1, 0]}>
          <cylinderGeometry args={[0.62, 0.45, 0.7, 28]} />
          <meshStandardMaterial color="#92400e" roughness={0.75} />
        </mesh>
        <mesh position={[0, -1.72, 0]}>
          <sphereGeometry args={[0.56, 24, 24]} />
          <meshStandardMaterial color="#3f2d1d" roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.09, 0.14, 2.4, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.5} />
        </mesh>
        <mesh position={[-0.75, 0.3, 0]} scale={[1.6, 0.3, 0.85]} rotation={[0, 0, 0.5]}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} emissive="#14532d" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0.75, 0.95, 0]} scale={[1.6, 0.3, 0.85]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial color="#16a34a" roughness={0.4} emissive="#14532d" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 1.7, 0]} scale={[1.05, 0.32, 0.7]}>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial color="#4ade80" roughness={0.4} emissive="#14532d" emissiveIntensity={0.15} />
        </mesh>
        <GiroLento vel={0.03}>
          {[0, 1, 2, 3].map((i) => (
            <Molecula key={i} raio={1.4} fase={i * 1.6} c="#7dd3fc" tam={0.08} vel={0.2} altura={1.15} />
          ))}
        </GiroLento>
      </Cena>
    )
  }

  // tipo === 'respiracao'
  return (
    <Cena legenda="Mitocôndria em corte — a glicose é degradada e o ATP se forma nas cristas">
      <GiroLento vel={0.035}>
        <mesh scale={[2.15, 1.05, 1.05]}>
          <sphereGeometry args={[1.12, 40, 40]} />
          <meshPhysicalMaterial color="#fb7185" transparent opacity={0.17} roughness={0.25} emissive="#fb7185" emissiveIntensity={0.08} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.92 + i * 0.46, 0, 0]} rotation={[0.25, 0, 0.4]} scale={[1, 0.82 - i * 0.09, 1]}>
            <torusGeometry args={[0.46, 0.05, 10, 32]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.42} roughness={0.35} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <Molecula key={i} raio={1.5} fase={i * 2.1} c="#fbbf24" tam={0.1} vel={0.24} altura={0.5} />
        ))}
      </GiroLento>
      <group position={[-2.7, 0.35, 0]}>
        <Esfera p={[0, 0, 0]} r={0.15} c="#4ade80" b={0.8} />
        <Esfera p={[0.24, -0.18, 0.1]} r={0.12} c="#86efac" b={0.6} />
        <Esfera p={[-0.22, -0.15, -0.08]} r={0.11} c="#4ade80" b={0.6} />
      </group>
      <Fluido de={[-2.3, 0.25, 0]} ate={[-1.95, 0, 0]} c="#4ade80" e={0.02} />
      <Halo r={1.9} c="#fb7185" o={0.05} />
    </Cena>
  )
}

/* ---------- Genérica (tópicos sem cena dedicada) ---------- */
export function SimGenerica({ topico }) {
  return (
    <Cena legenda="Simulação deste tópico em desenvolvimento — em breve com cena própria">
      <GiroLento vel={0.05}>
        <Esfera r={0.85} c="#818cf8" b={0.55} pulso={0.04} />
        <Halo r={1.4} c="#818cf8" o={0.12} />
        <mesh rotation={[0.55, 0, 0]}>
          <torusGeometry args={[1.7, 0.016, 8, 80]} />
          <meshBasicMaterial color="#a5b4fc" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[-0.7, 0.3, 0]}>
          <torusGeometry args={[2.05, 0.014, 8, 80]} />
          <meshBasicMaterial color="#a5b4fc" transparent opacity={0.22} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <Molecula key={i} raio={i === 1 ? 2.05 : 1.7} fase={i * 2.1} c="#c7d2fe" tam={0.09} vel={0.26} altura={0.25} />
        ))}
      </GiroLento>
    </Cena>
  )
}