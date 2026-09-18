export interface GenreDetail {
  name: string;
  country: string;
  history: string;
  bpm: string;
  lufs: string;
  rhythm: string;
  structure: string;
  harmony: string;
  mix: string;
  master: string;
  plugins: string;
}

export const AFRICAN_GENRES: GenreDetail[] = [
  {
    name: 'Afrobeat / Afrobeats',
    country: 'Nigéria & Gana',
    history: 'Pioneirado por Fela Kuti e Tony Allen nos anos 1970 com fusão de Highlife, Jazz, Funk e polirritmias tradicionais iorubás. No século XXI, transformou-se no movimento global Afrobeats (Wizkid, Burna Boy, Rema, Tems).',
    bpm: '95–115 BPM',
    lufs: '-9 a -14 LUFS',
    rhythm: 'Groove sincopado, kick 4x4 ou 3:2 clave, shaker constante de 1/16, percussões polirrítmicas como congas, talking drum e timbales.',
    structure: 'Intro → Verse 1 → Pre-Chorus → Chorus → Verse 2 → Chorus → Bridge / Instrumental Break → Chorus → Outro',
    harmony: 'Loops harmónicos de 2 a 4 acordes (ex: vi - IV - I - V ou ii - V - I), melodias em escala pentatônica maior/menor ou modos dórico e mixolídio.',
    mix: 'Vocal límpido e presente na frente; kick redondo e 808/baixo elétrico separados com precisão; percussões bem distribuídas no campo estéreo.',
    master: 'Preservação de transientes percussivos; médios quentes sem agressividade; headroom confortável (-1.0 dBTP).',
    plugins: 'Waves Scheps 73, CLA-2A, CLA-76, Silk Vocal, Vitamin Sonic Enhancer, H-Delay, Maserati DRM.'
  },
  {
    name: 'Kuduro',
    country: 'Angola',
    history: 'Nascido em Luanda no fim dos anos 1980 e consolidado nos anos 1990/2000 por nomes como Tony Amado, Sebem e Os Lambas. Combina batidas eletrónicas rápidas, sungura e semba com vocais energéticos, coreografias e rimas de rua.',
    bpm: '130–145 BPM',
    lufs: '-8 a -12 LUFS',
    rhythm: 'Bumbo marcante, tarola e palmas sincopadas, chimbais rápidos e loops de congas hiper-energéticos.',
    structure: 'Intro agressiva → Hook / Refrão curto → Verso rápido → Hook → Drop / Solo percussivo → Refrão final',
    harmony: 'Riffs sintéticos curtos, sintetizadores incisivos, foco primário na energia rítmica e no flow vocal acelerado.',
    mix: 'Kick e snare com punch máximo; controle de sibilância na voz falada/gritada; transientes destacados; graves secos e compactos.',
    master: 'Loudness competitivo com impacto em pistas e paredões; saturação quente controlada para não gerar clipping digital.',
    plugins: 'Waves SSL E-Channel, Smack Attack, API 2500, CLA-76, Berzerk Distortion, L3-16 Multimaximizer.'
  },
  {
    name: 'Kizomba & Ghetto Zouk',
    country: 'Angola & Cabo Verde',
    history: 'Evolução da Semba angolana com influências marcantes do Zouk antilhano nos anos 1980/1990. Dança a dois sensual com linhas de baixo melódicas e letras sobre romance e vivências.',
    bpm: '85–100 BPM',
    lufs: '-9 a -14 LUFS',
    rhythm: 'Padrão rítmico clássico de Zouk/Kizomba: Bumbo no tempo 1 e contra-tempo do 2, caixa suave sincopada, chimbais aveludados.',
    structure: 'Intro melódica → Verso 1 → Pré-Refrão → Refrão emotivo → Verso 2 → Refrão → Ponte dramática → Refrão duplo → Fade out',
    harmony: 'Acordes menores com sétima e nona, progressões como vi - IV - I - V, guitarras dedilhadas ou teclados suaves.',
    mix: 'Voz íntima e aveludada, compressão óptica suave (CLA-2A), subgrave redondo sem invasão de frequência, reverbs longos e quentes.',
    master: 'Dinâmica musical respeitada; graves quentes e presentes; topo arejado sem aspereza.',
    plugins: 'Waves CLA-2A, Renaissance Vox, PuigTec EQP-1A, TrueVerb, H-Delay, Abbey Road Chambers, L2.'
  },
  {
    name: 'Afro-house',
    country: 'África do Sul & Angola',
    history: 'Fusão de batidas de House Music com ritmos orgânicos, tambores africanos e vocais tribais ou emotivos (Black Coffee, Culoe De Song, Boddhi Satva).',
    bpm: '120–126 BPM',
    lufs: '-8 a -12 LUFS',
    rhythm: 'Four-on-the-floor kick contínuo com camadas densas de shakers, djembes, congas e bongo fills.',
    structure: 'Intro para mix de DJ (16/32 compassos) → Groove A → Build-up → Drop melódico → Breakdown vocal → Drop principal → Outro DJ',
    harmony: 'Pianos jazzy, pads profundos, baixos synth profundos (Moog/Sub) ou guitarras dedilhadas sutis.',
    mix: 'Sub-bass rigorosamente mono e sólido abaixo de 100 Hz; kick com peso mas sem embolar; percussões abertas em estéreo wide.',
    master: 'Headroom seguro para sistemas de PA de clubes; transientes de kick intactos; largura estéreo equilibrada.',
    plugins: 'Waves SSL G-Master, API 2500, F6 Dynamic EQ, S1 Stereo Imager, MaxxBass, Vitamin, L3-16.'
  },
  {
    name: 'Afropop',
    country: 'África Ocidental / Global',
    history: 'Vertente pop ultra polida de produções africanas modernas misturando R&B contemporâneo, Pop internacional e cadências caribenhas.',
    bpm: '95–115 BPM',
    lufs: '-9 a -14 LUFS',
    rhythm: 'Grooves híbridos com palmas, finger snaps, kick aconchegante e hi-hats com leve balanço de swing.',
    structure: 'Intro curta (hook) → Verso → Pré-Refrão → Refrão cativante → Verso 2 → Refrão → Solo/Ponte → Refrão final com adlibs',
    harmony: 'Progressões pop alegres ou nostálgicas com sintetizadores elegantes, guitarras limpas e melodias vocais infecciosas.',
    mix: 'Voz polida, brilhante e afinada com precisão (Tune Real-Time + Silk Vocal); graves controlados e mix transparente.',
    master: 'Masterização compatível com fones de ouvido e smartphones; clareza de médios e agudos estéreo elegantes.',
    plugins: 'Waves Tune Real-Time, Silk Vocal, CLA-76, Scheps 73, H-Delay, Kramer Tape, WLM Plus.'
  },
  {
    name: 'Sungura',
    country: 'Zimbabwe',
    history: 'Género mais popular do Zimbabwe surgido no início dos anos 1980 após a independência, influenciado pela Rumba Congolesa e pelo Kanindo queniano.',
    bpm: '110–135 BPM',
    lufs: '-10 a -14 LUFS',
    rhythm: 'Linhas de baixo hiper-ativas e melódicas, bateria constante com condução rápida no prato e viradas expressivas.',
    structure: 'Intro instrumental longa de guitarra → Tema cantado → Resposta coral → Extenso solo de guitarra interligado',
    harmony: 'Guitarras solistas com técnica rápida de fingerpicking estéreo, diálogos entre guitarra ritmo e solo.',
    mix: 'Espaço aberto para 2 a 3 guitarras distintas; baixo elétrico vivo e audível nos médios; vocal claro sem reverb excessivo.',
    master: 'Foco na fidelidade acústica das cordas e transientes naturais sem compressão destrutiva.',
    plugins: 'Waves CLA-2A, H-EQ Hybrid, Kramer Master Tape, Renaissance Reverb, PAZ Analyzer, L2.'
  }
];
