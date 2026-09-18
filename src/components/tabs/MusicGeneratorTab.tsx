import React, { useState, useEffect, useMemo } from 'react';
import {
  NOTE_NAMES,
  NoteName,
  SCALES,
  GENRE_PROGRESSIONS,
  ChordItem,
  ProgressionPattern,
  generateProgression,
  exportMidiFile,
} from '../../utils/midi';
import { playChordTriad, playChordSequence } from '../../utils/audio';
import {
  Play,
  Square,
  Download,
  Shuffle,
  Save,
  RotateCcw,
  Music,
  FolderOpen,
  Trash2,
  Volume2,
  Layers,
  Sparkles,
  Info,
  Check,
  Disc3,
  Clock,
  Sliders,
  FileMusic,
} from 'lucide-react';

export interface SavedProgression {
  id: string;
  name: string;
  keyRoot: NoteName;
  scaleKey: string;
  genre: string;
  bpm: number;
  chords: ChordItem[];
  savedAt: string;
}

const STORAGE_KEY = 'melo_music_saved_progressions';

interface MusicGeneratorTabProps {
  initialSubTab?: 'scales-gen' | 'chord-gen' | 'progressions' | 'angolan-styles' | 'listen-player' | 'midi-export';
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}

export const MusicGeneratorTab: React.FC<MusicGeneratorTabProps> = ({
  initialSubTab = 'chord-gen',
  onNotify,
}) => {
  const [subTab, setSubTab] = useState<'scales-gen' | 'chord-gen' | 'progressions' | 'angolan-styles' | 'listen-player' | 'midi-export'>(initialSubTab);

  // Sincroniza se a prop mudar pelo sidebar
  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Controles do Gerador de Acordes
  const [keyRoot, setKeyRoot] = useState<NoteName>('C');
  const [scaleKey, setScaleKey] = useState<string>('minor_natural');
  const [selectedGenre, setSelectedGenre] = useState<string>('Kizomba');
  const [selectedPatternId, setSelectedPatternId] = useState<string>('kizomba-1');
  const [customBpm, setCustomBpm] = useState<number>(95);

  // Sequência ativa de 4 acordes (tríades)
  const [currentChords, setCurrentChords] = useState<ChordItem[]>([]);

  // Estado de Reprodução
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [cancelPlayback, setCancelPlayback] = useState<(() => void) | null>(null);

  // Progressões Salvas
  const [savedProgressions, setSavedProgressions] = useState<SavedProgression[]>([]);
  const [loadModalOpen, setLoadModalOpen] = useState<boolean>(false);

  // Carrega do localStorage ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedProgressions(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Erro ao carregar progressões:', e);
    }
  }, []);

  // Lista de estilos únicos disponíveis
  const availableGenres = useMemo(() => {
    const genres = Array.from(new Set(GENRE_PROGRESSIONS.map(p => p.genre)));
    return genres;
  }, []);

  // Filtra progressões pelo estilo selecionado
  const progressionsForGenre = useMemo(() => {
    return GENRE_PROGRESSIONS.filter(p => p.genre === selectedGenre);
  }, [selectedGenre]);

  // Executa geração inicial de acordes
  const handleGenerate = (patternToUse?: ProgressionPattern) => {
    const pat = patternToUse || GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId) || GENRE_PROGRESSIONS[0];
    const chords = generateProgression(keyRoot, scaleKey, pat);
    setCurrentChords(chords);
    setCustomBpm(pat.bpm);
    if (onNotify) {
      onNotify(`4 acordes gerados em ${keyRoot} (${pat.genre}) com tríades puras.`, 'success');
    }
  };

  // Gera na inicialização
  useEffect(() => {
    handleGenerate();
  }, []);

  // Aleatória: sorteia uma progressão para o estilo ou geral
  const handleRandom = () => {
    const pool = progressionsForGenre.length > 0 ? progressionsForGenre : GENRE_PROGRESSIONS;
    const randomPat = pool[Math.floor(Math.random() * pool.length)];
    setSelectedGenre(randomPat.genre);
    setSelectedPatternId(randomPat.id);
    handleGenerate(randomPat);
    if (onNotify) {
      onNotify(`Progressão aleatória carregada: ${randomPat.name}`, 'info');
    }
  };

  // Playback com Web Audio API
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (cancelPlayback) cancelPlayback();
      setIsPlaying(false);
      setActiveStep(-1);
      return;
    }

    if (currentChords.length !== 4) {
      handleGenerate();
    }

    setIsPlaying(true);
    const stopFn = playChordSequence(currentChords, customBpm, step => {
      setActiveStep(step);
      if (step === -1) {
        setIsPlaying(false);
      }
    });
    setCancelPlayback(() => stopFn);
  };

  // Exportar MIDI
  const handleExportMidi = () => {
    if (currentChords.length !== 4) {
      handleGenerate();
    }
    const currentPattern = GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId);
    const safeGenre = (currentPattern?.genre || selectedGenre).replace(/\s+/g, '_');
    const safeKey = keyRoot.replace('#', 'Sharp');
    const filename = `MeloMusic_${safeGenre}_${safeKey}_4Acordes.mid`;

    exportMidiFile(currentChords, customBpm, filename);
    if (onNotify) {
      onNotify(`Arquivo MIDI exportado: ${filename} (4 tempos, 1 acorde por tempo, 3 notas simultâneas).`, 'success');
    }
  };

  // Guardar no localStorage
  const handleSave = () => {
    if (currentChords.length !== 4) return;
    const pat = GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId);
    const newProg: SavedProgression = {
      id: `${Date.now()}-${Math.random()}`,
      name: `${selectedGenre} · ${keyRoot} ${SCALES[scaleKey]?.name.split(' ')[0] || ''}`,
      keyRoot,
      scaleKey,
      genre: selectedGenre,
      bpm: customBpm,
      chords: currentChords,
      savedAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const next = [newProg, ...savedProgressions];
    setSavedProgressions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (onNotify) {
      onNotify('Progressão guardada com sucesso no armazenamento do navegador!', 'success');
    }
  };

  // Carregar do localStorage
  const handleLoadProgression = (item: SavedProgression) => {
    setKeyRoot(item.keyRoot);
    setScaleKey(item.scaleKey);
    setSelectedGenre(item.genre);
    setCustomBpm(item.bpm);
    setCurrentChords(item.chords);
    setLoadModalOpen(false);
    if (onNotify) {
      onNotify(`Progressão "${item.name}" carregada com sucesso!`, 'info');
    }
  };

  // Deletar do localStorage
  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = savedProgressions.filter(p => p.id !== id);
    setSavedProgressions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (onNotify) {
      onNotify('Progressão removida do armazenamento.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-300 font-mono text-[10px] font-bold tracking-wider uppercase border border-lime-400/30">
              Melo Music Engine
            </span>
            <span className="text-xs font-mono text-slate-400">Harmonia & Teoria Musical</span>
          </div>
          <h2 className="text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
            🎼 GERADOR MUSICAL — Escalas, Acordes & Estilos Angolanos
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Crie sequências harmónicas puras com 4 acordes, 4 tempos (1 acorde por tempo), tríades de 3 notas simultâneas, sem melodia, sem baixo e sem bateria. Exporte MIDI direto para sua DAW.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setLoadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#232f42] hover:border-lime-400 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-lime-400" />
            <span>Carregar ({savedProgressions.length})</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-xl bg-[#090d14] border border-lime-500/40 text-lime-300 hover:bg-lime-400/10 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar for the 6 Musical Features */}
      <div className="flex flex-wrap gap-2 border-b border-[#1c2738] pb-3">
        {[
          { id: 'chord-gen', label: '🎵 Gerador de Acordes', desc: '4 Acordes & MIDI' },
          { id: 'scales-gen', label: '🎹 Gerador de Escalas', desc: 'Modos & Notas' },
          { id: 'progressions', label: '🔄 Progressões', desc: 'Biblioteca Clássica' },
          { id: 'angolan-styles', label: '🇦🇴 Estilos Angolanos', desc: 'Kizomba, Semba, Kuduro' },
          { id: 'listen-player', label: '🎧 Ouvir', desc: 'Sintetizador Web Audio' },
          { id: 'midi-export', label: '🎹 Exportar MIDI', desc: 'DAW SMF Type 0' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              subTab === tab.id
                ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                : 'bg-[#111622] border border-[#1e2a3c] text-slate-400 hover:text-white hover:bg-[#151c2c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ABA PRINCIPAL: GERADOR DE ACORDES */}
      {(subTab === 'chord-gen' || subTab === 'midi-export' || subTab === 'listen-player') && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tonalidade */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wide flex items-center justify-between">
                  <span>Tonalidade</span>
                  <span className="text-slate-500 text-[10px]">Tônica</span>
                </label>
                <div className="grid grid-cols-6 gap-1 bg-[#090d14] p-1.5 rounded-xl border border-[#212c3e]">
                  {NOTE_NAMES.map(n => (
                    <button
                      key={n}
                      onClick={() => {
                        setKeyRoot(n);
                        const pat = GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId) || GENRE_PROGRESSIONS[0];
                        setCurrentChords(generateProgression(n, scaleKey, pat));
                      }}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        keyRoot === n
                          ? 'bg-lime-400 text-black shadow-sm font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escala */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide flex items-center justify-between">
                  <span>Escala</span>
                  <span className="text-slate-500 text-[10px]">{SCALES[scaleKey]?.intervals.length} Notas</span>
                </label>
                <select
                  value={scaleKey}
                  onChange={e => {
                    setScaleKey(e.target.value);
                    const pat = GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId) || GENRE_PROGRESSIONS[0];
                    setCurrentChords(generateProgression(keyRoot, e.target.value, pat));
                  }}
                  className="w-full bg-[#090d14] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-lime-400"
                >
                  {Object.entries(SCALES).map(([k, sc]) => (
                    <option key={k} value={k}>
                      {sc.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                  {SCALES[scaleKey]?.desc}
                </p>
              </div>

              {/* Estilo (Incluindo estilos angolanos) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide flex items-center justify-between">
                  <span>Estilo Musical</span>
                  <span className="text-slate-500 text-[10px]">Gênero</span>
                </label>
                <select
                  value={selectedGenre}
                  onChange={e => {
                    const newGenre = e.target.value;
                    setSelectedGenre(newGenre);
                    const firstOfGenre = GENRE_PROGRESSIONS.find(p => p.genre === newGenre);
                    if (firstOfGenre) {
                      setSelectedPatternId(firstOfGenre.id);
                      setCustomBpm(firstOfGenre.bpm);
                      setCurrentChords(generateProgression(keyRoot, scaleKey, firstOfGenre));
                    }
                  }}
                  className="w-full bg-[#090d14] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-lime-400"
                >
                  <optgroup label="🇦🇴 Estilos Angolanos">
                    {availableGenres
                      .filter(g => ['Kizomba', 'Semba', 'Kuduro', 'Tarraxinha', 'Afro House Angolano'].includes(g))
                      .map(g => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="🌍 Estilos Urbanos & Internacionais">
                    {availableGenres
                      .filter(g => !['Kizomba', 'Semba', 'Kuduro', 'Tarraxinha', 'Afro House Angolano'].includes(g))
                      .map(g => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                  </optgroup>
                </select>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono text-slate-400">BPM:</span>
                  <input
                    type="number"
                    min="60"
                    max="180"
                    value={customBpm}
                    onChange={e => setCustomBpm(Number(e.target.value) || 95)}
                    className="w-16 bg-[#090d14] border border-[#232f42] rounded-lg px-2 py-0.5 text-xs text-lime-400 font-mono text-center"
                  />
                  <span className="text-[10px] text-slate-500">Andamento</span>
                </div>
              </div>

              {/* Variação de Progressão */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                  <span>Cadência / Variação</span>
                  <span className="text-slate-500 text-[10px]">4 Acordes</span>
                </label>
                <select
                  value={selectedPatternId}
                  onChange={e => {
                    setSelectedPatternId(e.target.value);
                    const pat = GENRE_PROGRESSIONS.find(p => p.id === e.target.value);
                    if (pat) {
                      setCustomBpm(pat.bpm);
                      setCurrentChords(generateProgression(keyRoot, scaleKey, pat));
                    }
                  }}
                  className="w-full bg-[#090d14] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-lime-400"
                >
                  {progressionsForGenre.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.degrees.join(' - ')})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                  {GENRE_PROGRESSIONS.find(p => p.id === selectedPatternId)?.description}
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1c2838]">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* BOTÃO GERAR */}
                <button
                  onClick={() => handleGenerate()}
                  className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-mono font-black text-xs shadow-lg shadow-lime-400/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>GERAR ACORDES</span>
                </button>

                {/* BOTÃO ▶ OUVIR */}
                <button
                  onClick={handleTogglePlay}
                  className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs transition-all flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'PARAR' : '▶ OUVIR'}</span>
                </button>

                {/* BOTÃO 🎹 EXPORTAR MIDI */}
                <button
                  onClick={handleExportMidi}
                  className="px-4 py-2.5 rounded-xl bg-[#090d14] border border-lime-500/50 hover:bg-lime-400/10 text-lime-300 font-mono font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>🎹 EXPORTAR MIDI</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* BOTÃO 🔀 ALEATÓRIA */}
                <button
                  onClick={handleRandom}
                  className="px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#243144] text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5"
                  title="Sorteia uma progressão aleatória"
                >
                  <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                  <span>ALEATÓRIA</span>
                </button>

                {/* BOTÃO 💾 GUARDAR */}
                <button
                  onClick={handleSave}
                  className="px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#243144] text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5"
                  title="Salva a progressão no localStorage"
                >
                  <Save className="w-3.5 h-3.5 text-lime-400" />
                  <span>GUARDAR</span>
                </button>

                {/* BOTÃO ↻ CARREGAR */}
                <button
                  onClick={() => setLoadModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#243144] text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5"
                  title="Recupera uma progressão anteriormente guardada"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                  <span>CARREGAR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Os 4 Acordes Visualizados em Alta Resolução */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Sequência Gerada (4 Tempos · 1 Acorde por Tempo)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30 font-bold">
                  3 Notas Simultâneas (Tríades)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Andamento: <strong className="text-lime-400">{customBpm} BPM</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentChords.map((chord, idx) => {
                const isStepActive = isPlaying && activeStep === idx;
                return (
                  <div
                    key={`${chord.name}-${idx}`}
                    onClick={() => playChordTriad(chord.midiNotes, 1.2)}
                    className={`rounded-2xl p-5 border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                      isStepActive
                        ? 'bg-lime-950/40 border-lime-400 shadow-xl shadow-lime-400/20 scale-[1.03]'
                        : 'bg-[#111622] border-[#1e2a3c] hover:border-lime-500/40 hover:bg-[#141b29]'
                    }`}
                  >
                    {/* Active Bar indicator */}
                    {isStepActive && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-400 animate-pulse" />
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="px-2 py-0.5 rounded bg-black/50 text-slate-400 border border-slate-800">
                          TEMPO 0{idx + 1}
                        </span>
                        <span className="font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                          Grau {chord.degree}
                        </span>
                      </div>

                      <div className="my-2">
                        <div className="text-3xl font-black font-mono text-white tracking-tight flex items-baseline gap-2">
                          <span>{chord.name}</span>
                          <span className="text-xs font-normal text-slate-400 uppercase">
                            {chord.quality}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-1">
                          Tônica: <strong className="text-slate-200">{chord.rootNote}</strong>
                        </div>
                      </div>

                      {/* 3 Notas Simultâneas */}
                      <div className="mt-4 pt-3 border-t border-[#1c2838]">
                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5">
                          Tríade (3 Notas):
                        </div>
                        <div className="flex items-center gap-1.5">
                          {chord.notes.map((n, nIdx) => (
                            <span
                              key={nIdx}
                              className="flex-1 py-1 text-center rounded-lg bg-[#090d14] border border-[#212d3e] text-xs font-mono font-bold text-lime-300 shadow-inner"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-[#1a2332]">
                      <span className="flex items-center gap-1 text-slate-400 hover:text-lime-300">
                        <Volume2 className="w-3.5 h-3.5" /> Ouvir Acorde
                      </span>
                      <span>MIDI: {chord.midiNotes.join('·')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Especificações de Exportação MIDI Rigorosamente em Conformidade */}
          <div className="bg-[#0c1017] border border-[#1e2a3c] rounded-2xl p-5 shadow-inner space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-lime-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-lime-400" />
              Especificação Rígida de Exportação MIDI (SMF 0)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-xl bg-[#111622] border border-[#1e2838]">
                <span className="text-slate-500 block text-[10px]">ESTRUTURA</span>
                <strong className="text-white">4 Tempos (4 Beats)</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#111622] border border-[#1e2838]">
                <span className="text-slate-500 block text-[10px]">RITMO DE DISPARO</span>
                <strong className="text-lime-400">1 Acorde por Tempo</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#111622] border border-[#1e2838]">
                <span className="text-slate-500 block text-[10px]">POLIFONIA</span>
                <strong className="text-blue-400">3 Notas Simultâneas</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#111622] border border-[#1e2838]">
                <span className="text-slate-500 block text-[10px]">PUREZA HARMÓNICA</span>
                <strong className="text-amber-400">Sem melodia / baixo / drums</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUB-ABA: GERADOR DE ESCALAS */}
      {subTab === 'scales-gen' && (
        <div className="space-y-6">
          <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  Explorador de Escalas & Fórmulas Interválicas
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecione a tônica e a escala para analisar seus intervalos e tríades formadas sobre cada grau.
                </p>
              </div>

              {/* Tônica Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-slate-400">Tônica:</span>
                <select
                  value={keyRoot}
                  onChange={e => setKeyRoot(e.target.value as NoteName)}
                  className="bg-[#090d14] border border-[#232f42] rounded-xl px-3 py-1.5 text-xs text-lime-400 font-mono font-bold"
                >
                  {NOTE_NAMES.map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scale Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(SCALES).map(([k, sc]) => (
                <button
                  key={k}
                  onClick={() => setScaleKey(k)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    scaleKey === k
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#090d14] border border-[#202b3c] text-slate-400 hover:text-white'
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notas da Escala no Piano Visual */}
          <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2738] pb-3">
              <div>
                <h4 className="text-base font-mono font-bold text-white">
                  Escala de {keyRoot} {SCALES[scaleKey]?.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{SCALES[scaleKey]?.desc}</p>
              </div>
              <span className="text-xs font-mono text-lime-400 bg-lime-400/10 px-3 py-1 rounded-lg border border-lime-400/20">
                {SCALES[scaleKey]?.intervals.length} Notas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {SCALES[scaleKey]?.intervals.map((semitones, idx) => {
                const rootIdx = NOTE_NAMES.indexOf(keyRoot);
                const noteName = NOTE_NAMES[(rootIdx + semitones) % 12];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090d14] border border-[#1e2838] text-center space-y-1.5"
                  >
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">
                      Grau {idx + 1} ({semitones} st)
                    </span>
                    <div className="text-2xl font-black font-mono text-lime-300">{noteName}</div>
                    <button
                      onClick={() => playChordTriad([60 + semitones, 64 + semitones, 67 + semitones], 0.8)}
                      className="text-[10px] font-mono text-slate-400 hover:text-white transition-colors block mx-auto"
                    >
                      🔊 Tocar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-ABA: BIBLIOTECA DE PROGRESSÕES */}
      {subTab === 'progressions' && (
        <div className="space-y-4">
          <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-white font-mono">
              Biblioteca de Progressões Consagradas
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Todas as progressões prontas de 4 acordes catalogadas com andamento (BPM), graus funcionais e descrição técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GENRE_PROGRESSIONS.map(pat => {
              const chords = generateProgression(keyRoot, scaleKey, pat);
              return (
                <div
                  key={pat.id}
                  className="bg-[#111622] border border-[#1e2a3c] hover:border-lime-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {pat.isAngolan && (
                        <span className="text-sm" title="Estilo Angolano">
                          🇦🇴
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-white font-mono">{pat.name}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {pat.bpm} BPM
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{pat.description}</p>

                  <div className="flex items-center gap-2">
                    {chords.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex-1 text-center py-2 bg-[#090d14] rounded-lg border border-[#212d3e]"
                      >
                        <span className="text-[9px] font-mono text-slate-500 block">{c.degree}</span>
                        <strong className="text-xs font-mono text-lime-300">{c.name}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#1c2838]">
                    <button
                      onClick={() => {
                        playChordSequence(chords, pat.bpm);
                      }}
                      className="text-xs font-mono font-bold text-blue-400 hover:text-white flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Tocar
                    </button>

                    <button
                      onClick={() => {
                        exportMidiFile(chords, pat.bpm, `${pat.genre}_${keyRoot}_${pat.id}.mid`);
                        if (onNotify) onNotify(`MIDI exportado para ${pat.name}!`, 'success');
                      }}
                      className="text-xs font-mono font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar MIDI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SUB-ABA: ESTILOS ANGOLANOS */}
      {subTab === 'angolan-styles' && (
        <div className="space-y-6">
          <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              🇦🇴 Estilos Angolanos — Harmonia, Cadências & Tríades Típicas
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Guia especializado sobre a riqueza rítmica e melódica de Angola. A harmonia angolana dialoga estreitamente com a percussão sincopada, criando balanço sem sobrecarregar o espaço dos vocais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Kizomba',
                andamento: '90 – 98 BPM',
                origem: 'Derivado do Semba e influenciado pelo Zouk antilhano nos anos 1980.',
                harmonia: 'Progressões em menor natural (Eólio) ou acordes maiores com 6ª e 9ª. Típico: vi - IV - I - V ou i - VI - III - VII.',
                mix: 'Kick macio e aveludado, baixo subgrave com sustain redondo, vocais aveludados com CLA-2A.',
              },
              {
                title: 'Semba',
                andamento: '105 – 118 BPM',
                origem: 'A matriz rítmica tradicional de Angola. Alma de Luanda e dos bailes populares.',
                harmonia: 'Harmonia tonal rica em acordes de 7ª dominante, cadências I - vi - ii - V ou ciclos de quarta. Violões e dikanza.',
                mix: 'Percussão viva e brilhante, violões com presença nos médios (API 550), graves bem focados.',
              },
              {
                title: 'Kuduro',
                andamento: '138 – 144 BPM',
                origem: 'Nascido nos musseques de Luanda nos anos 90, fundindo eletrônica, batidas e atitude urbana.',
                harmonia: 'Harmonia ríspida, agressiva e minimalista. Tensão modal em Frígio e Menor Natural (i - iv - VII - i).',
                mix: 'Kick e snare de impacto com transientes afiados (Smack Attack), limiter de alta pressão (L3-16).',
              },
              {
                title: 'Tarraxinha',
                andamento: '84 – 90 BPM',
                origem: 'Vertente sensual e lenta da Kizomba com foco no contato corporal e no grave profundo.',
                harmonia: 'Cadências circulares hipnóticas em modo menor com acordes sustentados. i - VI - iv - V.',
                mix: 'Subgraves dominantes (LoAir / MaxxBass), ambiência escura com reverberação filtrada.',
              },
              {
                title: 'Afro House Angolano',
                andamento: '120 – 125 BPM',
                origem: 'Evolução contemporânea que une batidas de 4/4 à ancestralidade rítmica de Angola.',
                harmonia: 'Progressões cíclicas em modos Dórico ou Menor Harmónica. Acordes de sintetizador com filtros analógicos.',
                mix: 'Soma analógica no mix bus (NLS / API 2500), compressão paralela no kick e congas abertas.',
              },
            ].map(style => (
              <div
                key={style.title}
                className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#1c2738] pb-2.5">
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span>🇦🇴</span> {style.title}
                  </h4>
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {style.andamento}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-400 font-mono block text-[10px] uppercase">História & Identidade:</strong>
                    <p className="text-slate-300 leading-relaxed">{style.origem}</p>
                  </div>
                  <div>
                    <strong className="text-lime-400 font-mono block text-[10px] uppercase">Linguagem Harmónica:</strong>
                    <p className="text-slate-300 leading-relaxed">{style.harmonia}</p>
                  </div>
                  <div>
                    <strong className="text-blue-400 font-mono block text-[10px] uppercase">Diretrizes de Mixagem:</strong>
                    <p className="text-slate-300 leading-relaxed">{style.mix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Carregar Progressão Salva */}
      {loadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#253346] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2738] pb-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-lime-400" />
                Progressões Guardadas no Navegador
              </h3>
              <button
                onClick={() => setLoadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-xs font-mono"
              >
                Fechar
              </button>
            </div>

            {savedProgressions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                Nenhuma progressão guardada ainda. Use o botão 💾 GUARDAR para salvar suas criações.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {savedProgressions.map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => handleLoadProgression(prog)}
                    className="p-3.5 rounded-xl bg-[#090d14] border border-[#1e2a3c] hover:border-lime-400/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white font-mono group-hover:text-lime-300">
                        {prog.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {prog.bpm} BPM · {prog.chords.map(c => c.name).join(' - ')} · {prog.savedAt}
                      </div>
                    </div>
                    <button
                      onClick={e => handleDeleteSaved(prog.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Excluir progressão"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
