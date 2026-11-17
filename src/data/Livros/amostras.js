// Trechos iniciais REAIS das obras (domínio público), verificados nos acervos:
// Darwin Online (1ª ed. 1859), Wikisource/Gutenberg (tradução de Motte), Gutenberg #15491,
// Gutenberg #22914 (Boyle), Wikisource FR (Lavoisier, 1789) e Newton Project (1687, latim).
// Nos trechos, "…" indica texto omitido — nada foi reescrito ou inventado.

export const AMOSTRAS = {
  'origem-especies': {
    rotulo: 'Introduction',
    fonte: 'Darwin Online — 1ª edição, 1859',
    porPagina: 1,
    paragrafos: [
      "WHEN on board H.M.S. 'Beagle,' as naturalist, I was much struck with certain facts in the distribution of the organic beings inhabiting South America, and in the geological relations of the present to the past inhabitants of that continent. These facts, as will be seen in the latter chapters of this volume, seemed to throw some light on the origin of species — that mystery of mysteries, as it has been called by one of our greatest philosophers.",
      "On my return home, it occurred to me, in 1837, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts which could possibly have any bearing on it. After five years' work I allowed myself to speculate on the subject, and drew up some short notes; these I enlarged in 1844 into a sketch of the conclusions, which then seemed to me probable: from that period to the present day I have steadily pursued the same object. I hope that I may be excused for entering on these personal details, as I give them to show that I have not been hasty in coming to a decision.",
      "This Abstract, which I now publish, must necessarily be imperfect. I cannot here give references and authorities for my several statements; and I must trust to the reader reposing some confidence in my accuracy. No doubt errors will have crept in, though I hope I have always been cautious in trusting to good authorities alone.",
      "I can here give only the general conclusions at which I have arrived, with a few facts in illustration, but which, I hope, in most cases will suffice. No one can feel more sensible than I do of the necessity of hereafter publishing in detail all the facts, with references, on which my conclusions have been grounded.",
      "No one ought to feel surprise at much remaining as yet unexplained in regard to the origin of species and varieties, if he makes due allowance for our profound ignorance in regard to the mutual relations of all the beings which live around us. Who can explain why one species ranges widely and is very numerous, and why another allied species has a narrow range and is rare?",
    ],
  },

  principia: {
    rotulo: 'Book I — Definitions & Laws of Motion',
    fonte: 'Tradução de Andrew Motte (1846)',
    porPagina: 2,
    paragrafos: [
      'DEFINITION I. The quantity of matter is the measure of the same, arising from its density and bulk conjunctly. Thus air of a double density, in a double space, is quadruple in quantity; in a triple space, sextuple in quantity.',
      'DEFINITION II. The quantity of motion is the measure of the same, arising from the velocity and quantity of matter conjunctly. The motion of the whole is the sum of the motions of all the parts; and therefore in a body double in quantity, with equal velocity, the motion is double.',
      'DEFINITION III. The vis insita, or innate force of matter, is a power of resisting, by which every body, as much as in it lies, endeavours to persevere in its present state, whether it be of rest, or of moving uniformly forwards in a right line.',
      'DEFINITION IV. An impressed force is an action exerted upon a body, in order to change its state, either of rest, or of moving uniformly forward in a right line.',
      'LAW I. Every body perseveres in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impressed thereon.',
      'LAW II. The alteration of motion is ever proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.',
      'LAW III. To every action there is always opposed an equal reaction: or, the mutual actions of two bodies upon each other are always equal, and directed to contrary parts.',
    ],
  },

  'principia-latin': {
    rotulo: 'Liber I — Definitiones',
    fonte: 'Newton Project — 1ª edição (1687), em latim',
    porPagina: 1,
    paragrafos: [
      "DEFINITIO I. Quantitas Materiæ est mensura ejusdem orta ex illius Densitate & Magnitudine conjunctim. AEr duplo densior in duplo spatio quadruplus est. Idem intellige de Nive et Pulveribus per compressionem vel liquefactionem condensatis. Et par est ratio corporum omnium, quæ per causas quascunq; diversimode condensantur.",
      "DEFINITIO II. Quantitas motus est mensura ejusdem orta ex Velocitate et quantitate Materiæ conjunctim.",
      "DEFINITIO III. Materiæ vis insita est potentia resistendi, qua corpus unumquodq;, quantum in se est, perseverat in statu suo vel quiescendi vel movendi uniformiter in directum. Hæc semper proportionalis est suo corpori, neq; differt quicquam ab inertia Massæ, nisi in modo concipiendi.",
    ],
  },

  'sceptical-chymist': {
    rotulo: 'Part of the First Dialogue',
    fonte: 'Project Gutenberg #22914 — trechos literais (… = omissão)',
    porPagina: 1,
    paragrafos: [
      "It was on one of the fairest dayes of this Summer that the inquisitive Eleutherius came to invite me to make a visit with him to his friend Carneades. … Eleutherius being perfectly acquainted with that Garden immediately led me to the Arbour, and relying on the intimate familiarity that had been long cherish'd betwixt him and Carneades; in spight of my Reluctancy to what might look like an intrusion upon his privacy, drawing me by the hand, he abruptly entered the Arbour, where we found Carneades, Philoponus, and Themistius…",
      "I Am (sayes Carneades) so unwilling to deny Eleutherius any thing, that though, before the rest of the Company I am resolv'd to make good the part I have undertaken of a Sceptick; yet I shall readily, since you will have it so, lay aside for a while the Person of an Adversary to the Peripateticks and Chymists…",
      "And now Eleutherius (continues Carneades) I must resume the person of a Sceptick, and as such, propose some part of what may be either dislik't, or at least doubted of in the common Hypothesis of the Chymists…",
    ],
  },

  'lavoisier-traite': {
    rotulo: 'Discours préliminaire',
    fonte: 'Wikisource — texto francês de 1789 (… = omissão)',
    porPagina: 1,
    paragrafos: [
      "Je n'avois pour objet lorsque j'ai entrepris cet ouvrage, que de donner plus de développement au Mémoire que j'ai lu à la séance publique de l'Académie des Sciences du mois d'avril 1787, sur la nécessité de réformer & de perfectionner la Nomenclature de la Chimie.",
      "C'est en m'occupant de ce travail, que j'ai mieux senti que je ne l'avois encore fait jusqu'alors, l'évidence des principes qui ont été posés par l'Abbé de Condillac dans sa logique, & dans quelques autres de ses ouvrages.",
      "Il y établit que nous ne pensons qu'avec le secours des mots ; que les langues sont de véritables méthodes analytiques ; que l'algèbre la plus simple, la plus exacte & la mieux adaptée à son objet de toutes les manières de s'énoncer, est à-la-fois une langue & une méthode analytique ; enfin que l'art de raisonner se réduit à une langue bien faite.",
      "Le mot doit faire naître l'idée ; l'idée doit peindre le fait : ce sont trois empreintes d'un même cachet ; & comme ce sont les mots qui conservent les idées & qui les transmettent, il en résulte qu'on ne peut perfectionner le langage sans perfectionner la science, ni la science sans le langage…",
    ],
  },

  micrographia: {
    rotulo: 'Observ. I — Of the Point of a sharp small Needle',
    fonte: 'Gutenberg — eBook #15491',
    porPagina: 1,
    paragrafos: [
      'As in Geometry, the most natural way of beginning is from a Mathematical point; so is the same method in Observations and Natural history the most genuine, simple, and instructive. We must first endevour to make letters, and draw single strokes true, before we venture to write whole Sentences, or to copy exact and fair Characters.',
      "The Point of a Needle is commonly reckon'd for one of these Physical points; and is indeed, for the most part, made so sharp, that the naked eye cannot distinguish any part of it: it appears to the eye only as an indivisible point.",
      "But the Microscope can afford us hundreds of Instances of Points many thousand times sharper: such as those of the hairs and bristles of the smallest Insects, and other minute bodies; and thereby discovers the ruggedness and unevenness of those surfaces which appear most smooth and polish'd to the naked eye.",
    ],
  },
}

// Agrupa parágrafos em páginas (arrays) conforme porPagina.
export const paginasDe = (livro) => {
  const amostra = AMOSTRAS[livro?.id]
  if (!amostra) return null
  const paginas = []
  for (let i = 0; i < amostra.paragrafos.length; i += amostra.porPagina) {
    paginas.push(amostra.paragrafos.slice(i, i + amostra.porPagina))
  }
  return { rotulo: amostra.rotulo, fonte: amostra.fonte, paginas }
}