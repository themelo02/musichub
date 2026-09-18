let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

// 1. Play simple sine tone
export function playFrequencyTone(freq: number, durationSeconds = 1.8, volume = 0.18): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(volume, ctx.currentTime + durationSeconds - 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSeconds + 0.05);
}

// 2. Play noise with peaking filter boost (Ear Training EQ mode)
export function playBoostedNoise(targetFreq: number, durationSeconds = 2.5): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Pink noise approximation
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'peaking';
  filter.frequency.setValueAtTime(targetFreq, ctx.currentTime);
  filter.Q.setValueAtTime(1.8, ctx.currentTime);
  filter.gain.setValueAtTime(14, ctx.currentTime); // +14dB boost

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.25, ctx.currentTime + durationSeconds - 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  src.start(ctx.currentTime);
  src.stop(ctx.currentTime + durationSeconds);
}

// 3. Play panned tone (Left = -1, Center = 0, Right = 1)
export function playPannedTone(pan: number, freq = 440, durationSeconds = 1.8): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.2, ctx.currentTime + durationSeconds - 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

  try {
    const panner = typeof (ctx as any).createStereoPanner === 'function' ? (ctx as any).createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, ctx.currentTime);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      osc.connect(gain);
      gain.connect(ctx.destination);
    }
  } catch {
    osc.connect(gain);
    gain.connect(ctx.destination);
  }

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSeconds);
}

// 4. Play compression simulation
export function playCompressionTone(isCompressed: boolean, durationSeconds = 2.2): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);

  const gain = ctx.createGain();
  const now = ctx.currentTime;

  if (isCompressed) {
    // Compressed: fast attack transient pulled down, sustained constant volume
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.12);
    gain.gain.setValueAtTime(0.04, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 1.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  } else {
    // Uncompressed: natural acoustic volume envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
    gain.gain.setValueAtTime(0.18, now + durationSeconds - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSeconds + 0.05);
}

// 5. Play musical synth note (for theory keyboard)
export function playMusicalNote(noteFreq: number, durationSeconds = 0.8): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'triangle';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(noteFreq, ctx.currentTime);
  osc2.frequency.setValueAtTime(noteFreq * 2, ctx.currentTime); // 1 octave overtone

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + durationSeconds);
  osc2.stop(ctx.currentTime + durationSeconds);
}

// 6. Timer Alarm Chime
export function playStudioChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  frequencies.forEach((freq, idx) => {
    setTimeout(() => {
      playMusicalNote(freq, 0.6);
    }, idx * 160);
  });
}

// 7. Synthetic drum hits for Rhythm Lab
export function playDrumSound(type: 'kick' | 'snare' | 'hat' | 'perc'): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (type === 'kick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.15);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === 'snare') {
    // Tonal pop + noise burst
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(now);
  } else if (type === 'hat') {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noiseSrc.start(now);
  } else if (type === 'perc') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

// 7. Conversão de Nota MIDI para Frequência (Hz)
export function midiToFreq(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

// 8. Toca uma tríade de 3 notas simultâneas (Web Audio API)
export function playChordTriad(
  midiNotes: [number, number, number],
  durationSeconds = 1.0,
  volume = 0.18
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
  masterGain.gain.setValueAtTime(volume, now + durationSeconds - 0.08);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  masterGain.connect(ctx.destination);

  midiNotes.forEach(note => {
    const freq = midiToFreq(note);
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.32, now);

    osc.connect(voiceGain);
    voiceGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + durationSeconds + 0.02);
  });
}

// 9. Toca a sequência completa de 4 acordes (1 acorde por tempo)
export function playChordSequence(
  sequence: { midiNotes: [number, number, number] }[],
  bpm = 100,
  onStepChange?: (stepIndex: number) => void
): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const beatDuration = 60 / bpm; // duração de 1 tempo em segundos
  const chordDuration = beatDuration * 0.94; // respiro sutil entre acordes
  const now = ctx.currentTime + 0.05;

  const timeouts: NodeJS.Timeout[] = [];
  const oscillators: OscillatorNode[] = [];

  sequence.slice(0, 4).forEach((chord, idx) => {
    const startTime = now + idx * beatDuration;

    // Timeout para feedback visual de qual acorde está ativo
    const timer = setTimeout(() => {
      if (onStepChange) onStepChange(idx);
    }, (idx * beatDuration) * 1000);
    timeouts.push(timer);

    // Cria os nós para as 3 vozes simultâneas do acorde
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, startTime);
    chordGain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.03);
    chordGain.gain.setValueAtTime(0.2, startTime + chordDuration - 0.06);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, startTime + chordDuration);
    chordGain.connect(ctx.destination);

    chord.midiNotes.forEach(note => {
      const freq = midiToFreq(note);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const vGain = ctx.createGain();
      vGain.gain.setValueAtTime(0.33, startTime);
      osc.connect(vGain);
      vGain.connect(chordGain);

      osc.start(startTime);
      osc.stop(startTime + chordDuration);
      oscillators.push(osc);
    });
  });

  // Limpa feedback visual após o término dos 4 tempos
  const endTimer = setTimeout(() => {
    if (onStepChange) onStepChange(-1);
  }, 4 * beatDuration * 1000);
  timeouts.push(endTimer);

  // Retorna função para cancelar se o usuário pausar
  return () => {
    timeouts.forEach(t => clearTimeout(t));
    if (onStepChange) onStepChange(-1);
    oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch {}
    });
  };
}
