import AreaCard from './AreaCard'

export default function HomePage({ areas, onSelecionarArea, onAbrirLivros = () => {} }) {
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
              📚 Clássicos para ler grátis
            </span>
          </div>

          {/* Grade de áreas */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <AreaCard key={area.id} area={area} onClick={() => onSelecionarArea(area.id)} />
            ))}
          </div>

          {/* Banner da Biblioteca */}
          <button
            type="button"
            onClick={onAbrirLivros}
            className="group relative mt-8 flex w-full flex-col items-start gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 p-8 text-left text-white shadow-xl shadow-rose-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60 active:scale-[0.99] sm:flex-row sm:items-center md:p-10"
          >
            {/* textura + brilhos */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_75%)]"
              aria-hidden
            />
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              aria-hidden
            />

            {/* ícone em vidro */}
            <span
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
              aria-hidden
            >
              📚
            </span>

            {/* textos */}
            <span className="relative flex-1">
              <span className="block text-2xl font-extrabold tracking-tight md:text-3xl">
                Biblioteca <span className="font-black">CiênciaLab</span>
              </span>
              <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                Clássicos científicos originais — Newton, Darwin, Boyle e mais. Leia direto no app com animação de página ou baixe o PDF, tudo de graça.
              </span>
              <span className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/20">
                  6 obras
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/20">
                  Domínio público
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/20">
                  PDF grátis
                </span>
              </span>
            </span>

            {/* botão */}
            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 backdrop-blur transition-colors duration-300 group-hover:bg-white/25">
              Explorar livros
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
            </span>
          </button>

          <p className="mt-14 text-center text-sm text-slate-400">Feito para explorar · experimentar · aprender</p>
        </main>
      </div>
    </div>
  )
}