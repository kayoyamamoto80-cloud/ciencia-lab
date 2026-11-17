export const LIVROS = [
  {
    id: 'principia',
    titulo: 'Principia — Mathematical Principles of Natural Philosophy',
    autor: 'Isaac Newton',
    ano: 1848,
    area: 'fisica',
    idioma: 'Inglês (tradução)',
    popular: true,
    sinopse:
      'A obra que fundou a física moderna: as três leis do movimento e a gravitação universal, em tradução inglesa da época vitoriana. É o livro que definiu como a ciência descreve o universo com matemática.',
    leituraUrl: 'https://archive.org/embed/newtonsprincipia00newt_0',
    pdfUrl: 'https://archive.org/download/newtonsprincipia00newt_0/newtonsprincipia00newt_0.pdf',
    pdfTamanho: '47 MB',
  },
  {
    id: 'principia-latin',
    titulo: 'Philosophiæ Naturalis Principia Mathematica',
    autor: 'Isaac Newton',
    ano: 1686,
    area: 'fisica',
    idioma: 'Latim (1ª edição)',
    popular: false,
    sinopse:
      'A primeira edição latina, digitalizada pela Royal Society de Londres — o mesmo exemplar que os cientistas do século XVII seguraram nas mãos. Uma relíquia histórica para admirar e folhear.',
    leituraUrl: 'https://archive.org/embed/1686-newton-principia-1ed',
    pdfUrl: 'https://archive.org/download/1686-newton-principia-1ed/1686-Newton-Principia-1ed.pdf',
    pdfTamanho: '124 MB',
  },
  {
    id: 'sceptical-chymist',
    titulo: 'The Sceptical Chymist',
    autor: 'Robert Boyle',
    ano: 1661,
    area: 'quimica',
    idioma: 'Inglês antigo',
    popular: true,
    sinopse:
      'O livro que separou a química da alquimia. Boyle rompe com os quatro elementos de Aristóteles em formato de diálogo, fundando a química moderna e a ideia de que a ciência nasce da dúvida metódica.',
    leituraUrl: 'https://archive.org/embed/scepticalchymis00BoylA',
    pdfUrl: 'https://archive.org/download/scepticalchymis00BoylA/scepticalchymis00BoylA.pdf',
    pdfTamanho: '20 MB',
  },
  {
    id: 'lavoisier-traite',
    titulo: 'Traité élémentaire de chimie',
    autor: 'Antoine Lavoisier',
    ano: 1789,
    area: 'quimica',
    idioma: 'Francês',
    popular: true,
    sinopse:
      'O tratado que criou a nomenclatura química e a lei da conservação das massas, com os desenhos do próprio laboratório de Lavoisier. Aqui nasce a química como ciência de medição — e a oxidação deixa de ser mistério.',
    leituraUrl: 'https://archive.org/embed/TraiteYeYleYment2Lavo',
    pdfUrl: 'https://archive.org/download/TraiteYeYleYment2Lavo/TraiteYeYleYment2Lavo.pdf',
    pdfTamanho: '17 MB',
  },
  {
    id: 'origem-especies',
    titulo: 'On the Origin of Species',
    autor: 'Charles Darwin',
    ano: 1859,
    area: 'biologia',
    idioma: 'Inglês (1ª edição)',
    popular: true,
    sinopse:
      'A primeira edição, primeiro tiragem — o livro mais importante da biologia. Darwin apresenta a seleção natural com a clareza de um contador de histórias: observe, acumule evidências, conclua.',
    leituraUrl: 'https://archive.org/embed/darwin-online_1859_Origin_F373',
    pdfUrl: 'https://archive.org/download/darwin-online_1859_Origin_F373/1859_Origin_F373.pdf',
    pdfTamanho: '92 MB',
  },
  {
    id: 'micrographia',
    titulo: 'Micrographia',
    autor: 'Robert Hooke',
    ano: 1665,
    area: 'biologia',
    idioma: 'Inglês antigo',
    popular: false,
    sinopse:
      'O primeiro best-seller do mundo microscópico: Hooke viu e batizou as "células" aqui, com gravuras gigantes de pulgas e cortiça que até hoje impressionam. Ciência e arte na mesma página.',
    leituraUrl: 'https://archive.org/embed/b30326370',
    pdfUrl: 'https://archive.org/download/b30326370/b30326370.pdf',
    pdfTamanho: '48 MB',
  },
]

export const AREA_LIVRO = {
  fisica: { rotulo: 'Física', icone: '⚛️', gradiente: 'from-blue-500 to-violet-600', texto: 'text-blue-300', borda: 'ring-blue-400/30' },
  quimica: { rotulo: 'Química', icone: '🧪', gradiente: 'from-emerald-500 to-teal-600', texto: 'text-emerald-300', borda: 'ring-emerald-400/30' },
  biologia: { rotulo: 'Biologia', icone: '🧬', gradiente: 'from-amber-500 to-orange-600', texto: 'text-amber-300', borda: 'ring-amber-400/30' },
}

// Chave do localStorage: progresso de leitura salvo no navegador.
export const CHAVE_PROGRESSO = 'ciencialab-progresso-livros'

export const carregarProgresso = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PROGRESSO)) || {}
  } catch {
    return {}
  }
}

export const salvarProgresso = (progresso) => {
  try {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso))
  } catch {
    /* navegador sem storage: ignora */
  }
}

export const livroPorId = (id) => LIVROS.find((l) => l.id === id)