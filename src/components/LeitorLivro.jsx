import { useEffect, useState } from 'react'
import { AREA_LIVRO, carregarProgresso, salvarProgresso } from '../data/Livros/livros'
import { paginasDe } from '../data/Livros/amostras'
import LivroFisico from './LivroFisico'

// Posição de página por livro (chave própria — a de "Continuar lendo" guarda só datas).
const CHAVE_PAGINA = 'ciencialab-pagina-livros'

const KEYFRAMES = `
@keyframes abrirLivro { from { transform: rotateY(72deg) scale(.82); opacity: 0 } to { transform: rotateY(0deg) scale(1); opacity: 1 } }
@keyframes fecharLivro { from { transform: rotateY(0deg) scale(1); opacity: 1 } to { transform: rotateY(-72deg) scale(.82); opacity: 0 } }
@keyframes surgir { from { opacity: 0; transform: translate(-50%, 10px) } to { opacity: 1; transform: translate(-50%, 0) } }
`

const lerPaginas = () => {
  try { return JSON.parse(localStorage.getItem(CHAVE_PAGINA)) || {} } catch { return {} }
}

// Leitor em tela cheia: modo "livro físico" com folhas animadas,
// fallback para a digitalização original e abertura/fechamento em 3D.
export default function LeitorLivro({ livro, onFechar }) {
  const amostra = paginasDe(livro) // null nos livros sem texto transcrito
  const [modo, setModo] = useState(amostra ? 'fisico' : 'digital')
  const [saindo, setSaindo] = useState(false)
  const [carregado, setCarregado] = useState(false)
  const area = AREA_LIVRO[livro.area]

  // Ao abrir, marca o livro como "em leitura" (abastece Continuar lendo).
  useEffect(() => {
    const p = carregarProgresso()
    p[livro.id] = Date.now()
    salvarProgresso(p)
  }, [livro.id])

  // A cada folha virada, guarda a posição no navegador.
  const guardarPagina = (pg) => {
    try {
      const dados = lerPaginas()
      dados[livro.id] = pg
      localStorage.setItem(CHAVE_PAGINA, JSON.stringify(dados))
    } catch { /* sem storage: ignora */ }
  }

  const trocarModo = (novo) => {
    if (novo === modo) return
    setModo(novo)
    if (novo === 'digital') setCarregado(false)
  }

  // Fecha com a animação reversa antes de desmontar.
  const fechar = () => {
    setSaindo(true)
    setTimeout(onFechar, 420)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      <style>{KEYFRAMES}</style>

      {/* Cabeçalho: voltar, identidade, alternância de modo e PDF */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={fechar}
            className="group flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95"
          >
            <span className="text-base transition-transform group-hover:-translate-x-0.5" aria-hidden>←</span>
            Voltar
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white md:text-base">{livro.titulo}</h2>
            <p className="truncate text-xs text-slate-400">
              {livro.autor} · {livro.ano} · <span className={area.texto}>{area.rotulo}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {amostra && (
            <div className="flex rounded-xl bg-white/10 p-1 ring-1 ring-white/15">
              <button
                type="button"
                onClick={() => trocarModo('fisico')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  modo === 'fisico' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                📖 <span className="hidden sm:inline">Livro animado</span>
              </button>
              <button
                type="button"
                onClick={() => trocarModo('digital')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  modo === 'digital' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🗄️ <span className="hidden sm:inline">Digitalização</span>
              </button>
            </div>
          )}
          <a
            href={livro.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 active:scale-95"
          >
            <span aria-hidden>⬇</span> Baixar PDF
            <span className="hidden text-xs font-medium text-white/70 sm:inline">({livro.pdfTamanho})</span>
          </a>
        </div>
      </header>

      {/* Palco: abre em 3D pela lombada e fecha no sentido inverso */}
      <div className="relative flex-1 overflow-hidden" style={{ perspective: '1600px' }}>
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: 'left center',
            animation: saindo ? 'fecharLivro .42s ease-in forwards' : 'abrirLivro .65s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          {modo === 'fisico' && amostra ? (
            <LivroFisico
              paginas={amostra.paginas}
              paginaInicial={lerPaginas()[livro.id] ?? 0}
              aoVirar={guardarPagina}
              rotulo={amostra.rotulo}
              fonte={amostra.fonte}
            />
          ) : (
            <>
              {!carregado && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400/30 border-t-sky-400" />
                  <p className="text-sm font-semibold text-slate-300">Abrindo a digitalização…</p>
                  <p className="max-w-xs text-center text-xs text-slate-500">
                    acervos públicos às vezes levam alguns segundos na primeira abertura
                  </p>
                </div>
              )}
              <iframe
                src={livro.leituraUrl}
                title={livro.titulo}
                onLoad={() => setCarregado(true)}
                allowFullScreen
                className="h-full w-full border-0"
              />
            </>
          )}
        </div>

        {modo === 'digital' && carregado && !saindo && (
          <span
            className="pointer-events-none absolute bottom-4 left-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-slate-300 backdrop-blur"
            style={{ animation: 'surgir .5s ease-out .8s both' }}
          >
            navegue as páginas dentro do leitor · use "Voltar" no topo para fechar
          </span>
        )}
      </div>
    </div>
  )
}