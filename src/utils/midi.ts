// Utilitário de Teoria Musical e Exportador MIDI (SMF 0) Puro
// Gera arquivos MIDI estritamente com 4 acordes, 4 tempos, 1 acorde por tempo,
// 3 notas simultâneas (tríades), sem melodia, sem baixo, sem bateria, sem notas adicionais.

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

export interface ScaleDefinition {
  name: string;
  intervals: number[]; // semitons a partir da tônica
  desc: string;
}

export const SCALES: Record<string, ScaleDefinition> = {
  major: {
    name: 'Maior (Jônio)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    desc: 'Brilhante, estável e triunfante. Base da harmonia ocidental e pop.',
  },
  minor_natural: {
    name: 'Menor Natural (Eólio)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    desc: 'Melancólica, emotiva e profunda. Muito comum em Kizomba, Tarraxinha e Afrobeat.',
  },
  minor_harmonic: {
    name: 'Menor Harmónica',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    desc: 'Sabor exótico e dramático com 7ª maior. Clássico em cadências de Semba e Kuduro.',
  },
  minor_melodic: {
    name: 'Menor Melódica',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    desc: 'Fluidez moderna de jazz e R&B com resolução suave.',
  },
  dorian: {
    name: 'Dórico',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    desc: 'Menor com 6ª maior. Groove elegante, funk, Afro House e Amapiano.',
  },
  mixolydian: {
    name: 'Mixolídio',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    desc: 'Maior com 7ª menor. Som de blues, afrobeat e celebração tradicional.',
  },
  phrygian: {
    name: 'Frígio',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    desc: 'Tensão sombria e forte com 2ª menor. Muito usado em Kuduro pesado e Trap.',
  },
  lydian: {
    name: 'Lídio',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    desc: 'Místico e aberto com 4ª aumentada (#4). Trilha sonora e ambiência.',
  },
  pentatonic_major: {
    name: 'Pentatónica Maior',
    intervals: [0, 2, 4, 7, 9],
    desc: '5 notas puras. Harmonias doces, folk e melodias vocais infecciosas.',
  },
  pentatonic_minor: {
    name: 'Pentatónica Menor',
    intervals: [0, 3, 5, 7, 10],
    desc: '5 notas essenciais. Força crua do blues, rock e afro grooves.',
  },
  blues: {
    name: 'Blues (Hexatónica)',
    intervals: [0, 3, 5, 6, 7, 10],
    desc: 'Contém a blue note (b5). Tensão expressiva e expressividade de estúdio.',
  },
};

export interface ChordItem {
  degree: string;
  name: string;
  roman: string;
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'sus4' | 'sus2';
  rootNote: string;
  notes: string[]; // 3 notas
  midiNotes: [number, number, number]; // 3 notas MIDI exatas
}

export interface ProgressionPattern {
  id: string;
  name: string;
  genre: string;
  isAngolan: boolean;
  bpm: number;
  description: string;
  degrees: string[]; // ex: ['vi', 'IV', 'I', 'V'] ou ['i', 'VI', 'III', 'VII']
}

export const GENRE_PROGRESSIONS: ProgressionPattern[] = [
  // 🇦🇴 Estilos Angolanos
  {
    id: 'kizomba-1',
    name: 'Kizomba Suave (Aveludada)',
    genre: 'Kizomba',
    isAngolan: true,
    bpm: 95,
    description: 'A clássica progressão romântica de Kizomba com cadência circular emotiva.',
    degrees: ['vi', 'IV', 'I', 'V'],
  },
  {
    id: 'kizomba-2',
    name: 'Kizomba Menor Profunda',
    genre: 'Kizomba',
    isAngolan: true,
    bpm: 92,
    description: 'Cadência melancólica muito ouvida em baladas de Zouk e Kizomba contemporânea.',
    degrees: ['i', 'VI', 'III', 'VII'],
  },
  {
    id: 'semba-1',
    name: 'Semba Tradicional de Luanda',
    genre: 'Semba',
    isAngolan: true,
    bpm: 108,
    description: 'Cadência tonal tradicional que sustenta a dikanza e o violão de Semba.',
    degrees: ['I', 'vi', 'ii', 'V'],
  },
  {
    id: 'semba-2',
    name: 'Semba Maior Dançante',
    genre: 'Semba',
    isAngolan: true,
    bpm: 112,
    description: 'Movimento harmónico alegre e rítmico para rodas de dança e metais.',
    degrees: ['I', 'IV', 'V', 'IV'],
  },
  {
    id: 'kuduro-1',
    name: 'Kuduro Rua & Tensão',
    genre: 'Kuduro',
    isAngolan: true,
    bpm: 140,
    description: 'Harmonia ríspida e energética focada na tonalidade menor com cadência direta.',
    degrees: ['i', 'iv', 'VII', 'i'],
  },
  {
    id: 'kuduro-2',
    name: 'Kuduro Alta Pressão',
    genre: 'Kuduro',
    isAngolan: true,
    bpm: 142,
    description: 'Tensão constante em acordes menores e quintas para abrir espaço às vozes rítmicas.',
    degrees: ['i', 'VI', 'iv', 'v'],
  },
  {
    id: 'tarraxinha-1',
    name: 'Tarraxinha Dark Sensual',
    genre: 'Tarraxinha',
    isAngolan: true,
    bpm: 88,
    description: 'Andamento lento, graves densos e progressão circular profunda.',
    degrees: ['i', 'VI', 'iv', 'V'],
  },
  {
    id: 'tarraxinha-2',
    name: 'Tarraxinha Noturna',
    genre: 'Tarraxinha',
    isAngolan: true,
    bpm: 86,
    description: 'Resolução hipnótica com tensão do quinto grau no quarto tempo.',
    degrees: ['i', 'v', 'VI', 'iv'],
  },
  {
    id: 'afro-house-1',
    name: 'Afro House Luanda Vibe',
    genre: 'Afro House Angolano',
    isAngolan: true,
    bpm: 124,
    description: 'Harmonia profunda para sintetizadores analógicos e percussão de congas.',
    degrees: ['i', 'VII', 'v', 'VI'],
  },
  {
    id: 'afro-house-2',
    name: 'Afro House Tribal Deep',
    genre: 'Afro House Angolano',
    isAngolan: true,
    bpm: 123,
    description: 'Progressão modal circular que mantém a pista hipnotizada.',
    degrees: ['i', 'iv', 'v', 'i'],
  },

  // Outros estilos urbanos
  {
    id: 'afrobeat-1',
    name: 'Afrobeat Lagos Moderno',
    genre: 'Afrobeat',
    isAngolan: false,
    bpm: 102,
    description: 'A progressão dos maiores hits de Afrobeat e Afropop nigeriano.',
    degrees: ['ii', 'V', 'I', 'vi'],
  },
  {
    id: 'afrobeat-2',
    name: 'Afropop Brilhante',
    genre: 'Afrobeat',
    isAngolan: false,
    bpm: 105,
    description: 'Acordes abertos perfeitos para guitarras com chorus e linhas de saxofone.',
    degrees: ['IV', 'I', 'vi', 'V'],
  },
  {
    id: 'amapiano-1',
    name: 'Amapiano Private School Piano',
    genre: 'Amapiano',
    isAngolan: false,
    bpm: 113,
    description: 'Harmonia sofisticada inspirada no jazz sul-africano sobre log drum.',
    degrees: ['IV', 'I', 'vi', 'V'],
  },
  {
    id: 'amapiano-2',
    name: 'Amapiano Deep Soul',
    genre: 'Amapiano',
    isAngolan: false,
    bpm: 112,
    description: 'Sequência envolvente com cadência menor elegante.',
    degrees: ['ii', 'vi', 'IV', 'V'],
  },
  {
    id: 'rnb-1',
    name: 'R&B / Neo-Soul Suave',
    genre: 'R&B / Soul',
    isAngolan: false,
    bpm: 85,
    description: 'Caminho harmónico sedutor para teclados Rhodes e sintetizadores vintage.',
    degrees: ['ii', 'V', 'I', 'vi'],
  },
  {
    id: 'pop-1',
    name: 'Pop / Comercial Global',
    genre: 'Pop / Comercial',
    isAngolan: false,
    bpm: 118,
    description: 'A progressão mais famosa da música mundial para refrões marcantes.',
    degrees: ['I', 'V', 'vi', 'IV'],
  },
  {
    id: 'zouk-1',
    name: 'Zouk Love das Ilhas',
    genre: 'Zouk',
    isAngolan: false,
    bpm: 96,
    description: 'Doçura harmónica antilhana que serviu de mãe para a Kizomba moderna.',
    degrees: ['vi', 'IV', 'I', 'V'],
  },
];

// Calcula a tríade (3 notas simultâneas) a partir da tônica e qualidade
export function getTriad(rootNoteName: NoteName, quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'sus4' | 'sus2', octave = 4): {
  notes: string[];
  midiNotes: [number, number, number];
} {
  const rootIndex = NOTE_NAMES.indexOf(rootNoteName);
  const baseMidi = 12 * (octave + 1) + rootIndex; // C4 = 60

  let offsets: [number, number, number] = [0, 4, 7]; // maior por padrão
  if (quality === 'minor') offsets = [0, 3, 7];
  else if (quality === 'diminished') offsets = [0, 3, 6];
  else if (quality === 'augmented') offsets = [0, 4, 8];
  else if (quality === 'sus4') offsets = [0, 5, 7];
  else if (quality === 'sus2') offsets = [0, 2, 7];

  const midi0 = baseMidi + offsets[0];
  const midi1 = baseMidi + offsets[1];
  const midi2 = baseMidi + offsets[2];

  const note0 = NOTE_NAMES[(rootIndex + offsets[0]) % 12];
  const note1 = NOTE_NAMES[(rootIndex + offsets[1]) % 12];
  const note2 = NOTE_NAMES[(rootIndex + offsets[2]) % 12];

  return {
    notes: [note0, note1, note2],
    midiNotes: [midi0, midi1, midi2],
  };
}

// Gera a progressão de 4 acordes com exatamente 3 notas por acorde
export function generateProgression(
  keyRoot: NoteName,
  scaleKey: string,
  progression: ProgressionPattern
): ChordItem[] {
  const scale = SCALES[scaleKey] || SCALES.major;
  const rootIndex = NOTE_NAMES.indexOf(keyRoot);

  return progression.degrees.slice(0, 4).map((deg) => {
    let semitoneOffset = 0;
    let quality: 'major' | 'minor' | 'diminished' = 'major';
    const cleanDeg = deg.replace(/[^ivIV]/g, '');

    // Mapeamento funcional de graus
    const isMinorDeg = cleanDeg === cleanDeg.toLowerCase();
    quality = isMinorDeg ? 'minor' : 'major';

    if (cleanDeg === 'i' || cleanDeg === 'I') semitoneOffset = scale.intervals[0] || 0;
    else if (cleanDeg === 'ii' || cleanDeg === 'II') semitoneOffset = scale.intervals[1] || 2;
    else if (cleanDeg === 'iii' || cleanDeg === 'III') semitoneOffset = scale.intervals[2] || 4;
    else if (cleanDeg === 'iv' || cleanDeg === 'IV') semitoneOffset = scale.intervals[3] || 5;
    else if (cleanDeg === 'v' || cleanDeg === 'V') semitoneOffset = scale.intervals[4] || 7;
    else if (cleanDeg === 'vi' || cleanDeg === 'VI') semitoneOffset = scale.intervals[5] || 9;
    else if (cleanDeg === 'vii' || cleanDeg === 'VII') semitoneOffset = scale.intervals[6] || 11;

    // Se for o 7º grau maior em escala maior, é diminuto
    if (scaleKey === 'major' && (cleanDeg === 'vii' || cleanDeg === 'VII')) {
      quality = 'diminished';
    }

    const chordRootNote = NOTE_NAMES[(rootIndex + semitoneOffset) % 12];
    const triad = getTriad(chordRootNote, quality, 4);

    const chordLabel = `${chordRootNote}${quality === 'minor' ? 'm' : quality === 'diminished' ? 'dim' : ''}`;

    return {
      degree: deg,
      name: chordLabel,
      roman: deg,
      quality,
      rootNote: chordRootNote,
      notes: triad.notes,
      midiNotes: triad.midiNotes,
    };
  });
}

// Codificador VLQ (Variable-Length Quantity) para eventos MIDI
function encodeVLQ(num: number): number[] {
  const bytes: number[] = [];
  let n = num >>> 0;
  bytes.push(n & 0x7f);
  n = n >>> 7;
  while (n > 0) {
    bytes.unshift((n & 0x7f) | 0x80);
    n = n >>> 7;
  }
  return bytes;
}

// Converte string para bytes ASCII
function stringToBytes(str: string): number[] {
  return Array.from(str).map(ch => ch.charCodeAt(0));
}

// Cria e baixa arquivo MIDI padrão (SMF Type 0):
// Exatamente 4 acordes, 4 tempos, 1 acorde por tempo, 3 notas simultâneas por acorde.
// Sem melodia, sem baixo, sem bateria, sem notas adicionais.
export function exportMidiFile(
  chords: ChordItem[],
  bpm = 120,
  filename = 'Progressao_4_Acordes.mid'
): void {
  if (chords.length !== 4) {
    console.warn('A exportação MIDI requer exatamente 4 acordes.');
  }

  const ticksPerBeat = 480; // 480 ticks = 1 tempo musical
  const chordDurationTicks = ticksPerBeat; // 1 acorde por tempo
  const velocity = 88; // Dinâmica natural de piano/teclado

  // Constrói os bytes da Track (MTrk)
  const trackBytes: number[] = [];

  // 1. Meta Event: Set Tempo
  // Tempo em microssegundos por semínima = 60,000,000 / BPM
  const usPerQuarter = Math.round(60000000 / bpm);
  trackBytes.push(
    0x00, // delta-time
    0xff, 0x51, 0x03, // Meta: Set Tempo (3 bytes)
    (usPerQuarter >> 16) & 0xff,
    (usPerQuarter >> 8) & 0xff,
    usPerQuarter & 0xff
  );

  // 2. Meta Event: Time Signature (4/4)
  trackBytes.push(
    0x00, // delta-time
    0xff, 0x58, 0x04, // Meta: Time Signature (4 bytes)
    0x04, // Numerador: 4
    0x02, // Denominador: 2^2 = 4
    0x18, // Clocks por click de metrônomo: 24
    0x08  // 32nd notes por 24 clocks: 8
  );

  // 3. Meta Event: Track Name
  const trackName = 'Chords Triads';
  const nameBytes = stringToBytes(trackName);
  trackBytes.push(
    0x00,
    0xff, 0x03, nameBytes.length,
    ...nameBytes
  );

  // 4. Grava os 4 acordes sequenciais (1 acorde por tempo, 3 notas simultâneas)
  for (let i = 0; i < 4; i++) {
    const chord = chords[i];
    const [n1, n2, n3] = chord.midiNotes;

    // Note On das 3 notas juntas (delta time 0)
    // 1ª nota
    trackBytes.push(...encodeVLQ(0), 0x90, n1, velocity);
    // 2ª nota (mesmo instante, delta 0)
    trackBytes.push(...encodeVLQ(0), 0x90, n2, velocity);
    // 3ª nota (mesmo instante, delta 0)
    trackBytes.push(...encodeVLQ(0), 0x90, n3, velocity);

    // Note Off das 3 notas após exatamente 1 tempo (chordDurationTicks)
    // 1ª nota encerra após chordDurationTicks
    trackBytes.push(...encodeVLQ(chordDurationTicks), 0x80, n1, 0x40);
    // 2ª nota encerra no mesmo instante (delta 0)
    trackBytes.push(...encodeVLQ(0), 0x80, n2, 0x40);
    // 3ª nota encerra no mesmo instante (delta 0)
    trackBytes.push(...encodeVLQ(0), 0x80, n3, 0x40);
  }

  // 5. Meta Event: End of Track (delta-time 0)
  trackBytes.push(0x00, 0xff, 0x2f, 0x00);

  // Cabeçalho MThd (14 bytes)
  const headerBytes: number[] = [
    0x4d, 0x54, 0x68, 0x64, // 'MThd'
    0x00, 0x00, 0x00, 0x06, // comprimento: 6 bytes
    0x00, 0x00,             // Formato 0 (Single Track)
    0x00, 0x01,             // 1 Track
    (ticksPerBeat >> 8) & 0xff, ticksPerBeat & 0xff // Division (480 ticks/beat)
  ];

  // Cabeçalho MTrk com tamanho
  const trackLen = trackBytes.length;
  const trackHeader: number[] = [
    0x4d, 0x54, 0x72, 0x6b, // 'MTrk'
    (trackLen >> 24) & 0xff,
    (trackLen >> 16) & 0xff,
    (trackLen >> 8) & 0xff,
    trackLen & 0xff
  ];

  // Junta todos os bytes
  const fullMidi = new Uint8Array([...headerBytes, ...trackHeader, ...trackBytes]);

  // Cria Blob e dispara download no navegador
  const blob = new Blob([fullMidi], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.mid') ? filename : `${filename}.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
