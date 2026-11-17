import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Duração da animação de virar a folha (ms).
const FOLHA_MS = 720

const KEYFRAMES = `
@keyframes virarProx { from { transform: rotateY(0deg) } to { transform: rotateY(-180deg) } }
@keyframes virarAnt { from { transform: rotateY(0deg) } to { transform: rotateY(180deg) } }
@keyframes sombraFolha { 0% { opacity: 0 } 45% { opacity: .38 } 100% { opacity: 0 } }
`

// Tipografia compartilhada entre a renderização e a medição — as classes são
// idênticas para que o Tailwind gere as mesmas regras para os nós de medição.
const CLASSE_TITULO = 'whitespace-pre-line text-center font-serif font-bold uppercase tracking-[0.14em] text-slate-700 text-[15px] md:text-[17px]'
const CLASSE_PARAGRAFO = 'text-justify font-serif text-slate-800 text-[13px] leading-relaxed md:text-[15px] md:leading-[1.75]'
const CLASSE_CAPA = ' first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:leading-[.85] first-letter:text-slate-900'
const MARGEM_TITULO = 20      // mb-4 + folga
const MARGEM_PARAGRAFO = 12   // mb-3

// Corta um parágrafo em frases (preservando pontuação e espaços).
const dividirFrases = (t) => t.match(/[^.!?…]+[.!?…]+["'“”‘’)\]]*\s*/g) || [t]

// ---- Paginação por medição real ----
// Mede cada bloco dentro do medidor oculto e distribui pelas folhas.
function paginar({ blocos, medidor, alturaMax }) {
  const doc = medidor.ownerDocument
  const paginas = []
  let atual = []
  let altura = 0

  const medir = (bloco) => {
    const el = doc.createElement(bloco.tipo === 'titulo' ? 'h2' : 'p')
    el.className = bloco.tipo === 'titulo' ? CLASSE_TITULO : CLASSE_PARAGRAFO + (bloco.capa ? CLASSE_CAPA : '')
    el.textContent = bloco.texto
    medidor.appendChild(el)
    const h = el.offsetHeight + (bloco.tipo === 'titulo' ? MARGEM_TITULO : MARGEM_PARAGRAFO)
    medidor.removeChild(el)
    return h
  }

  const novaPagina = () => { if (atual.length) paginas.push(atual); atual = []; altura = 0 }
  const empurrar = (bloco, h) => { atual.push(bloco); altura += h }

  // Parágrafo que não cabe inteiro: fatia por frases preenchendo as páginas.
  const encaixarParagrafo = (bloco) => {
    let restante = bloco.texto
    let primeira = true
    while (restante) {
      if (atual.length && altura + MARGEM_PARAGRAFO >= alturaMax) { novaPagina(); continue }

      const frases = dividirFrases(restante)
      let pedaco = ''
      let hPedaco = 0
      for (let i = 0; i < frases.length; i += 1) {
        const tentativa = pedaco + frases[i]
        const h = medir({ tipo: 'paragrafo', texto: tentativa, capa: primeira && bloco.capa })
        if (pedaco && altura + h > alturaMax) break
        pedaco = tentativa
        hPedaco = h
      }

      // Frase única maior que a página inteira: corte por palavras (busca binária).
      if (pedaco && hPedaco > alturaMax) {
        if (atual.length) { novaPagina(); continue }
        const palavras = restante.split(/\s+/)
        let lo = 1
        let hi = palavras.length
        let melhor = 1
        while (lo <= hi) {
          const meio = (lo + hi) >> 1
          const h = medir({ tipo: 'paragrafo', texto: palavras.slice(0, meio).join(' '), capa: primeira && bloco.capa })
          if (h <= alturaMax) { melhor = meio; lo = meio + 1 } else hi = meio - 1
        }
        pedaco = palavras.slice(0, melhor).join(' ')
        hPedaco = medir({ tipo: 'paragrafo', texto: pedaco, capa: primeira && bloco.capa })
        empurrar({ tipo: 'paragrafo', texto: pedaco, capa: primeira && bloco.capa }, hPedaco)
        primeira = false
        restante = palavras.slice(melhor).join(' ')
        if (restante) novaPagina()
        continue
      }

      if (!pedaco) break
      empurrar({ tipo: 'paragrafo', texto: pedaco.trim(), capa: primeira && bloco.capa }, hPedaco)
      primeira = false
      restante = restante.slice(pedaco.length).trim()
      if (restante) novaPagina()
    }
  }

  for (let indice = 0; indice < blocos.length; indice += 1) {
    const bloco = { ...blocos[indice], _idx: indice }
    if (indice === 0 && bloco.tipo === 'paragrafo') bloco.capa = true

    const h = medir(bloco)
    if (bloco.tipo === 'titulo') {
      // Título não fica órfão no pé da folha (precisa de espaço abaixo).
      if (atual.length && (altura + h > alturaMax || alturaMax - altura - h < 90)) novaPagina()
      empurrar(bloco, h)
      continue
    }
    if (altura + h <= alturaMax) { empurrar(bloco, h); continue }
    encaixarParagrafo(bloco)
  }
  novaPagina()
  return paginas
}

// Uma página de papel: creme, texto serif, vinco perto da lombada.
function Pagina({ blocos, numero, textoFim, refConteudo }) {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#fbf6ec]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(60,40,10,.14),transparent_12%),linear-gradient(to_left,rgba(60,40,10,.14),transparent_12%)]" aria-hidden />
      <div ref={refConteudo} className="relative flex-1 overflow-hidden px-6 py-6 md:px-9 md:py-8">
        {blocos?.length ? (
          blocos.map((b, i) =>
            b.tipo === 'titulo' ? (
              <h2 key={i} className={`mb-4 mt-1 ${CLASSE_TITULO}`}>{b.texto}</h2>
            ) : (
              <p key={i} className={`mb-3 ${CLASSE_PARAGRAFO}${b.capa ? CLASSE_CAPA : ''}`}>
                {b.texto}
              </p>
            )
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-2xl" aria-hidden>✦</span>
            <p className="font-serif text-sm italic text-slate-500">{textoFim}</p>
            <p className="max-w-[240px] text-xs leading-relaxed text-slate-400">
              use "Digitalização" no topo para continuar a partir daqui
            </p>
          </div>
        )}
      </div>
      <span className="relative pb-3 text-center text-[11px] font-semibold text-slate-400">
        {numero > 0 ? numero : ' '}
      </span>
    </div>
  )
}

// A folha em movimento: frente + verso girando pela lombada.
function Folha({ folha, largo, textoFim }) {
  const prox = folha.direcao === 'prox'
  const pos = largo ? (prox ? 'left-1/2 w-1/2' : 'left-0 w-1/2') : 'left-0 w-full'
  return (
    <div className={`absolute inset-y-0 z-30 ${pos}`} style={{ perspective: '2600px' }}>
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{
          transformOrigin: prox ? 'left center' : 'right center',
          animation: `${prox ? 'virarProx' : 'virarAnt'} ${FOLHA_MS}ms cubic-bezier(.3,.6,.3,1) forwards`,
        }}
      >
        <div className="absolute inset-0 shadow-[0_10px_40px_rgba(0,0,0,.35)] [backface-visibility:hidden]">
          <Pagina blocos={folha.frente} numero={folha.numFrente} textoFim={textoFim} />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Pagina blocos={folha.verso} numero={folha.numVerso} textoFim={textoFim} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black" style={{ animation: `sombraFolha ${FOLHA_MS}ms ease-in-out forwards` }} aria-hidden />
      </div>
    </div>
  )
}

// O livro físico: recebe páginas prontas (amostra) OU blocos soltos
// (obra completa) — nesse caso mede e encaderna as folhas automaticamente.
export default function LivroFisico({ paginas, blocos, paginaInicial = 0, aoVirar, rotulo, fonte }) {
  const estatico = !blocos

  // Modo amostra: páginas prontas, envolvidas no formato de blocos.
  const paginasEstaticas = useMemo(
    () =>
      (paginas || []).map((p, pi) =>
        p.map((texto, bi) => ({ tipo: 'paragrafo', texto, capa: pi === 0 && bi === 0 }))
      ),
    [paginas]
  )

  const [paginasProntas, setPaginasProntas] = useState(estatico ? paginasEstaticas : null)
  const [encadernando, setEncadernando] = useState(!estatico)
  const [largo, setLargo] = useState(() => window.innerWidth >= 768)
  const [folha, setFolha] = useState(null)
  const [pg, setPg] = useState(() => {
    let p = Math.max(0, Number(paginaInicial) || 0)
    if (window.innerWidth >= 768 && p % 2 !== 0) p -= 1
    return p
  })
  const pgRef = useRef(pg)
  const paginasRef = useRef(estatico ? paginasEstaticas : null)
  const paginaEsqRef = useRef(null)
  const medidorRef = useRef(null)

  // Encaderna: mede a área real da página e distribui os blocos nas folhas.
  const encadernar = useCallback(() => {
    if (estatico) return
    const conteudo = paginaEsqRef.current
    const medidor = medidorRef.current
    if (!conteudo || !medidor) return

    const st = getComputedStyle(conteudo)
    const larguraUtil = conteudo.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight)
    const alturaUtil = conteudo.clientHeight - parseFloat(st.paddingTop) - parseFloat(st.paddingBottom)
    if (larguraUtil <= 0 || alturaUtil <= 0) return
    medidor.style.width = `${larguraUtil}px`

    // Guarda a posição atual (índice do primeiro bloco visível) para re-encadernar sem se perder.
    const idxAlvo = paginasRef.current?.[pgRef.current]?.[0]?._idx ?? null
    const resultado = paginar({ blocos, medidor, alturaMax: alturaUtil })

    let novaPg
    if (idxAlvo != null) {
      novaPg = resultado.findIndex((p) => p[0]?._idx != null && p[0]._idx >= idxAlvo)
      if (novaPg === -1) novaPg = resultado.length - 1
    } else {
      novaPg = Math.min(Number(paginaInicial) || 0, Math.max(0, resultado.length - 1))
    }
    if (window.innerWidth >= 768 && novaPg % 2 !== 0) novaPg -= 1
    novaPg = Math.max(0, novaPg)

    paginasRef.current = resultado
    pgRef.current = novaPg
    setPaginasProntas(resultado)
    setPg(novaPg)
    setEncadernando(false)
  }, [blocos, estatico, paginaInicial])

  // Primeira encadernação + re-encadernação ao alternar desktop/celular.
  useLayoutEffect(() => {
    encadernar()
  }, [encadernar, largo])

  // Re-encaderna com debounce em qualquer redimensionamento da janela.
  useEffect(() => {
    if (estatico) return
    let t
    const aoRedim = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        setLargo(window.innerWidth >= 768)
        encadernar()
      }, 250)
    }
    window.addEventListener('resize', aoRedim)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', aoRedim)
    }
  }, [encadernar, estatico])

  const total = paginasProntas?.length ?? 0
  const passo = largo ? 2 : 1
  const podeProx = total > 0 && pg + passo <= total - 1
  const podeAnt = pg - passo >= 0

  function virar(direcao) {
    if (folha || encadernando || !total) return
    if (direcao === 'prox' && !podeProx) return
    if (direcao === 'ant' && !podeAnt) return
    const alvo = pg + (direcao === 'prox' ? passo : -passo)
    const lista = paginasProntas
    let frente, numFrente, verso, numVerso
    if (largo && direcao === 'prox') {
      frente = lista[pg + 1]; numFrente = pg + 2
      verso = lista[alvo]; numVerso = alvo + 1
    } else if (largo && direcao === 'ant') {
      frente = lista[pg]; numFrente = pg + 1
      verso = lista[alvo + 1]; numVerso = alvo + 2
    } else {
      frente = lista[pg]; numFrente = pg + 1
      verso = lista[alvo]; numVerso = alvo + 1
    }
    setFolha({ direcao, frente, numFrente, verso, numVerso })
    pgRef.current = alvo
    setPg(alvo)
    aoVirar?.(alvo)
    setTimeout(() => setFolha(null), FOLHA_MS)
  }

  // Setas do teclado navegam o livro.
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'ArrowRight') virar('prox')
      if (e.key === 'ArrowLeft') virar('ant')
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  })

  const pagEsq = paginasProntas?.[pg]
  const pagDir = paginasProntas?.[pg + 1]
  const textoFim = estatico ? 'fim da amostra desta edição' : 'fim da obra'

  return (
    <div className="flex h-full flex-col">
      <style>{KEYFRAMES}</style>

      {/* Medidor oculto: mede o texto com a tipografia real do livro */}
      <div ref={medidorRef} aria-hidden className="invisible pointer-events-none fixed left-[-99999px] top-0 z-[-1]" />

      <div className="relative min-h-0 flex-1" style={{ perspective: '2000px' }}>
        <div className="relative mx-auto h-full w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-black/30">
          {largo ? (
            <div className="flex h-full">
              <div className="relative w-1/2">
                <Pagina blocos={pagEsq} numero={pg + 1 <= total ? pg + 1 : 0} refConteudo={paginaEsqRef} textoFim={textoFim} />
              </div>
              <div className="relative w-1/2">
                <Pagina blocos={pagDir} numero={pg + 2 <= total ? pg + 2 : 0} textoFim={textoFim} />
              </div>
<div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-10 -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(60,40,10,.22)_45%,rgba(60,40,10,.22)_55%,transparent)]" aria-hidden />
            </div>
          ) : (
            <Pagina blocos={pagEsq} numero={pg + 1 <= total ? pg + 1 : 0} textoFim={textoFim} />
          )}

          {/* Cortina de encadernação: aparece enquanto o texto é paginado */}
          {encadernando && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-[#fbf6ec]">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-700/20 border-t-amber-700" />
              <p className="font-serif text-sm italic text-amber-900/70">encadernando as folhas…</p>
            </div>
          )}

          {folha && <Folha folha={folha} largo={largo} textoFim={textoFim} />}

          {podeAnt && (
            <button type="button" onClick={() => virar('ant')} aria-label="Página anterior"
              className="group absolute bottom-0 left-0 z-20 flex h-20 w-20 items-end justify-start p-3">
              <span className="text-xl text-slate-500/40 transition group-hover:text-slate-800 group-active:scale-90" aria-hidden>‹</span>
            </button>
          )}
          {podeProx && (
            <button type="button" onClick={() => virar('prox')} aria-label="Próxima página"
              className="group absolute bottom-0 right-0 z-20 flex h-20 w-20 items-end justify-end p-3">
              <span className="text-xl text-slate-500/40 transition group-hover:text-slate-800 group-active:scale-90" aria-hidden>›</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de controles inferior */}
      <div className="flex shrink-0 items-center justify-center gap-4 pb-1 pt-4">
        <button type="button" onClick={() => virar('ant')} disabled={!podeAnt || !!folha || encadernando}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-30">
          ‹ Anterior
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-200">
            {largo ? `Folha ${pg / 2 + 1} de ${Math.max(1, Math.ceil(total / 2))}` : `Página ${pg + 1} de ${total}`}
          </p>
          <p className="text-[10px] text-slate-500">{rotulo}{fonte ? ` · ${fonte}` : ''}</p>
        </div>
        <button type="button" onClick={() => virar('prox')} disabled={!podeProx || !!folha || encadernando}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-30">
          Próxima ›
        </button>
      </div>
    </div>
  )
}