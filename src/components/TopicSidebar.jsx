export default function TopicSidebar({ area, topicoSelecionado, onSelecionar, onVoltar }) {
  const grupos = {}
  for (const t of area.topicos) {
    if (!grupos[t.grupo]) grupos[t.grupo] = []
    grupos[t.grupo].push(t)
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
        <button
          type="button"
          onClick={onVoltar}
          aria-label="Voltar para a tela inicial"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
        >
          ←
        </button>
        <span className="text-lg" aria-hidden>{area.icone}</span>
        <span className="font-extrabold tracking-tight text-slate-900">{area.nome}</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(grupos).map(([grupo, topicos]) => (
          <div key={grupo} className="mb-6">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {grupo}
            </p>
            <ul className="space-y-1">
              {topicos.map((topico) => {
                const ativo = topico.id === topicoSelecionado
                return (
                  <li key={topico.id}>
                    <button
                      type="button"
                      onClick={() => onSelecionar(topico.id)}
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                        ativo
                          ? area.tema.itemAtivo
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{topico.titulo}</span>
                      <span className="mt-0.5 block font-mono text-xs text-slate-400">
                        {topico.formula}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}