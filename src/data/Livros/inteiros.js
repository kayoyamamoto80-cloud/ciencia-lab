// Mapa dos textos completos (Project Gutenberg) servidos de public/livros/.
// Se o arquivo existir, o livro abre COMPLETO no modo animado.
// Se faltar, o leitor recua automaticamente: amostra → digitalização.
export const INTEIROS = {
  'origem-especies': {
    arquivo: '/livros/origem-especies.txt',
    rotulo: 'On the Origin of Species — 1ª edição (1859), completa',
    fonte: 'Project Gutenberg #1228',
  },
  principia: {
    arquivo: '/livros/principia.txt',
    rotulo: "Newton's Principia — tradução de Motte, completa",
    fonte: 'Project Gutenberg #76404',
  },
  'sceptical-chymist': {
    arquivo: '/livros/sceptical-chymist.txt',
    rotulo: 'The Sceptical Chymist (1661), completa',
    fonte: 'Project Gutenberg #22914',
  },
  micrographia: {
    arquivo: '/livros/micrographia.txt',
    rotulo: 'Micrographia (1665), completa',
    fonte: 'Project Gutenberg #15491',
  },
  'lavoisier-traite': {
    arquivo: '/livros/lavoisier-traite.txt',
    rotulo: 'Traité élémentaire de chimie (1789), completa',
    fonte: 'Project Gutenberg #52489',
  },
  // 'principia-latin' fica de fora: sem texto corrido único em domínio público.
  // Ele continua com amostra animada + digitalização, como já está hoje.
}