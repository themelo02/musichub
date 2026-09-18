import React, { useState, useRef, useEffect } from 'react';
import { getAudioContext } from '../../utils/audio';
import { Upload, Play, Pause, AlertCircle, CheckCircle, BarChart3, Activity } from 'lucide-react';

export const AudioAnalyzerTab: React.FC<{
  onNotify: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ onNotify }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [peakDbfs, setPeakDbfs] = useState<number | null>(null);
  const [rmsDbfs, setRmsDbfs] = useState<number | null>(null);
  const [dynamicRange, setDynamicRange] = useState<number | null>(null);
  const [clippingSamples, setClippingSamples] = useState<number>(0);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // File upload & decoding
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
    setIsPlaying(false);

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const arrayBuffer = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decoded);

      // Analyze Peak, RMS, Clipping
      measureBuffer(decoded);
      drawStaticWaveform(decoded);
      onNotify(`Áudio "${file.name}" carregado e analisado.`, 'success');
    } catch (err: any) {
      onNotify(`Erro ao decodificar áudio: ${err.message}`, 'error');
    }
  };

  const measureBuffer = (buffer: AudioBuffer) => {
    const channel = buffer.getChannelData(0);
    let peak = 0;
    let sumSq = 0;
    let clips = 0;

    for (let i = 0; i < channel.length; i++) {
      const absVal = Math.abs(channel[i]);
      if (absVal > peak) peak = absVal;
      sumSq += absVal * absVal;
      if (absVal >= 0.999) clips++;
    }

    const rms = Math.sqrt(sumSq / channel.length);
    const peakDb = peak <= 0 ? -120 : 20 * Math.log10(peak);
    const rmsDb = rms <= 0 ? -120 : 20 * Math.log10(rms);

    setPeakDbfs(peakDb);
    setRmsDbfs(rmsDb);
    setDynamicRange(peakDb - rmsDb);
    setClippingSamples(clips);
  };

  const drawStaticWaveform = (buffer: AudioBuffer) => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 800);
    const h = (canvas.height = 160);

    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, w, h);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / w);

    ctx.strokeStyle = '#2979ff';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < w; i++) {
      const start = i * step;
      const end = Math.min(start + step, data.length);
      let min = 1.0;
      let max = -1.0;

      for (let j = start; j < end; j++) {
        const val = data[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }

      ctx.moveTo(i, h / 2 + min * (h / 2) * 0.9);
      ctx.lineTo(i, h / 2 + max * (h / 2) * 0.9);
    }
    ctx.stroke();
  };

  const togglePlayback = () => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (audio.paused) {
      setupRealtimeAnalyser();
      audio.play();
      setIsPlaying(true);
      startSpectrumLoop();
    } else {
      audio.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const setupRealtimeAnalyser = () => {
    const ctx = getAudioContext();
    const audio = audioElementRef.current;
    if (!ctx || !audio || sourceNodeRef.current) return;

    try {
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(analyser);
      analyser.connect(ctx.destination);

      sourceNodeRef.current = source;
      analyserNodeRef.current = analyser;
    } catch {
      // already connected
    }
  };

  const startSpectrumLoop = () => {
    const canvas = specCanvasRef.current;
    const analyser = analyserNodeRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 800);
    const h = (canvas.height = 160);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);

      const barWidth = (w / bufferLength) * 3.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * h * 0.95;

        // Gradient from blue to amber
        const hue = 210 + (i / bufferLength) * 60;
        ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;

        ctx.fillRect(x, h - barHeight, barWidth, barHeight);
        x += barWidth + 1;
        if (x > w) break;
      }
    };

    renderFrame();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎧 Audio Analyzer em Tempo Real (Waveform & FFT Espectro)
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Carregue uma faixa de áudio (WAV, MP3, FLAC) diretamente do seu computador. O processamento ocorre 100% no seu navegador com a Web Audio API, medindo picos, RMS, alcance dinâmico e clipping digital.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 space-y-4 shadow-xl">
        <label className="border-2 border-dashed border-[#26374f] hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-[#090d14]">
          <Upload className="w-10 h-10 text-blue-400 mb-2 stroke-[1.5]" />
          <span className="text-sm font-bold text-white font-mono">
            {audioFile ? audioFile.name : 'Clique para selecionar um arquivo de áudio'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Formatos suportados: WAV, MP3, AAC, AIFF, OGG</span>
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>

        {audioUrl && (
          <div className="flex items-center gap-4 bg-[#0a0d14] border border-[#1e2a3c] p-4 rounded-xl">
            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-8"
              controls
            />
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center font-mono">
          <div className="text-[11px] text-slate-400 uppercase">Peak dBFS</div>
          <div
            className={`text-xl font-black mt-1 ${
              peakDbfs !== null && peakDbfs >= -0.1 ? 'text-rose-500' : 'text-amber-400'
            }`}
          >
            {peakDbfs !== null ? `${peakDbfs.toFixed(2)} dB` : '—'}
          </div>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center font-mono">
          <div className="text-[11px] text-slate-400 uppercase">RMS dBFS</div>
          <div className="text-xl font-black text-blue-400 mt-1">
            {rmsDbfs !== null ? `${rmsDbfs.toFixed(2)} dB` : '—'}
          </div>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center font-mono">
          <div className="text-[11px] text-slate-400 uppercase">Dynamic Range (DR)</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {dynamicRange !== null ? `${dynamicRange.toFixed(2)} dB` : '—'}
          </div>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center font-mono">
          <div className="text-[11px] text-slate-400 uppercase">Clipping Digital</div>
          <div
            className={`text-xl font-black mt-1 ${
              clippingSamples > 0 ? 'text-rose-500' : 'text-emerald-400'
            }`}
          >
            {clippingSamples > 0 ? `${clippingSamples} samples` : '0 (Seguro)'}
          </div>
        </div>
      </div>

      {/* Waveform & FFT Spectrum Canvases */}
      <div className="space-y-4">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase">
              <Activity className="w-4 h-4 text-blue-400" /> Forma de Onda (Waveform)
            </span>
            <span>Canal Estéreo Principal</span>
          </div>
          <canvas ref={waveCanvasRef} className="w-full h-40 rounded-xl bg-[#0a0d14] border border-[#1e283a]" />
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Analisador de Espectro FFT em Tempo Real
            </span>
            <span>20 Hz → 20 kHz</span>
          </div>
          <canvas ref={specCanvasRef} className="w-full h-40 rounded-xl bg-[#0a0d14] border border-[#1e283a]" />
        </div>
      </div>
    </div>
  );
};
