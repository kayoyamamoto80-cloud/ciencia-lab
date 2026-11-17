import { INTEIROS } from './inteiros'

// Extrai, limpa e estrutura o texto completo (Project Gutenberg) em blocos
// de leitura — títulos de capítulos e parágrafos — prontos para as folhas 3D.

const cache = new Map()

const RE_INICIO = /\*\*\*\s*START OF THE PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
const RE_FIM = /\*\*\*\s*END OF THE PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
const RE_GUTENBERG = /project gutenberg|gutenberg\.org/i
const RE_ILUSTRACAO = /^\[illustration|^\[image/i
const RE_META = /^(produced by|transcriber|credits:|click on any|various characteristics|there are several editions)/i
const RE_TITULO =
  /^(chapter\s+[ivxlc\d]+|chap\.\s*[ivxlc\d]+|chapitre\s+[ivxlcd]+|livre\s+[ivxlcd]+|part\s+[ivxlc\d]+|the\s+\w+\s+part|dialogue|observ\.?\s*[ivx\d]+|observation|section|appendix|introduction|preface|préface|discours|conclusion|the end|cap[íi]tulo\s+[ivxlc\d]+|livro\s+[ivxlc\d]+)/i

// Um bloco é título se for curto, quase todo em maiúsculas
// ou casar com o padrão de capítulo (sem ser frase corrente).
const pareceTitulo = (t) => {
  if (!t || t.length > 120) return false
  if (/[.,;]\s*\p{Ll}/u.test(t)) return false // frases completas não são títulos
  const letras = t.replace(/[^A-Za-zÀ-ÿ]/g, '')
  if (!letras) return false
  const razao = letras.replace(/[^A-ZÀ-Þ]/g, '').length / letras.length
  return RE_TITULO.test(t) || (razao > 0.7 && t.length < 100)
}

// Busca o .txt de public/livros/, limpa e devolve blocos em ordem de leitura.
export async function carregarBlocos(livroId) {
  const config = INTEIROS[livroId]
  if (!config) return null
  if (cache.has(livroId)) return cache.get(livroId)

  const resposta = await fetch(config.arquivo)
  if (!resposta.ok) throw new Error(`Texto não encontrado: ${config.arquivo}`)
  let texto = (await resposta.text()).replace(/\r\n?/g, '\n')

  // Corta a licença do Gutenberg (cabeçalho e rodapé).
  const ini = texto.search(RE_INICIO)
  if (ini !== -1) texto = texto.slice(texto.indexOf('\n', ini) + 1)
  const fim = texto.search(RE_FIM)
  if (fim !== -1) texto = texto.slice(0, fim)

  // Blocos = trechos separados por linha em branco.
  const brutos = texto.split(/\n\s*\n+/)
  const blocos = []
  let pularProximo = 0

  for (const bruto of brutos) {
    // Desfaz a quebra de papel: recola hifenização e junta as linhas.
    let t = bruto
      .split('\n')
      .map((l) => l.trim())
      .join('\n')
      .replace(/(\p{L})-\n(\p{L})/gu, '$1$2')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()

    if (!t || RE_ILUSTRACAO.test(t)) continue

    // Descarta lixo editorial (notas do Gutenberg) + o bloco seguinte.
    if (RE_META.test(t) || RE_GUTENBERG.test(t)) {
      pularProximo = 1
      continue
    }
    if (pularProximo > 0 && t.length < 220) {
      pularProximo -= 1
      continue
    }
    pularProximo = 0

    // Junta títulos consecutivos (ex.: "CHAPTER I." + subtítulo) num só bloco.
    if (pareceTitulo(t)) {
      const ultimo = blocos[blocos.length - 1]
      if (ultimo && ultimo.tipo === 'titulo') ultimo.texto += '\n' + t
      else blocos.push({ tipo: 'titulo', texto: t })
      continue
    }

    blocos.push({ tipo: 'paragrafo', texto: t })
  }

  const resultado = { rotulo: config.rotulo, fonte: config.fonte, blocos }
  cache.set(livroId, resultado)
  return resultado
}