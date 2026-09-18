export interface DecisionItem {
  problem: string;
  diagnosis: string;
  category: string;
  action: string;
  recommendedPlugin: string;
  recommendedSettings: string;
}

export const DECISION_DATABASE: DecisionItem[] = [
  {
    problem: 'Vocal dinâmico e inconstante',
    diagnosis: 'Variação natural da distância do microfone ou intensidade da performance',
    category: 'Compressão / Nível',
    action: 'Usar compressão óptica lenta ou automação transparente de ganho',
    recommendedPlugin: 'Waves CLA-2A / Vocal Rider',
    recommendedSettings: 'Peak Reduction 4–6 dB, Gain compensado para -18 dBFS'
  },
  {
    problem: 'Vocal sem presença e apagado',
    diagnosis: 'Falta de energia harmônica em 3–5 kHz ou excesso de graves do efeito proximidade',
    category: 'EQ / Presença',
    action: 'Limpeza suave nos low-mids e realce harmónico inteligente na presença',
    recommendedPlugin: 'Waves Silk Vocal / Scheps 73',
    recommendedSettings: 'Presence 35–45%, High Shelf 10 kHz +2 dB'
  },
  {
    problem: 'Sibilância aguda em "S", "SH", "T"',
    diagnosis: 'Ressonância agressiva entre 5 kHz e 9 kHz captada pela cápsula do microfone',
    category: 'De-Esser',
    action: 'Ajuste a frequência exata da sibilância e aplique redução de 4 a 6 dB nos picos',
    recommendedPlugin: 'Waves DeEsser / Renaissance DeEsser',
    recommendedSettings: 'Freq: 6.8–7.5 kHz, Threshold regulado no refrão'
  },
  {
    problem: 'Vocal fino e sem corpo',
    diagnosis: 'Corte excessivo de graves ou captação com diafragma distante',
    category: 'EQ / Harmónicos',
    action: 'Reforço musical em 150–220 Hz com Pultec ou equalizador vintage',
    recommendedPlugin: 'Waves PuigTec EQP-1A / Scheps 73',
    recommendedSettings: 'Boost 200 Hz +2 dB, Atenuação cirúrgica em 400 Hz se sobrar'
  },
  {
    problem: 'Vocal confuso e com graves sobrando',
    diagnosis: 'Acúmulo de frequências de sala ou efeito de proximidade entre 200 e 400 Hz',
    category: 'EQ Dinâmico',
    action: 'Filtro passa-altas em 80 Hz e corte dinâmico apenas nas notas graves fortes',
    recommendedPlugin: 'Waves F6 Dynamic EQ',
    recommendedSettings: 'HPF 80 Hz (18dB/oct), Banda 2 em 300 Hz com compressão dinâmica'
  },
  {
    problem: 'Vocal com ruído de fundo ou ventilador',
    diagnosis: 'Ruído estacionário ou ambiente captado na gravação',
    category: 'Restauração',
    action: 'Aplicação de rede neural de separação vocal com processamento conservador',
    recommendedPlugin: 'Waves Clarity Vx',
    recommendedSettings: 'Reduction 50% a 70% em modo Broad 1'
  },
  {
    problem: 'Vocal com reflexões de quarto / eco',
    diagnosis: 'Ambiente de gravação não tratado gerando reflexões precoces',
    category: 'Restauração',
    action: 'Isolamento da voz direta e atenuação gradual das caudas de reverberação',
    recommendedPlugin: 'Waves Clarity Vx DeReverb',
    recommendedSettings: 'DeReverb 45–65% com monitoramento de transientes'
  },
  {
    problem: 'Bumbo (Kick) sem punch e impacto',
    diagnosis: 'Falta de ataque transitório e excesso de cauda frouxa ou mascaramento em 300 Hz',
    category: 'Bateria / Transientes',
    action: 'Aumentar o ataque com shaper de transiente e limpar a lama na região dos médios',
    recommendedPlugin: 'Waves Smack Attack / SSL E-Channel',
    recommendedSettings: 'Attack +3 dB, EQ: 60 Hz +2.5 dB, 300 Hz -3.5 dB, 4 kHz +2.5 dB'
  },
  {
    problem: 'Caixa (Snare) magra e sem estalo',
    diagnosis: 'Falta de 200 Hz de corpo e transiente frouxo na esteira',
    category: 'Bateria',
    action: 'Adicionar corpo analógico com API e saturação quente no topo',
    recommendedPlugin: 'Waves API 550 / Berzerk Distortion',
    recommendedSettings: '200 Hz +3 dB, 5 kHz +2 dB, Drive 20% em blend paralelo'
  },
  {
    problem: 'Conflito entre Kick e 808 / Baixo',
    diagnosis: 'Sobreposição de frequências fundamentais entre 40 Hz e 90 Hz',
    category: 'Low-End',
    action: 'Decidir quem ocupa o sub (abaixo de 60 Hz) e quem ocupa o soco (60–120 Hz); aplicar sidechain ou EQ dinâmico',
    recommendedPlugin: 'Waves F6 Dynamic EQ / API 2500',
    recommendedSettings: 'F6 no 808 com sidechain disparado pelo Kick cortando 2.5 dB em 65 Hz'
  },
  {
    problem: 'Mix sem coesão (Mix Bus disperso)',
    diagnosis: 'Pistas individuais soando desconectadas sem sensação de console unificado',
    category: 'Mix Bus Glue',
    action: 'Compressor VCA no master bus com ataque lento e release automático, comprimindo 1 a 2 dB',
    recommendedPlugin: 'Waves SSL G-Master Buss Compressor',
    recommendedSettings: 'Ratio 4:1 (ou 2:1), Attack 30 ms, Release Auto, Gain Reduction 1.5–2 dB'
  },
  {
    problem: 'Master perdendo vida e transientes',
    diagnosis: 'Excesso de limiting no pico e falta de estágios graduais de ganho',
    category: 'Mastering',
    action: 'Reduzir o ceiling do limiter, usar saturação suave pré-limiter e equalização cirúrgica',
    recommendedPlugin: 'Waves L3-16 / Abbey Road TG Mastering',
    recommendedSettings: 'Target -14 LUFS (streaming) ou -9 LUFS (club) com True Peak -1.0 dBTP'
  },
  {
    problem: 'Imagem estéreo fechada e monofônica',
    diagnosis: 'Elementos melódicos agrupados no centro sem aproveitamento das laterais',
    category: 'Estéreo',
    action: 'Panear guitarras/teclados, usar delay ping-pong e alargador seguro com monitoramento de fase',
    recommendedPlugin: 'Waves S1 Stereo Imager / H-Delay',
    recommendedSettings: 'Width 1.15 a 1.25 em buses de sintetizadores; conferir sempre correlação mono'
  }
];
