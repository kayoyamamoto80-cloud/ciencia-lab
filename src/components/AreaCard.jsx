export default function AreaCard({ area, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${area.tema.gradiente} p-8 text-left text-white shadow-lg ${area.tema.sombra} ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.98]`}
    >
      {/* Textura: grade sutil que some em direção ao canto */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_72%)]"
        aria-hidden
      />

      {/* Brilhos decorativos */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-125" aria-hidden />
      <div className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-black/15 blur-2xl transition-transform duration-500 group-hover:scale-110" aria-hidden />

      {/* Varredura de brilho ao passar o mouse */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden
      />

      {/* Topo: ícone em vidro + selo */}
      <div className="relative flex items-start justify-between">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          aria-hidden
        >
          {area.icone}
        </span>
        <span className="rounded-full bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
          Simulação 3D
        </span>
      </div>

      {/* Base: título, descrição e botão */}
      <span className="relative">
        <span className="block text-2xl font-extrabold tracking-tight">{area.nome}</span>
        <span className="mt-2 block text-sm leading-relaxed text-white/85">{area.descricao}</span>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 backdrop-blur transition-colors duration-300 group-hover:bg-white/25">
          Explorar área
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
        </span>
      </span>
    </button>
  )
}