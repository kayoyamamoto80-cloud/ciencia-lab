import { useState } from 'react'
import { LIVROS, AREA_LIVRO, carregarProgresso, livroPorId } from '../data/Livros/livros'
import LeitorLivro from './LeitorLivro'

// Abas da biblioteca.
const ABAS = [
  { id: 'populares', rotulo: 'Populares', icone: '🔥' },
  { id: 'internacional', rotulo: 'Internacional', icone: '🌍' },
  { id: 'continuar', rotulo: 'Continuar lendo', icone: '🔖' },
]

const ANIMACOES = `
@keyframes surgeGrade { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
@keyframes surgeCard { from { opacity: 0; transform: translateY(18px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
`

// Capa estilizada em CSS: cores da área + lombada + brilho no canto.
function CapaLivro({ livro }) {
  const area = AREA_LIVRO[livro.area]
  return (
    <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${area.gradiente} p-4`}>
      <div className="absolute inset-y-0 left-0 w-2.5 bg-black/25" aria-hidden />
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15 blur-xl" aria-hidden />
      <span className="relative text-3xl" aria-hidden>{area.icone}</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/85">
        {area.rotulo}
      </span>
      <div className="absolute bottom-4 left-4 right-4">
        <span className="block text-sm font-extrabold leading-tight text-white">{livro.titulo}</span>
        <span className="mt-1 block text-[11px] font-medium text-white/80">{livro.autor} · {livro.ano}</span>
      </div>
    </div>
  )
}

// Card de livro: capa + sinopse + botão "Ler agora" + entrada em cascata.
function LivroCard({ livro, indice, onAbrir, extra = null }) {
  const area = AREA_LIVRO[livro.area]
  return (
    <button
      type="button"
      onClick={() => onAbrir(livro)}
      style={{ animation: `surgeCard .5s ease-out ${indice * 0.07}s both` }}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md ring-1 ${area.borda} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-4`}
    >
      <CapaLivro livro={livro} />
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{livro.sinopse}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-400">{livro.idioma}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors duration-300 group-hover:bg-slate-900 group-hover:text-white">
            Ler agora
            <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>→</span>
          </span>
        </div>
      </div>
      {extra}
    </button>
  )
}

// Página da biblioteca: abas animadas, catálogo por área e progresso salvo.
export default function LivrosPage({ onVoltar }) {
  const [aba, setAba] = useState('populares')
  const [livroAberto, setLivroAberto] = useState(null)
  const [progresso, setProgresso] = useState(carregarProgresso())

  // Ao fechar o leitor, recarrega o progresso (atualiza "Continuar lendo").
  const fecharLeitor = () => {
    setLivroAberto(null)
    setProgresso(carregarProgresso())
  }

  const populares = LIVROS.filter((l) => l.popular)
  const emAndamento = Object.entries(progresso)
    .sort((a, b) => b[1] - a[1])
    .map(([id, quando]) => ({ livro: livroPorId(id), quando }))
    .filter((e) => e.livro)
  const areaAtual = AREA_LIVRO[aba === 'continuar' && emAndamento.length ? emAndamento[0].livro.area : 'fisica']

  const grade = (lista, comData = false) => (
    <div key={aba} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ animation: 'surgeGrade .45s ease-out both' }}>
      {lista.map((item, i) => (
        <LivroCard
          key={item.livro.id}
          livro={item.livro}
          indice={i}
          onAbrir={setLivroAberto}
          extra={
            comData ? (
              <div className="border-t border-slate-100 px-4 py-2.5 text-[11px] font-semibold text-slate-400">
                🔖 Você parou aqui em {new Date(item.quando).toLocaleDateString('pt-BR')}
              </div>
            ) : null
          }
        />
      ))}
    </div>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <style>{ANIMACOES}</style>
      {/* Fundo com aurora da área em destaque */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className={`absolute -left-24 -top-32 h-96 w-96 rounded-full bg-gradient-to-br ${areaAtual.gradiente} opacity-20 blur-3xl`} />
        <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-8">
        {/* Cabeçalho */}
        <button
          type="button"
          onClick={onVoltar}
          className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white active:scale-95"
        >
          <span className="transition-transform group-hover:-translate-x-0.5" aria-hidden>←</span>
          Voltar
        </button>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              📚 Biblioteca{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                CiênciaLab
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
              Clássicos científicos originais em <strong className="text-slate-700">domínio público</strong> — leia direto no app ou baixe o PDF, de graça.
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
            {LIVROS.length} obras · 3 áreas
          </span>
        </div>

        {/* Abas com pílula deslizante */}
        <div className="mt-8 inline-flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
          {ABAS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAba(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                aba === t.id
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span aria-hidden>{t.icone}</span>
              {t.rotulo}
              {t.id === 'continuar' && emAndamento.length > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  {emAndamento.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <div className="mt-8">
          {aba === 'populares' && grade(populares.map((l) => ({ livro: l })))}

          {aba === 'internacional' &&
            ['fisica', 'quimica', 'biologia'].map((idArea) => {
              const lista = LIVROS.filter((l) => l.area === idArea)
              const area = AREA_LIVRO[idArea]
              return (
                <section key={idArea} className="mb-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${area.gradiente} text-base shadow-md`} aria-hidden>
                      {area.icone}
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-800">
                      {area.rotulo}
                      <span className="ml-2 text-sm font-semibold text-slate-400">{lista.length} obra(s)</span>
                    </h2>
                    <div className={`h-px flex-1 bg-gradient-to-r ${area.gradiente} opacity-30`} aria-hidden />
                  </div>
                  {grade(lista.map((l) => ({ livro: l })))}
                </section>
              )
            })}

          {aba === 'continuar' &&
            (emAndamento.length > 0 ? (
              grade(emAndamento, true)
            ) : (
              <div
                className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center"
                style={{ animation: 'surgeGrade .45s ease-out both' }}
              >
                <span className="text-4xl" aria-hidden>📭</span>
                <p className="text-lg font-bold text-slate-700">Nenhum livro em andamento</p>
                <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                  Abra qualquer livro pelas abas Populares ou Internacional — ele aparece aqui automaticamente para você continuar de onde parou.
                </p>
                <button
                  type="button"
                  onClick={() => setAba('populares')}
                  className="mt-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-95"
                >
                  Ver os populares →
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Leitor em tela cheia (abre por cima da biblioteca) */}
      {livroAberto && <LeitorLivro livro={livroAberto} onFechar={fecharLeitor} />}
    </div>
  )
}