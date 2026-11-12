import TopicSidebar from './TopicSidebar'
import MobileTopicNav from './MobileTopicNav'
import VariableInput from './VariableInput'
import SimulationPanel from './SimulationPanel'
import { parseValor } from '../data/conteudo'

// Área de trabalho: variáveis à esquerda, simulação dominante à direita.
export default function WorkspacePage({ area, topico, valores, onAlterarValor, onSelecionarTopico, onVoltar }) {
  const valorDa = (variavel) => valores[variavel.chave] ?? variavel.valorPadrao ?? ''
  const temVariaveis = topico.variaveis.length > 0

  // valores efetivos (com padrões aplicados) alimentam a cena ao vivo
  const valoresEfetivos = Object.fromEntries(
    topico.variaveis.map((v) => [v.chave, valorDa(v)])
  )
  const valoresNumericos = topico.variaveis.map((v) => parseValor(valorDa(v)))
  const entradasValidas = valoresNumericos.every(Number.isFinite)

  const resultado =
    temVariaveis && entradasValidas
      ? topico.calcular(
          Object.fromEntries(topico.variaveis.map((v, i) => [v.chave, valoresNumericos[i]]))
        )
      : null

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:h-screen md:flex-row md:overflow-hidden">
      <div className="hidden h-full md:flex md:shrink-0">
        <TopicSidebar
          area={area}
          topicoSelecionado={topico.id}
          onSelecionar={onSelecionarTopico}
          onVoltar={onVoltar}
        />
      </div>

      <MobileTopicNav
        area={area}
        topicoSelecionado={topico.id}
        onSelecionar={onSelecionarTopico}
        onVoltar={onVoltar}
      />

      <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 md:gap-6 md:p-6">
        <section className="w-full md:w-[380px] md:shrink-0">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {area.nome} · {topico.grupo}
            </p>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
              {topico.titulo}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{topico.descricao}</p>

            <div
              className={`mt-4 rounded-2xl bg-gradient-to-br px-4 py-4 text-center font-mono text-lg font-bold text-white shadow-md ${area.tema.gradiente} ${area.tema.sombra}`}
            >
              {topico.formula}
            </div>

            {temVariaveis ? (
              <div className="mt-6 space-y-5">
                {topico.variaveis.map((variavel) => (
                  <VariableInput
                    key={variavel.chave}
                    variavel={variavel}
                    valor={valorDa(variavel)}
                    onChange={(novoValor) => onAlterarValor(topico.id, variavel.chave, novoValor)}
                    focoInput={area.tema.focoInput}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                Este tópico não possui variáveis numéricas — observe a equação na simulação.
              </p>
            )}

            <div className="mt-6">
              {resultado !== null ? (
                <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                  ✅ Valores válidos — simulação atualizada ao vivo
                </p>
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500 ring-1 ring-slate-200">
                  ⏳ Aguardando valores válidos nas variáveis
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="min-h-[420px] flex-1">
          <SimulationPanel topico={topico} valores={valoresEfetivos} resultado={resultado} />
        </section>
      </main>
    </div>
  )
}