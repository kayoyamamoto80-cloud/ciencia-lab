import AreaCard from './AreaCard'

export default function HomePage({ areas, onSelecionarArea }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Fundo: aurora suave + grade técnica que desvanece */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="absolute -right-16 top-24 h-[28rem] w-[28rem] rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative">
        {/* Cabeçalho */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 text-xl shadow-lg shadow-violet-500/40 ring-1 ring-white/60"
              aria-hidden
            >
              🔬
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Ciência<span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">Lab</span>
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-sm text-slate-500 shadow-sm backdrop-blur sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            Aprenda explorando simulações
          </span>
        </header>

        {/* Hero */}
        <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14 md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
            ✦ Plataforma de estudos
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Qual área da ciência{' '}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              você quer explorar?
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
            Escolha uma disciplina para acessar fórmulas, inserir variáveis e visualizar simulações 3D interativas.
          </p>

          {/* Selos de destaque */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              ⚛️ {areas.length} áreas de estudo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              🧊 Simulações 3D interativas
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              ⚡ Resultados em tempo real
            </span>
          </div>

          {/* Grade de áreas */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <AreaCard key={area.id} area={area} onClick={() => onSelecionarArea(area.id)} />
            ))}
          </div>

          <p className="mt-14 text-center text-sm text-slate-400">Feito para explorar · experimentar · aprender</p>
        </main>
      </div>
    </div>
  )
}