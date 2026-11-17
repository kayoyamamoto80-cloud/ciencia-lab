import { useState } from 'react'
import HomePage from './components/HomePage'
import WorkspacePage from './components/WorkspacePage'
import LivrosPage from './components/LivrosPage'
import { areas } from './data/conteudo'

export default function App() {
  const [areaId, setAreaId] = useState(null)
  const [topicoId, setTopicoId] = useState(null)
  const [valores, setValores] = useState({})
  const [bibliotecaAberta, setBibliotecaAberta] = useState(false)

  const areaAtual = areas.find((a) => a.id === areaId) ?? null
  const topicoAtual = areaAtual?.topicos.find((t) => t.id === topicoId) ?? null

  function selecionarArea(id) {
    const area = areas.find((a) => a.id === id)
    setAreaId(id)
    setTopicoId(area.topicos[0]?.id ?? null)
    setBibliotecaAberta(false)
  }

  // Voltar fecha tanto a área quanto a biblioteca — sempre cai na home.
  function voltar() {
    setAreaId(null)
    setTopicoId(null)
    setBibliotecaAberta(false)
  }

  // Banner "Livros" da home: limpa a área ativa e abre a biblioteca.
  function abrirBiblioteca() {
    setAreaId(null)
    setTopicoId(null)
    setBibliotecaAberta(true)
  }

  function alterarValor(topicoIdAtual, chave, valor) {
    setValores((prev) => ({
      ...prev,
      [topicoIdAtual]: { ...prev[topicoIdAtual], [chave]: valor },
    }))
  }

  // Tela da biblioteca tem prioridade quando aberta.
  if (bibliotecaAberta) {
    return <LivrosPage onVoltar={voltar} />
  }

  if (!areaAtual) {
    return <HomePage areas={areas} onSelecionarArea={selecionarArea} onAbrirLivros={abrirBiblioteca} />
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