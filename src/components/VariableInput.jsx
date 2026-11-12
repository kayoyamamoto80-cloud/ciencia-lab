import { parseValor } from '../data/conteudo'

// Faixas dos sliders por chave de variável: [mínimo, máximo, passo].
// Chaves sem faixa (constantes como k e e) não ganham slider.
const FAIXAS = {
  n: [0, 30, 1],
  Q1: [0, 0.00001, 0.0000005],
  Q2: [0, 0.00001, 0.0000005],
  Q: [0, 0.00002, 0.000001],
  d: [0.05, 2, 0.05],
  B: [0, 2, 0.05],
  I: [0, 15, 0.1],
  L: [0.1, 2, 0.05],
  theta: [0, 180, 1],
  N: [0, 2000, 10],
  dPhi: [0, 0.2, 0.005],
  dt: [0.1, 5, 0.1],
  m: [0, 200, 1],
  M: [1, 200, 1],
  H: [0, 0.01, 0.0001],
}

const decimalDe = (passo) => (passo >= 1 ? 0 : Math.min(6, Math.ceil(-Math.log10(passo)) + 1))

// Converte o valor do slider para o formato do campo de texto.
const formatarParaCampo = (valor, passo) => {
  if (valor === 0) return '0'
  if (Math.abs(valor) < 0.001) return valor.toExponential(2).replace('.', ',')
  return valor.toFixed(decimalDe(passo)).replace('.', ',')
}

// Campo de variável em card de vidro: label, unidade, valor atual,
// slider customizado com trilho preenchido e validação visual.
export default function VariableInput({ variavel, valor, onChange, focoInput }) {
  const texto = typeof valor === 'string' ? valor : String(valor ?? '')
  const vazio = texto.trim() === ''
  const numero = parseValor(texto)
  const invalido = !vazio && !Number.isFinite(numero)
  const faixa = FAIXAS[variavel.chave]

  // Percentual preenchido do trilho do slider (0 a 100).
  let percento = 0
  if (faixa && Number.isFinite(numero)) {
    percento = Math.min(100, Math.max(0, ((numero - faixa[0]) / (faixa[1] - faixa[0])) * 100))
  }

  return (
    <label
      className={`group block rounded-2xl border p-4 shadow-sm backdrop-blur transition-all duration-300 ${
        invalido
          ? 'border-red-300 bg-red-50/70 shadow-red-100'
          : 'border-slate-200 bg-white/80 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100'
      }`}
    >
      {/* Linha 1: nome + unidade */}
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-slate-800">{variavel.label}</span>
        {variavel.unidade && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
            {variavel.unidade}
          </span>
        )}
      </span>

      {/* Linha 2: campo + valor atual */}
      <span className="mt-2.5 flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={texto}
          onChange={(evento) => onChange(evento.target.value)}
          placeholder={variavel.placeholder}
          className={`min-w-0 flex-1 rounded-xl border bg-white py-2.5 px-3.5 font-mono text-sm text-slate-900 shadow-sm outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:ring-4 ${
            invalido
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : `border-slate-300 focus:border-sky-500 focus:ring-sky-100 ${focoInput}`
          }`}
        />
        {faixa && (
          <span
            className={`flex min-w-[72px] items-center justify-center rounded-xl px-2.5 py-2 font-mono text-sm font-bold ring-1 transition-colors ${
              invalido || !Number.isFinite(numero)
                ? 'bg-slate-50 text-slate-300 ring-slate-200'
                : 'bg-sky-50 text-sky-600 ring-sky-200'
            }`}
          >
            {Number.isFinite(numero) ? formatarParaCampo(numero, faixa[2]) : '—'}
          </span>
        )}
      </span>

      {/* Slider customizado com trilho preenchido */}
      {faixa && (
        <>
          <input
            type="range"
            min={faixa[0]}
            max={faixa[1]}
            step={faixa[2]}
            value={Number.isFinite(numero) ? numero : faixa[0]}
            onChange={(e) => onChange(formatarParaCampo(Number(e.target.value), faixa[2]))}
            aria-label={`Ajustar ${variavel.label}`}
            className="mt-3.5 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-sky-500 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(14,165,233,0.18)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-115 active:[&::-webkit-slider-thumb]:scale-105"
            style={{
              background: `linear-gradient(to right, #0ea5e9 ${percento}%, #e2e8f0 ${percento}%)`,
            }}
          />
          {/* Escala mínima — máxima */}
          <span className="mt-1 flex justify-between font-mono text-[10px] font-medium text-slate-400">
            <span>{formatarParaCampo(faixa[0], faixa[2])}</span>
            <span>{formatarParaCampo(faixa[1], faixa[2])}</span>
          </span>
        </>
      )}

      {/* Erro de validação */}
      {invalido && (
        <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <span aria-hidden>⚠</span>
          Valor inválido — digite um número (ex.: 1,5 ou 2e-6)
        </span>
      )}
    </label>
  )
}