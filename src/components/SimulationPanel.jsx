import CenaSimulacao from './simulacoes'
import { formatarResultado } from '../data/conteudo'

// Painel dominante: cena 3D interativa + resultado calculado ao vivo.
export default function SimulationPanel({ topico, valores, resultado }) {
  const temResultado = resultado !== null

  return (
    <section className="relative flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-sky-950/40 ring-1 ring-white/10">
      {/* filete de luz no topo do painel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" aria-hidden />

      {/* Cabeçalho: status ao vivo + fórmula com borda neon */}
      <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Simulação ao vivo
            </p>
            <h2 className="text-lg font-bold text-white">{topico.titulo}</h2>
          </div>
        </div>
        <span className="relative rounded-xl bg-gradient-to-r from-sky-500/70 via-cyan-400/70 to-violet-500/70 p-[1.5px] shadow-lg shadow-sky-500/20">
          <span className="block rounded-[10.5px] bg-slate-950/90 px-4 py-1.5 font-mono text-sm font-semibold text-cyan-300">
            {topico.formula}
          </span>
        </span>
      </header>

      {/* Palco 3D */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, rgba(56,189,248,0.14), transparent 65%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* cantos de mira de laboratório */}
        <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-sky-400/30" aria-hidden />
        <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-sky-400/30" aria-hidden />
        <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-sky-400/30" aria-hidden />
        <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-sky-400/30" aria-hidden />

        <div className="relative h-full min-h-[280px]">
          <CenaSimulacao topico={topico} valores={valores} resultado={resultado} />
        </div>
      </div>

      {/* Rodapé: resultado com dois estados */}
      <footer className="relative flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-6 py-3">
        <span className="text-xs text-slate-500">
          A simulação reage aos valores digitados nas variáveis
        </span>
        {temResultado ? (
          <span className="relative rounded-xl bg-gradient-to-r from-emerald-500/60 to-sky-500/60 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <span className="block rounded-[10.5px] bg-slate-950/90 px-4 py-1.5 text-sm font-bold text-emerald-300">
              {formatarResultado(resultado)}
              {topico.unidadeResultado && ` ${topico.unidadeResultado}`}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-1.5 text-xs text-slate-400 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500" aria-hidden />
            preencha as variáveis para calcular
          </span>
        )}
      </footer>
    </section>
  )
}