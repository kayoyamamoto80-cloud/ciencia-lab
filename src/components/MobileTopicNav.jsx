export default function MobileTopicNav({ area, topicoSelecionado, onSelecionar, onVoltar }) {
  return (
    <div className="border-b border-slate-200 bg-white md:hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onVoltar}
          aria-label="Voltar para a tela inicial"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          ←
        </button>
        <span className="font-bold text-slate-900">
          {area.icone} {area.nome}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {area.topicos.map((topico) => {
          const ativo = topico.id === topicoSelecionado
          return (
            <button
              key={topico.id}
              type="button"
              onClick={() => onSelecionar(topico.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                ativo ? area.tema.itemAtivo : 'bg-slate-100 text-slate-600'
              }`}
            >
              {topico.titulo}
            </button>
          )
        })}
      </div>
    </div>
  )
}