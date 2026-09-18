import React, { useState, useEffect, useRef } from 'react';
import { playFrequencyTone, playStudioChime } from '../../utils/audio';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Radio,
  Sliders,
  Info,
  CheckCircle,
} from 'lucide-react';

// 1. BPM Calculator Tab
export const BpmCalcTab: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
  const [mode, setMode] = useState<'normal' | 'dotted' | 'triplet'>('normal');

  const beatMs = 60000 / (bpm || 120);
  const multiplier = mode === 'dotted' ? 1.5 : mode === 'triplet' ? 2 / 3 : 1;

  const notesMap = [
    { label: '1/1 (Semibreve)', factor: 4 },
    { label: '1/2 (Mínima)', factor: 2 },
    { label: '1/4 (Semínima / 1 Beat)', factor: 1 },
    { label: '1/8 (Colcheia)', factor: 0.5 },
    { label: '1/16 (Semicolcheia)', factor: 0.25 },
    { label: '1/32 (Fusa)', factor: 0.125 },
    { label: '1/64 (Semifusa)', factor: 0.0625 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎼 Calculadora de BPM — Tempos de Delay & Pré-Delay
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Calcule os tempos exatos em milissegundos (ms) e frequências em Hertz (Hz) para afinar tempos de delay, ataque de compressores e pre-delays de reverberação em sincronia perfeita com o andamento musical.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Andamento (BPM):
            </label>
            <input
              type="number"
              min="20"
              max="320"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value) || 120)}
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-3 text-lg font-mono font-bold text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Modo Rítmico:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['normal', 'dotted', 'triplet'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 text-xs font-mono font-bold uppercase rounded-lg border transition-all ${
                    mode === m
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#0a0d14] border-[#202b3c] text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'normal' ? 'Normal' : m === 'dotted' ? 'Dotted (.)' : 'Triplet (T)'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1c2738] space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Freq. 1/4 Beat:</span>
              <strong className="text-amber-400">{(1000 / (beatMs * multiplier)).toFixed(2)} Hz</strong>
            </div>
            <div className="flex justify-between">
              <span>Pre-delay (1/64):</span>
              <strong className="text-blue-400">{(beatMs * 0.0625 * multiplier).toFixed(2)} ms</strong>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
            Valores Calculados em Milissegundos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {notesMap.map(item => {
              const msValue = (beatMs * item.factor * multiplier).toFixed(2);
              const hzValue = (1000 / (beatMs * item.factor * multiplier)).toFixed(2);
              return (
                <div
                  key={item.label}
                  className="p-3 bg-[#0a0d14] border border-[#1e293a] rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-300 font-mono">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{hzValue} Hz</div>
                  </div>
                  <div className="text-sm font-mono font-extrabold text-amber-400">{msValue} ms</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Gain Staging Calculator Tab
export const GainStagingTab: React.FC = () => {
  const [peak, setPeak] = useState<number>(-3);
  const [headroom, setHeadroom] = useState<number>(6);
  const [targetLufs, setTargetLufs] = useState<number>(-14);

  const targetPeak = -Math.abs(headroom);
  const requiredTrim = targetPeak - peak;

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎚️ Calculadora de Gain Staging & Headroom
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Evite distorções de inter-sample e prepare o seu projeto com folga de processamento (headroom ideal de 6 dB a 12 dB) antes de entrar nos plugins de saturação e compressão de bus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Pico Atual do Canal (dBFS):
            </label>
            <input
              type="number"
              step="0.5"
              value={peak}
              onChange={e => setPeak(Number(e.target.value))}
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-base font-mono font-bold text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Headroom Alvo Desejado (dB):
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={headroom}
              onChange={e => setHeadroom(Number(e.target.value))}
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-base font-mono font-bold text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Alvo de Streaming (LUFS Integrado):
            </label>
            <select
              value={targetLufs}
              onChange={e => setTargetLufs(Number(e.target.value))}
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-blue-500"
            >
              <option value="-14">-14 LUFS (Spotify / YouTube / Tidal / Amazon)</option>
              <option value="-16">-16 LUFS (Apple Music / Podcasts)</option>
              <option value="-9">-9 LUFS (Club / DJ / Dançante / Beat)</option>
              <option value="-23">-23 LUFS (Padrão Broadcast EBU R128 TV)</option>
            </select>
          </div>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider mb-4">
              Diagnóstico de Ganho
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex justify-between items-center">
                <span className="text-slate-400">Pico Máximo Permitido:</span>
                <strong className="text-white text-sm">{targetPeak.toFixed(1)} dBFS</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex justify-between items-center">
                <span className="text-slate-400">Ajuste de Trim Necessário:</span>
                <strong
                  className={`text-sm ${
                    requiredTrim <= 0 ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-extrabold'
                  }`}
                >
                  {requiredTrim > 0 ? `+${requiredTrim.toFixed(1)}` : requiredTrim.toFixed(1)} dB
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex justify-between items-center">
                <span className="text-slate-400">True Peak de Segurança:</span>
                <strong className="text-blue-400 text-sm">-1.0 dBTP</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-200 leading-relaxed">
            💡 <strong>Regra de Ouro:</strong> Ajuste o trim do canal no início da cadeia para que os picos fiquem em torno de {targetPeak.toFixed(1)} dBFS. Isso garante que plugins analógicos (como o CLA-2A e Scheps 73) operem na sua faixa ideal de saturação sem distorcer o sinal.
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Note to Hz Converter Tab
export const Note2HzTab: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState('A4');

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const allNotes: string[] = [];
  for (let oct = 0; oct <= 8; oct++) {
    NOTES.forEach(n => allNotes.push(`${n}${oct}`));
  }

  const parseNote = (noteStr: string) => {
    const match = noteStr.match(/^([A-G]#?)(\d)$/);
    if (!match) return { freq: 440, midi: 69 };
    const name = match[1];
    const oct = parseInt(match[2], 10);
    const semitone = NOTES.indexOf(name);
    const midi = (oct + 1) * 12 + semitone;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    return { freq, midi };
  };

  const { freq, midi } = parseNote(selectedNote);

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎵 Conversor de Nota Musical → Frequência (Hz)
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Encontre a frequência fundamental exata de qualquer nota musical (C0 a B8) para afinar equalizadores paramétricos no 808, bumbo ou caixas com precisão milimétrica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
              Selecione a Nota & Oitava:
            </label>
            <select
              value={selectedNote}
              onChange={e => setSelectedNote(e.target.value)}
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-3 text-base font-mono font-bold text-white outline-none focus:border-blue-500"
            >
              {allNotes.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => playFrequencyTone(freq, 1.2)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Ouvir Tom Senoidal ({freq.toFixed(1)} Hz)
          </button>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
            Resultado Paramétrico
          </h3>
          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Nota Musical:</span>
            <span className="text-xl font-mono font-extrabold text-amber-400">{selectedNote}</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Frequência Fundamental:</span>
            <span className="text-2xl font-mono font-black text-white">{freq.toFixed(2)} Hz</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Número de Nota MIDI:</span>
            <span className="text-base font-mono font-bold text-blue-400">{midi}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Studio Timer Anti-Fatigue Tab
export const TimerTab: React.FC<{
  onNotify: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ onNotify }) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playStudioChime();
            onNotify('Hora da pausa auditiva! Descanse os ouvidos por 5 a 10 minutos.', 'warn');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSelectPreset = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationMinutes * 60);
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          ⏱️ Timer Anti-Fadiga Auditiva
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          A audição humana sofre fadiga natural após 40 a 50 minutos de monitoramento contínuo, distorcendo a percepção de agudos e volume. Faça pausas programadas para manter julgamentos precisos.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-[#111622] border border-[#1e2a3c] rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="text-6xl md:text-7xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_25px_rgba(41,121,255,0.4)]">
          {formatTime(secondsRemaining)}
        </div>

        <div className="flex justify-center gap-3">
          {isRunning ? (
            <button
              onClick={() => setIsRunning(false)}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-mono text-sm font-bold uppercase rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold uppercase rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2.5">
            Duração da Sessão de Escuta:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => handleSelectPreset(mins)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  durationMinutes === mins
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-[#0a0d14] border border-[#232f42] text-slate-400 hover:text-white'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. LUFS Streaming Targets Tab
export const LufsTab: React.FC = () => {
  const targets = [
    { service: 'Spotify', lufs: '-14 LUFS', tp: '-1.0 dBTP', note: 'Normalização Loudness ativada por padrão' },
    { service: 'Apple Music', lufs: '-16 LUFS', tp: '-1.0 dBTP', note: 'Sound Check utiliza algoritmo proprietário' },
    { service: 'YouTube Music & Video', lufs: '-14 LUFS', tp: '-1.0 dBTP', note: 'Atenua faixas mais altas; não amplia as baixas' },
    { service: 'Tidal', lufs: '-14 LUFS', tp: '-1.0 dBTP', note: 'Padrão com reprodução bit-perfect Hi-Fi' },
    { service: 'Amazon Music', lufs: '-14 LUFS', tp: '-2.0 dBTP', note: 'Recomenda -2 dBTP para codec AAC/MP3' },
    { service: 'Deezer', lufs: '-15 LUFS', tp: '-1.0 dBTP', note: 'Normalização suave' },
    { service: 'Club / DJ / Dançante', lufs: '-8 a -9 LUFS', tp: '-0.3 dBTP', note: 'Loudness competitivo para sistemas PA de pista' },
    { service: 'EBU R128 (Broadcast TV)', lufs: '-23 LUFS', tp: '-1.0 dBTP', note: 'Norma estrita de televisão européia' },
    { service: 'Podcasts Stereo', lufs: '-16 LUFS', tp: '-1.0 dBTP', note: 'Padrão de voz e inteligibilidade vocal' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-emerald-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          📻 Alvos de Loudness (LUFS) & True Peak para Streaming
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Tabela comparativa dos principais serviços digitais. Masterize com foco na dinâmica e no impacto musical, monitorando sempre o medidor True Peak para evitar distorção inter-sample na compressão para MP3/AAC.
        </p>
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#090d14] border-b border-blue-500/30 text-slate-400 font-mono uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Plataforma / Finalidade</th>
              <th className="py-3.5 px-4">Loudness Integrado</th>
              <th className="py-3.5 px-4">True Peak Máximo</th>
              <th className="py-3.5 px-4">Observações Técnicas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#192334] text-slate-300">
            {targets.map(t => (
              <tr key={t.service} className="hover:bg-blue-500/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono">{t.service}</td>
                <td className="py-3 px-4 font-mono font-extrabold text-amber-400">{t.lufs}</td>
                <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{t.tp}</td>
                <td className="py-3 px-4 text-slate-400">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Interactive Frequency Spectrum Tab
export const SpectrumTab: React.FC = () => {
  const bands = [
    { name: 'Sub-bass', range: '20–60 Hz', color: '#ff1744', desc: 'Bumbo subgrave, 808 fundamental, rumble de sala' },
    { name: 'Bass (Graves)', range: '60–250 Hz', color: '#ff5252', desc: 'Corpo do kick, notas principais do baixo elétrico' },
    { name: 'Low-Mid (Médios-Graves)', range: '250–500 Hz', color: '#ffd600', desc: 'Lama potencial, caixa, corpo de violões e toms' },
    { name: 'Mid (Médios)', range: '500–2000 Hz', color: '#ffea00', desc: 'Inteligibilidade vocal, guitarras, pianos e sintetizadores' },
    { name: 'Upper-Mid (Médios-Altos)', range: '2000–4000 Hz', color: '#2979ff', desc: 'Ataque de palheta, presença de voz e estalo de caixa' },
    { name: 'High-Mid (Agudos Médios)', range: '4000–8000 Hz', color: '#00e5ff', desc: 'Sibilância ("S", "T"), clareza de pratos, estalo de bumbo' },
    { name: 'Highs (Agudos)', range: '8000–12000 Hz', color: '#69f0ae', desc: 'Brilho de hi-hats, abertura de sintetizadores' },
    { name: 'Air (Ar)', range: '12000–20000 Hz', color: '#ffffff', desc: 'Sensação de luxo, respiração acústica e ambiência' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          📈 Espectro de Frequências & Zonas de Instrumentos
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Mapa de orientação espectral do áudio audível humano (20 Hz a 20 kHz). Use para identificar áreas de acúmulo e separação de instrumentos.
        </p>
      </div>

      <div className="space-y-3">
        {bands.map(b => (
          <div
            key={b.name}
            className="p-4 rounded-xl bg-[#111622] border border-[#1e2a3c] hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                style={{ backgroundColor: b.color }}
              />
              <div>
                <h4 className="text-sm font-bold text-white font-mono">{b.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
            <div className="text-xs font-mono font-extrabold px-3 py-1.5 rounded-lg bg-[#0a0d14] border border-[#212c3e] text-amber-400 shrink-0 self-start sm:self-center">
              {b.range}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
