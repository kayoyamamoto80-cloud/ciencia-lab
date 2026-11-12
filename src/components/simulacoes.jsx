import SimEletrostatica from './cenas/Eletrostatica'
import SimEletromagnetismo from './cenas/Eletromagnetismo'
import { SimQuimica, SimBiologia, SimGenerica } from './cenas/Ultimas'

const CENAS = {
  'carga-eletrica': ['eletrostatica', 'carga'],
  'forca-eletrica': ['eletrostatica', 'coulomb'],
  'campo-eletrico': ['eletrostatica', 'campo'],
  'forca-magnetica': ['eletromagnetismo', 'forca'],
  solenoide: ['eletromagnetismo', 'solenoide'],
  'fluxo-magnetico': ['eletromagnetismo', 'fluxo'],
  faraday: ['eletromagnetismo', 'faraday'],
  estequiometria: ['quimica', 'mols'],
  ph: ['quimica', 'ph'],
  fotossintese: ['biologia', 'fotossintese'],
  'respiracao-celular': ['biologia', 'respiracao'],
}

// Ponto de entrada: escolhe a cena conforme o tópico selecionado.
export default function CenaSimulacao({ topico, valores, resultado }) {
  const [familia, tipo] = CENAS[topico.id] ?? ['generico', 'generico']
  const props = { tipo, valores, resultado }
  if (familia === 'eletrostatica') return <SimEletrostatica {...props} />
  if (familia === 'eletromagnetismo') return <SimEletromagnetismo {...props} />
  if (familia === 'quimica') return <SimQuimica {...props} />
  if (familia === 'biologia') return <SimBiologia {...props} />
  return <SimGenerica topico={topico} />
}