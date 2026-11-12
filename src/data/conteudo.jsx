const topicosFisica = [
  {
    id: 'carga-eletrica',
    grupo: 'Eletrostática',
    titulo: 'Carga Elétrica',
    formula: 'Q = n · e',
    descricao: 'Carga total a partir da quantidade de elétrons em excesso ou falta.',
    unidadeResultado: 'C',
    variaveis: [
      { chave: 'n', label: 'n — quantidade de elétrons', placeholder: 'Ex.: 2', unidade: 'elétrons' },
      { chave: 'e', label: 'e — carga elementar', placeholder: '1,6e-19', unidade: 'C', valorPadrao: '1,6e-19' },
    ],
    calcular: ({ n, e }) => n * e,
  },
  {
    id: 'forca-eletrica',
    grupo: 'Eletrostática',
    titulo: 'Força Elétrica (Coulomb)',
    formula: 'F = k · Q₁ · Q₂ / d²',
    descricao: 'Força de atração ou repulsão entre duas cargas puntiformes.',
    unidadeResultado: 'N',
    variaveis: [
      { chave: 'k', label: 'k — constante eletrostática', placeholder: '9e9', unidade: 'N·m²/C²', valorPadrao: '9e9' },
      { chave: 'Q1', label: 'Q₁ — carga 1', placeholder: 'Ex.: 2e-6', unidade: 'C' },
      { chave: 'Q2', label: 'Q₂ — carga 2', placeholder: 'Ex.: 3e-6', unidade: 'C' },
      { chave: 'd', label: 'd — distância entre as cargas', placeholder: 'Ex.: 0,1', unidade: 'm' },
    ],
    calcular: ({ k, Q1, Q2, d }) => (k * Q1 * Q2) / (d * d),
  },
  {
    id: 'campo-eletrico',
    grupo: 'Eletrostática',
    titulo: 'Campo Elétrico',
    formula: 'E = k · Q / d²',
    descricao: 'Campo gerado por uma carga puntiforme a uma distância d.',
    unidadeResultado: 'N/C',
    variaveis: [
      { chave: 'k', label: 'k — constante eletrostática', placeholder: '9e9', unidade: 'N·m²/C²', valorPadrao: '9e9' },
      { chave: 'Q', label: 'Q — carga fonte', placeholder: 'Ex.: 5e-6', unidade: 'C' },
      { chave: 'd', label: 'd — distância até a carga', placeholder: 'Ex.: 0,2', unidade: 'm' },
    ],
    calcular: ({ k, Q, d }) => (k * Q) / (d * d),
  },
  {
    id: 'forca-magnetica',
    grupo: 'Eletromagnetismo',
    titulo: 'Força Magnética',
    formula: 'F = B · I · L · sen(θ)',
    descricao: 'Força sobre um condutor reto dentro de um campo magnético uniforme.',
    unidadeResultado: 'N',
    variaveis: [
      { chave: 'B', label: 'B — campo magnético', placeholder: 'Ex.: 0,5', unidade: 'T' },
      { chave: 'I', label: 'I — corrente elétrica', placeholder: 'Ex.: 2', unidade: 'A' },
      { chave: 'L', label: 'L — comprimento do condutor', placeholder: 'Ex.: 0,3', unidade: 'm' },
      { chave: 'theta', label: 'θ — ângulo entre B e o condutor', placeholder: 'Ex.: 90', unidade: 'graus' },
    ],
    calcular: ({ B, I, L, theta }) => B * I * L * Math.sin((theta * Math.PI) / 180),
  },
  {
    id: 'solenoide',
    grupo: 'Eletromagnetismo',
    titulo: 'Eletroímã (Solenoide)',
    formula: 'B = μ₀ · (N / L) · I',
    descricao: 'Campo magnético interno de um solenoide com N espiras e corrente I.',
    unidadeResultado: 'T',
    variaveis: [
      { chave: 'N', label: 'N — número de espiras', placeholder: 'Ex.: 500', unidade: 'espiras' },
      { chave: 'L', label: 'L — comprimento do solenoide', placeholder: 'Ex.: 0,25', unidade: 'm' },
      { chave: 'I', label: 'I — corrente elétrica', placeholder: 'Ex.: 3', unidade: 'A' },
    ],
    calcular: ({ N, L, I }) => (4 * Math.PI * 1e-7) * (N / L) * I,
  },
  {
    id: 'fluxo-magnetico',
    grupo: 'Eletromagnetismo',
    titulo: 'Fluxo Magnético',
    formula: 'Φ = B · A · cos(θ)',
    descricao: 'Quantidade de campo magnético que atravessa uma área A.',
    unidadeResultado: 'Wb',
    variaveis: [
      { chave: 'B', label: 'B — campo magnético', placeholder: 'Ex.: 0,2', unidade: 'T' },
      { chave: 'A', label: 'A — área da superfície', placeholder: 'Ex.: 0,04', unidade: 'm²' },
      { chave: 'theta', label: 'θ — ângulo entre B e a normal', placeholder: 'Ex.: 0', unidade: 'graus' },
    ],
    calcular: ({ B, A, theta }) => B * A * Math.cos((theta * Math.PI) / 180),
  },
  {
    id: 'faraday',
    grupo: 'Eletromagnetismo',
    titulo: 'Lei de Faraday',
    formula: 'E = N · ΔΦ / Δt',
    descricao: 'Força eletromotriz induzida pela variação do fluxo magnético.',
    unidadeResultado: 'V',
    variaveis: [
      { chave: 'N', label: 'N — número de espiras', placeholder: 'Ex.: 200', unidade: 'espiras' },
      { chave: 'dPhi', label: 'ΔΦ — variação de fluxo', placeholder: 'Ex.: 0,02', unidade: 'Wb' },
      { chave: 'dt', label: 'Δt — intervalo de tempo', placeholder: 'Ex.: 0,5', unidade: 's' },
    ],
    calcular: ({ N, dPhi, dt }) => N * (dPhi / dt),
  },
]

const topicosQuimica = [
  {
    id: 'estequiometria',
    grupo: 'Química Geral',
    titulo: 'Estequiometria',
    formula: 'n = m / M',
    descricao: 'Quantidade de matéria a partir da massa e da massa molar.',
    unidadeResultado: 'mol',
    variaveis: [
      { chave: 'm', label: 'm — massa da amostra', placeholder: 'Ex.: 18', unidade: 'g' },
      { chave: 'M', label: 'M — massa molar', placeholder: 'Ex.: 18', unidade: 'g/mol' },
    ],
    calcular: ({ m, M }) => m / M,
  },
  {
    id: 'ph',
    grupo: 'Soluções',
    titulo: 'pH da solução',
    formula: 'pH = −log [H⁺]',
    descricao: 'Acidez da solução a partir da concentração de íons hidrônio.',
    variaveis: [
      { chave: 'H', label: '[H⁺] — concentração de íons', placeholder: 'Ex.: 1e-3', unidade: 'mol/L' },
    ],
    calcular: ({ H }) => -Math.log10(H),
  },
]

const topicosBiologia = [
  {
    id: 'fotossintese',
    grupo: 'Bioquímica',
    titulo: 'Fotossíntese',
    formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    descricao: 'Equação global da produção de glicose a partir de luz, água e gás carbônico.',
    variaveis: [],
  },
  {
    id: 'respiracao-celular',
    grupo: 'Bioquímica',
    titulo: 'Respiração Celular',
    formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
    descricao: 'Degradação da glicose com liberação de energia para a célula.',
    variaveis: [],
  },
]

export const areas = [
  {
    id: 'fisica',
    nome: 'Física',
    descricao: 'Eletrostática, eletromagnetismo e mais.',
    icone: '⚛️',
    tema: {
      gradiente: 'from-sky-500 to-indigo-600',
      sombra: 'shadow-sky-500/30',
      itemAtivo: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
      focoInput: 'focus:border-sky-500 focus:ring-sky-100',
    },
    topicos: topicosFisica,
  },
  {
    id: 'quimica',
    nome: 'Química',
    descricao: 'Estequiometria, soluções e reações.',
    icone: '🧪',
    tema: {
      gradiente: 'from-emerald-500 to-teal-600',
      sombra: 'shadow-emerald-500/30',
      itemAtivo: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      focoInput: 'focus:border-emerald-500 focus:ring-emerald-100',
    },
    topicos: topicosQuimica,
  },
  {
    id: 'biologia',
    nome: 'Biologia',
    descricao: 'Bioquímica, genética e processos vitais.',
    icone: '🧬',
    tema: {
      gradiente: 'from-amber-500 to-orange-600',
      sombra: 'shadow-amber-500/30',
      itemAtivo: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      focoInput: 'focus:border-amber-500 focus:ring-amber-100',
    },
    topicos: topicosBiologia,
  },
]

export function parseValor(texto) {
  if (typeof texto !== 'string') return NaN
  const limpo = texto.trim().replace(',', '.')
  if (limpo === '') return NaN
  const numero = Number(limpo)
  return Number.isFinite(numero) ? numero : NaN
}

export function formatarResultado(valor) {
  if (valor === 0) return '0'
  const absoluto = Math.abs(valor)
  if (absoluto >= 1e6 || absoluto < 1e-3) {
    const [mantissa, expoente] = valor.toExponential(3).split('e')
    const m = Number(mantissa).toLocaleString('pt-BR', { maximumFractionDigits: 3 })
    return `${m} × 10${sobrescrito(Number(expoente))}`
  }
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 4 })
}

function sobrescrito(n) {
  const mapa = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
  return String(n).split('').map((c) => mapa[c] ?? c).join('')
}