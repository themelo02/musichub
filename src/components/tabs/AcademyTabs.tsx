import React, { useState, useEffect } from 'react';
import { ALL_PLUGINS } from '../../data/plugins';
import { DEFAULT_REFERENCES, OFFICIAL_TUTORIALS, QUIZ_QUESTIONS } from '../../data/references';
import { DECISION_DATABASE } from '../../data/decision';
import { PluginItem, ReferenceTrack, EarTrainingState } from '../../types';
import {
  playFrequencyTone,
  playBoostedNoise,
  playPannedTone,
  playCompressionTone,
} from '../../utils/audio';
import {
  Headphones,
  Award,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Search,
  BookOpen,
  Volume2,
  Filter,
  Plus,
  Tv,
  HelpCircle,
} from 'lucide-react';

// 1. Learning Center & Academy Tab
export const LearningCenterTab: React.FC<{
  studiedIds: Set<string>;
  onMarkStudied: (id: string) => void;
}> = ({ studiedIds, onMarkStudied }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(ALL_PLUGINS.map(p => p.cat))).sort()];

  const filtered = ALL_PLUGINS.filter(p => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cat.toLowerCase().includes(search.toLowerCase()) ||
      p.func.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || p.cat === selectedCat;
    return matchesSearch && matchesCat;
  });

  const getDetails = (p: PluginItem) => {
    const t = (p.name + ' ' + p.cat + ' ' + p.func).toLowerCase();
    let where = 'Use no estágio da cadeia onde o plugin resolve uma necessidade clara.';
    let how = 'Comece com ajustes moderados e compare com bypass em volume nivelado.';
    let over = 'Excesso de processamento pode gerar aspereza, perda de dinâmica ou fadiga auditiva.';
    let secret = 'O melhor ajuste quase sempre é a menor intervenção necessária para alcançar o objetivo.';

    if (/eq/.test(t)) {
      where = 'Insert de canais para limpeza cirúrgica ou no mix bus para modelagem tonal ampla.';
      how = 'Identifique a região ressonante com Q estreito e corte suavemente; use shelves musicais no topo.';
      over = 'Cortes ou boosts excessivos deixam o sinal fino, duro, oco ou artificial.';
      secret = 'Equalize ouvindo o arranjo inteiro, nunca apenas a pista em solo.';
    } else if (/compress|dynamic|cla-|api 2500/.test(t)) {
      where = 'Canais vocais, bateria, baixo e mix bus para controle de dinâmica e pegada.';
      how = 'Ajuste attack e release ouvindo o groove e a respiração; busque de 2 a 4 dB de redução.';
      over = 'Compressão em excesso esmaga transientes, cria bombeamento (pumping) e distorce o decay.';
      secret = 'Compressores em série com reduções leves soam muito mais naturais que um único compressor pesado.';
    } else if (/reverb|delay/.test(t)) {
      where = 'Preferencialmente em canais auxiliares (Send/Aux) para compartilhamento e filtragem.';
      how = 'Calcule o tempo em sincronia com o BPM e use passa-altas (150 Hz) e passa-baixas (5 kHz) no retorno.';
      over = 'Reverb excessivo afasta o vocal para trás da mix e embola os graves e médios.';
      secret = 'O reverb perfeito é aquele que você quase não nota que está lá, mas sente falta assim que é mutado.';
    } else if (/satur|tape|distortion|berzerk|tubes/.test(t)) {
      where = 'Guitarras, caixas, bumbos e mix bus para criar densidade e coesão harmônica.';
      how = 'Adicione saturação gradualmente até perceber calor e corpo, conferindo o ganho de saída.';
      over = 'Gera estridência digital e cansaço rápido nos ouvidos se passar do ponto.';
      secret = 'A fita analógica funciona como um limiter natural arredondando picos rápidos.';
    }

    return { where, how, over, secret };
  };

  const progressPct = Math.round((studiedIds.size / ALL_PLUGINS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111622] border-l-4 border-emerald-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
            🎓 Pedagogia & Engenharia
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            Learning Center — 248 Fichas de Estudo Prático
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Aprenda a função técnica, onde posicionar no sinal, como começar a regular, os riscos do excesso e o segredo profissional de cada plugin.
          </p>
        </div>
        <div className="bg-[#0a0d14] border border-[#232f42] rounded-xl p-3.5 text-right font-mono shrink-0">
          <div className="text-xs text-slate-400">Progresso de Estudo</div>
          <div className="text-lg font-black text-amber-400">
            {studiedIds.size} / {ALL_PLUGINS.length} ({progressPct}%)
          </div>
          <div className="w-36 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por plugin, categoria ou função..."
            className="w-full bg-[#10141e] border border-[#212c3e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="bg-[#10141e] border border-[#212c3e] rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'Todas as Categorias' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Lesson Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => {
          const isStudied = studiedIds.has(p.id);
          const { where, how, over, secret } = getDetails(p);

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isStudied
                  ? 'bg-[#121927] border-emerald-500/40 shadow-lg'
                  : 'bg-[#111622] border-[#1e2a3c] hover:border-blue-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {p.cat}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">{p.level}</span>
                  </div>
                  {isStudied && (
                    <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Estudado
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white font-mono">{p.name}</h3>
                <div className="text-xs text-blue-400 font-medium mt-0.5">{p.func}</div>

                <div className="space-y-2 mt-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0a0d14] border border-[#1c2636]">
                    <strong className="text-slate-400 font-mono text-[11px] block">Onde usar no sinal:</strong>
                    <span className="text-slate-300 mt-0.5 block">{where}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0a0d14] border border-[#1c2636]">
                    <strong className="text-slate-400 font-mono text-[11px] block">Como começar:</strong>
                    <span className="text-slate-300 mt-0.5 block">{how}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0a0d14] border border-[#1c2636]">
                    <strong className="text-rose-400 font-mono text-[11px] block">Se exagerar:</strong>
                    <span className="text-slate-300 mt-0.5 block">{over}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0a0d14] border border-[#1c2636]">
                    <strong className="text-amber-400 font-mono text-[11px] block">Segredo Pro:</strong>
                    <span className="text-slate-300 mt-0.5 block">{secret}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1c2636] flex justify-end">
                <button
                  onClick={() => onMarkStudied(p.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                    isStudied
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  {isStudied ? 'Desmarcar' : 'Concluir Estudo (+10 XP)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Ear Training Tab (Interactive Web Audio)
export const EarTrainingTab: React.FC = () => {
  const [mode, setMode] = useState<'frequency' | 'boost' | 'pan' | 'comp'>('frequency');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [currentFreq, setCurrentFreq] = useState<number>(1000);
  const [panValue, setPanValue] = useState<number>(0);
  const [compValue, setCompValue] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const BANDS = [
    { label: 'SUB', freq: 60 },
    { label: 'BASS', freq: 150 },
    { label: 'LOW-MID', freq: 400 },
    { label: 'MID', freq: 1000 },
    { label: 'UP-MID', freq: 3000 },
    { label: 'HIGH-MID', freq: 6000 },
    { label: 'HIGH', freq: 10000 },
    { label: 'AIR', freq: 16000 },
  ];

  const generateQuestion = (newMode = mode) => {
    setAnswered(false);
    setFeedback(null);

    if (newMode === 'frequency' || newMode === 'boost') {
      const randomBand = BANDS[Math.floor(Math.random() * BANDS.length)];
      setCurrentFreq(randomBand.freq);
      setCurrentAnswer(randomBand.label);
    } else if (newMode === 'pan') {
      const pans = ['ESQUERDA', 'CENTRO', 'DIREITA'];
      const idx = Math.floor(Math.random() * 3);
      const chosen = pans[idx];
      setPanValue(idx === 0 ? -0.85 : idx === 2 ? 0.85 : 0);
      setCurrentAnswer(chosen);
    } else if (newMode === 'comp') {
      const isComp = Math.random() < 0.5;
      setCompValue(isComp);
      setCurrentAnswer(isComp ? 'COM COMPRESSÃO' : 'SEM COMPRESSÃO');
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [mode]);

  const handlePlay = () => {
    if (mode === 'frequency') {
      playFrequencyTone(currentFreq, 1.8);
    } else if (mode === 'boost') {
      playBoostedNoise(currentFreq, 2.5);
    } else if (mode === 'pan') {
      playPannedTone(panValue, 440, 1.8);
    } else if (mode === 'comp') {
      playCompressionTone(compValue, 2.2);
    }
  };

  const handleAnswer = (choice: string) => {
    if (answered) return;
    setAnswered(true);
    setTotal(prev => prev + 1);

    const isOk = choice === currentAnswer;
    if (isOk) {
      setCorrect(prev => prev + 1);
      setScore(prev => prev + 10);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setFeedback({ ok: true, msg: 'Correto! Excelente precisão auditiva. (+10 pontos)' });
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 3));
      setFeedback({
        ok: false,
        msg: `Incorreto. A resposta correta era: ${currentAnswer}. (-3 pontos)`,
      });
    }

    setTimeout(() => {
      generateQuestion();
    }, 1800);
  };

  const successRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎧 Treinador Auditivo Interativo (Ear Training)
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Treine o seu ouvido para reconhecer frequências, aumentos de equalização, posições de panorama e artefatos de compressão usando síntese de áudio em tempo real.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-3.5 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase">Pontuação</div>
          <div className="text-2xl font-black text-amber-400 mt-0.5">{score}</div>
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-3.5 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase">Sequência (Streak)</div>
          <div className="text-2xl font-black text-blue-400 mt-0.5">{streak}</div>
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-3.5 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase">Melhor Sequência</div>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">{bestStreak}</div>
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-3.5 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase">Taxa de Acerto</div>
          <div className="text-2xl font-black text-purple-400 mt-0.5">{successRate}%</div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { id: 'frequency', label: '1. Frequência Pura', desc: 'Identificar a banda' },
          { id: 'boost', label: '2. Boost de EQ', desc: 'Ruído rosa com pico +14dB' },
          { id: 'pan', label: '3. Panorama Estéreo', desc: 'Esquerda, centro ou direita' },
          { id: 'comp', label: '4. Compressão', desc: 'Com ou sem controle dinâmico' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
              mode === m.id
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                : 'bg-[#111622] border-[#1e2a3c] text-slate-400 hover:text-white hover:bg-[#141b27]'
            }`}
          >
            <div className="font-bold text-xs">{m.label}</div>
            <div className="text-[10px] text-slate-500 mt-1">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Practice Center */}
      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-8 shadow-2xl text-center space-y-6 max-w-xl mx-auto">
        <div>
          <button
            onClick={handlePlay}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-mono font-black text-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-105 transition-transform"
          >
            <Play className="w-10 h-10 fill-white ml-1.5" />
          </button>
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mt-3">
            Clique no botão acima para ouvir o áudio
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {mode === 'frequency' || mode === 'boost' ? (
            BANDS.map(b => (
              <button
                key={b.label}
                disabled={answered}
                onClick={() => handleAnswer(b.label)}
                className="py-3 px-2 rounded-xl bg-[#0a0d14] border border-[#232f42] hover:border-blue-500 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all disabled:opacity-60"
              >
                {b.label}
                <span className="block text-[10px] text-slate-500 mt-0.5">{b.freq} Hz</span>
              </button>
            ))
          ) : mode === 'pan' ? (
            ['ESQUERDA', 'CENTRO', 'DIREITA'].map(opt => (
              <button
                key={opt}
                disabled={answered}
                onClick={() => handleAnswer(opt)}
                className="py-3 px-4 rounded-xl bg-[#0a0d14] border border-[#232f42] hover:border-blue-500 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all col-span-2 sm:col-span-1"
              >
                {opt}
              </button>
            ))
          ) : (
            ['COM COMPRESSÃO', 'SEM COMPRESSÃO'].map(opt => (
              <button
                key={opt}
                disabled={answered}
                onClick={() => handleAnswer(opt)}
                className="py-3 px-4 rounded-xl bg-[#0a0d14] border border-[#232f42] hover:border-blue-500 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all col-span-2"
              >
                {opt}
              </button>
            ))
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 ${
              feedback.ok
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {feedback.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{feedback.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Quiz Tab
export const QuizTab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<typeof QUIZ_QUESTIONS>([]);

  const startQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const allOptions = [currentQ.a, ...currentQ.wrong].sort();

  const handleSelectAnswer = (ans: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    if (ans === currentQ.a) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎯 Quiz de Plugins & Engenharia de Mixagem
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          10 perguntas de situações reais do estúdio. Teste se você sabe qual ferramenta usar para cada problema.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>
              Pergunta <strong className="text-amber-400">{currentIndex + 1}</strong> de {questions.length}
            </span>
            <span>
              Score: <strong className="text-blue-400">{score}</strong> / 100
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-bold text-white leading-relaxed">{currentQ.q}</h3>

          <div className="space-y-2.5">
            {allOptions.map((opt, i) => {
              let btnClass = 'bg-[#0a0d14] border-[#232f42] text-slate-200 hover:border-blue-500';
              if (selectedAnswer !== null) {
                if (opt === currentQ.a) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (opt === selectedAnswer) {
                  btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                }
              }

              return (
                <button
                  key={opt}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full p-4 rounded-xl border text-left font-mono text-sm transition-all flex items-center gap-3 ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-10 shadow-2xl max-w-md mx-auto text-center space-y-4">
          <Award className="w-16 h-16 text-amber-400 mx-auto stroke-[1.5]" />
          <h3 className="text-2xl font-black text-white font-mono">Quiz Concluído!</h3>
          <div className="text-4xl font-mono font-black text-amber-400">{score} / 100</div>
          <p className="text-xs text-slate-400">
            {score >= 80
              ? '🏆 Nível Mestre: Conhecimento técnico excelente das ferramentas de áudio!'
              : score >= 60
              ? '👍 Bom trabalho: Você já domina a maior parte das decisões de inserção.'
              : '📚 Continue estudando no Learning Center para refinar suas escolhas.'}
          </p>
          <button
            onClick={startQuiz}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

// 4. Tutorials Tab
export const TutorialsTab: React.FC = () => {
  const [filterCat, setFilterCat] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'vocals', label: '🎤 Vocais' },
    { id: 'eq', label: '🎚️ EQ' },
    { id: 'comp', label: '🎛️ Compressão' },
    { id: 'drums', label: '🥁 Bateria' },
    { id: 'bass', label: '🎸 Baixo' },
    { id: 'master', label: '🔊 Master' },
    { id: 'fx', label: '🔥 Efeitos' },
  ];

  const filtered =
    filterCat === 'all'
      ? OFFICIAL_TUTORIALS
      : OFFICIAL_TUTORIALS.filter(t => t.cat === filterCat);

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          📺 Tutoriais em Vídeo — Guias de Operação Waves
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Seleção de tutoriais oficiais e demonstrações práticas para dominar cada processador no seu fluxo de trabalho.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filterCat === c.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#111622] border border-[#1e2a3c] text-slate-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <a
            key={t.yt}
            href={`https://www.youtube.com/watch?v=${t.yt}`}
            target="_blank"
            rel="noreferrer"
            className="group bg-[#111622] border border-[#1e2a3c] hover:border-blue-500 rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 block"
          >
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${t.yt}/mqdefault.jpg`}
                alt={t.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                {t.cat}
              </span>
              <h4 className="text-sm font-bold text-white mt-1 line-clamp-2 group-hover:text-blue-400">
                {t.title}
              </h4>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// 5. References Tab
export const ReferencesTab: React.FC = () => {
  const [refs, setRefs] = useState<ReferenceTrack[]>(DEFAULT_REFERENCES);
  const [filterGenre, setFilterGenre] = useState('ALL');
  const [newTrack, setNewTrack] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newLufs, setNewLufs] = useState('');
  const [newWhy, setNewWhy] = useState('');

  const genres = ['ALL', ...Array.from(new Set(refs.map(r => r.genre)))];

  const filtered =
    filterGenre === 'ALL' ? refs : refs.filter(r => r.genre === filterGenre);

  const handleAdd = () => {
    if (!newTrack || !newArtist) return;
    setRefs([
      ...refs,
      {
        track: newTrack,
        artist: newArtist,
        genre: newGenre || 'Custom',
        year: new Date().getFullYear(),
        lufs: newLufs || '-9 LUFS',
        why: newWhy || 'Referência pessoal de estúdio',
      },
    ]);
    setNewTrack('');
    setNewArtist('');
    setNewGenre('');
    setNewLufs('');
    setNewWhy('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-purple-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          📀 Músicas de Referência Comercial por Gênero
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Nenhuma decisão de mixagem ou masterização deve ser tomada no escuro. Compare sempre a sua faixa com produções consagradas do mesmo gênero no mesmo volume percebido.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setFilterGenre(g)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filterGenre === g
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-[#111622] border border-[#1e2a3c] text-slate-400 hover:text-white'
            }`}
          >
            {g === 'ALL' ? 'Todos os Gêneros' : g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <div
            key={r.track + r.artist}
            className="p-5 rounded-2xl bg-[#111622] border border-[#1e2a3c] hover:border-purple-500/50 shadow-lg transition-all space-y-2.5"
          >
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold uppercase">
                {r.genre}
              </span>
              <span className="text-amber-400 font-bold">{r.lufs}</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{r.track}</h4>
              <div className="text-xs text-slate-400 font-mono font-semibold">{r.artist} ({r.year})</div>
            </div>
            <p className="text-xs text-slate-300 italic border-l-2 border-purple-500/50 pl-2.5 py-0.5">
              "{r.why}"
            </p>
          </div>
        ))}
      </div>

      {/* Add reference track */}
      <div className="bg-[#111622] border border-dashed border-[#26354d] rounded-2xl p-6 space-y-4">
        <h4 className="text-xs font-mono uppercase font-bold text-amber-400">
          + Adicionar Faixa de Referência Pessoal
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newTrack}
            onChange={e => setNewTrack(e.target.value)}
            placeholder="Nome da Música"
            className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
          />
          <input
            type="text"
            value={newArtist}
            onChange={e => setNewArtist(e.target.value)}
            placeholder="Artista"
            className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
          />
          <input
            type="text"
            value={newGenre}
            onChange={e => setNewGenre(e.target.value)}
            placeholder="Gênero (ex: Afrobeat)"
            className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
          />
          <input
            type="text"
            value={newLufs}
            onChange={e => setNewLufs(e.target.value)}
            placeholder="LUFS (ex: -9 LUFS)"
            className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
          />
        </div>
        <input
          type="text"
          value={newWhy}
          onChange={e => setNewWhy(e.target.value)}
          placeholder="O que ouvir como referência? (ex: 808 gordo e kick estalado)"
          className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-md shadow-purple-600/20"
        >
          Adicionar Referência
        </button>
      </div>
    </div>
  );
};

// 6. Decision System Tab
export const DecisionTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = DECISION_DATABASE.filter(
    d =>
      !search ||
      d.problem.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.recommendedPlugin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🧠 Sistema de Decisão de Áudio — Problema → Diagnóstico → Solução
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Guia rápido para engenharia reversa de falhas de mixagem: identifique o sintoma auditivo, entenda a causa e veja qual plugin e ajuste aplicam a correção recomendada.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filtrar por sintoma (ex: vocal fino, bumbo, sibilância, lama)..."
          className="w-full bg-[#10141e] border border-[#212c3e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#090d14] border-b border-amber-500/30 text-slate-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Problema / Sintoma</th>
                <th className="py-3 px-4">Diagnóstico Técnico</th>
                <th className="py-3 px-4">Ação de Engenharia</th>
                <th className="py-3 px-4">Plugin Recomendado</th>
                <th className="py-3 px-4">Configuração Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2536] text-slate-300">
              {filtered.map((d, i) => (
                <tr key={i} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-mono">{d.problem}</td>
                  <td className="py-3 px-4 text-slate-400">{d.diagnosis}</td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{d.action}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{d.recommendedPlugin}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-blue-300">{d.recommendedSettings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 7. Top Plugins Tab
export const TopPluginsTab: React.FC<{
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}> = ({ favorites, onToggleFavorite }) => {
  const essentials = ALL_PLUGINS.filter(p => p.level === 'Essencial');
  const pros = ALL_PLUGINS.filter(p => p.level === 'Profissional');
  const specialized = ALL_PLUGINS.filter(p => p.level === 'Especializado');

  return (
    <div className="space-y-8">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🏆 Top Plugins Waves Divididos por Nível de Prioridade
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Classificação didática dos 248 processadores para que você saiba exatamente em quais focar no início da sua jornada e quais deixar para mixagens avançadas.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm font-bold uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
          1. Nível Essencial ({essentials.length} Plugins Core)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {essentials.map(p => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-[#111622] border border-[#1e2a3c] flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{p.name}</h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {p.cat} · {p.func}
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(p.id)}
                className={`text-xs p-1 ${favorites.has(p.id) ? 'text-amber-400' : 'text-slate-600'}`}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
          2. Nível Profissional ({pros.length} Plugins de Alta Resolução)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {pros.slice(0, 30).map(p => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-[#111622] border border-[#1e2a3c] flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{p.name}</h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {p.cat} · {p.func}
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(p.id)}
                className={`text-xs p-1 ${favorites.has(p.id) ? 'text-amber-400' : 'text-slate-600'}`}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
