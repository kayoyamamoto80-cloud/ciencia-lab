import { useEffect, useRef, useState } from 'react'

const limite = (v, min, max) => Math.min(max, Math.max(min, v))

// Contêiner 3D em CSS puro: arraste para girar/inclinar a cena,
// roda do mouse (ou pinça no celular) para aproximar,
// duplo clique para voltar ao normal.
export default function Cena3D({ children }) {
  const ref = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const arrastando = useRef(false)
  const ultimo = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const aoRoda = (evento) => {
      evento.preventDefault()
      setZoom((z) => limite(z - evento.deltaY * 0.0015, 0.6, 1.9))
    }
    el.addEventListener('wheel', aoRoda, { passive: false })
    return () => el.removeEventListener('wheel', aoRoda)
  }, [])

  return (
    <div
      ref={ref}
      className="flex h-full w-full cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing"
      style={{ perspective: '900px' }}
      onPointerDown={(e) => {
        arrastando.current = true
        ultimo.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerMove={(e) => {
        if (!arrastando.current) return
        const dx = e.clientX - ultimo.current.x
        const dy = e.clientY - ultimo.current.y
        ultimo.current = { x: e.clientX, y: e.clientY }
        setRot((r) => ({
          x: limite(r.x - dy * 0.35, -50, 50),
          y: limite(r.y + dx * 0.35, -50, 50),
        }))
      }}
      onPointerUp={() => { arrastando.current = false }}
      onPointerLeave={() => { arrastando.current = false }}
      onDoubleClick={() => { setRot({ x: 0, y: 0 }); setZoom(1) }}
    >
      <div
        className="relative w-full max-w-2xl"
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${zoom})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 60ms linear',
        }}
      >
        {/* placa de fundo afastada no espaço — dá a sensação de profundidade */}
        <div
          className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-sky-500/10 to-indigo-500/10 blur-xl"
          style={{ transform: 'translateZ(-70px) scale(1.05)' }}
          aria-hidden
        />
        {children}
      </div>
    </div>
  )
}