import { useState } from 'react'
import HomePage from './components/HomePage'
import WorkspacePage from './components/WorkspacePage'
import { areas } from './data/conteudo'

export default function App() {
  const [areaId, setAreaId] = useState(null)
  const [topicoId, setTopicoId] = useState(null)
  const [valores, setValores] = useState({})

  const areaAtual = areas.find((a) => a.id === areaId) ?? null
  const topicoAtual = areaAtual?.topicos.find((t) => t.id === topicoId) ?? null

  function selecionarArea(id) {
    const area = areas.find((a) => a.id === id)
    setAreaId(id)
    setTopicoId(area.topicos[0]?.id ?? null)
  }

  function voltar() {
    setAreaId(null)
    setTopicoId(null)
  }

  function alterarValor(topicoIdAtual, chave, valor) {
    setValores((prev) => ({
      ...prev,
      [topicoIdAtual]: { ...prev[topicoIdAtual], [chave]: valor },
    }))
  }

  if (!areaAtual) {
    return <HomePage areas={areas} onSelecionarArea={selecionarArea} />
  }

  if (!topicoAtual) return null

  return (
    <WorkspacePage
      area={areaAtual}
      topico={topicoAtual}
      valores={valores[topicoAtual.id] ?? {}}
      onAlterarValor={alterarValor}
      onSelecionarTopico={setTopicoId}
      onVoltar={voltar}
    />
  )
}