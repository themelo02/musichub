import React from 'react';
import { ALL_PLUGINS } from '../../data/plugins';
import { DEFAULT_CHAINS } from '../../data/chains';
import {
  Layers,
  Sparkles,
  Sliders,
  Headphones,
  FileSpreadsheet,
  Flame,
  Award,
  BookOpen,
  ArrowUpRight,
  Music,
  CheckCircle,
  Clock,
  Radio,
  Zap,
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (section: string) => void;
  favoritesCount: number;
  studiedCount?: number;
  projectsCount?: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onNavigate,
  favoritesCount,
  studiedCount = 0,
  projectsCount = 0,
}) => {
  const totalPlugins = ALL_PLUGINS.length;
  const essentials = ALL_PLUGINS.filter(p => p.level === 'Essencial').length;
  const pros = ALL_PLUGINS.filter(p => p.level === 'Profissional').length;
  const specialized = ALL_PLUGINS.filter(p => p.level === 'Especializado').length;
  const categoriesCount = new Set(ALL_PLUGINS.map(p => p.cat)).size;
  const totalChains = Object.keys(DEFAULT_CHAINS).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121b2d] via-[#101726] to-[#0c121d] border border-blue-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Ultimate Professional Studio Workstation
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Studio Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-rose-400">Melo Music</span>
          </h1>
          <p className="mt-2.5 text-slate-300 text-sm md:text-base leading-relaxed">
            Estação completa para engenharia de áudio, mixagem vocal, cadeias de inserção Waves, exportação para Studio One, treino auditivo e gestão de estúdio.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigate('vocallab')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Produção Vocal
            </button>
            <button
              onClick={() => onNavigate('instrumentalmaster')}
              className="px-4 py-2.5 bg-[#182234] hover:bg-[#202d44] text-amber-400 border border-amber-400/30 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              Masterização Instrumental
            </button>
            <button
              onClick={() => onNavigate('audioanalyzer')}
              className="px-4 py-2.5 bg-[#141b27] hover:bg-[#1e283b] text-slate-200 border border-slate-700 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-blue-400" />
              Audio Analyzer
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">{totalPlugins}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Plugins Waves</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-amber-400 tracking-tight">{categoriesCount}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Categorias</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-blue-400/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-blue-400 tracking-tight">{essentials}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Essenciais</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400" />
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-cyan-400 tracking-tight">{pros}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Profissionais</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400" />
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-rose-400/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-rose-400 tracking-tight">{totalChains}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Cadeias Prontas</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-xl p-4 text-center relative overflow-hidden group hover:border-amber-300/50 transition-all">
          <div className="text-2xl md:text-3xl font-black font-mono text-amber-300 tracking-tight">{favoritesCount}</div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">Favoritos</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-300" />
        </div>
      </div>

      {/* Interactive Quick Modules */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Módulos de Aprendizagem & Treino
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div
            onClick={() => onNavigate('eartraining')}
            className="group bg-[#111622] border border-[#1e2a3c] hover:border-blue-500 rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400">Ear Training Interativo</h4>
            <p className="text-xs text-slate-400 mt-1">Testes sonoros de frequências, boost EQ, panorama e compressão com Web Audio.</p>
          </div>

          <div
            onClick={() => onNavigate('quiz')}
            className="group bg-[#111622] border border-[#1e2a3c] hover:border-amber-500 rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-400">Quiz de Engenharia</h4>
            <p className="text-xs text-slate-400 mt-1">20 problemas reais de estúdio em desafios de 10 perguntas com pontuação.</p>
          </div>

          <div
            onClick={() => onNavigate('learningcenter')}
            className="group bg-[#111622] border border-[#1e2a3c] hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400">Learning Center</h4>
            <p className="text-xs text-slate-400 mt-1">Fichas técnicas individuais para cada plugin: o que faz, onde usar e segredo profissional.</p>
          </div>

          <div
            onClick={() => onNavigate('references')}
            className="group bg-[#111622] border border-[#1e2a3c] hover:border-purple-500 rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400">Referências Musicais</h4>
            <p className="text-xs text-slate-400 mt-1">Músicas comerciais divididas por gênero (Afrobeat, Trap, R&B) para comparação A/B.</p>
          </div>
        </div>
      </div>

      {/* Production Quick Access */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          Acesso Rápido de Produção
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div
            onClick={() => onNavigate('studioone')}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-blue-400 p-4 rounded-xl cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>PRESETS DAW</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Exportar Studio One</h4>
            <p className="text-xs text-slate-400 mt-1">Gere guias HTML formatados, scripts TXT e arquivos de presets paramétricos.</p>
          </div>

          <div
            onClick={() => onNavigate('wizard')}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-blue-400 p-4 rounded-xl cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>ASSISTENTE</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Vocal Chain Wizard</h4>
            <p className="text-xs text-slate-400 mt-1">Questionário dinâmico para montar a cadeia vocal ideal para o seu gênero e voz.</p>
          </div>

          <div
            onClick={() => onNavigate('mixcoach')}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-blue-400 p-4 rounded-xl cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>DIAGNÓSTICO</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Mix Coach Inteligente</h4>
            <p className="text-xs text-slate-400 mt-1">Identifique conflitos em 1 clique e receba ações cirúrgicas com o plugin exato.</p>
          </div>

          <div
            onClick={() => onNavigate('business')}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-blue-400 p-4 rounded-xl cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>BUSINESS</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Studio Business Hub</h4>
            <p className="text-xs text-slate-400 mt-1">Calculadora de preços em USD e Kwanzas (Kz), contratos e split sheets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
