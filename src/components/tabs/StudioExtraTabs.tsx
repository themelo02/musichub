import React, { useState, useMemo, useEffect } from 'react';
import { ALL_PLUGINS } from '../../data/plugins';
import { PluginItem } from '../../types';
import { downloadFile, buildStudioOneGuide, buildStudioOneScript } from '../../utils/export';
import {
  Folder,
  Layers,
  Search,
  Filter,
  Download,
  Upload,
  BookOpen,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  HardDrive,
  Cpu,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  Trash2,
  Plus,
  Save,
  ArrowRight,
  HelpCircle,
  Volume2,
} from 'lucide-react';

// ==========================================
// 1. 📂 CATEGORIAS TAB
// ==========================================
export const CategoriesTab: React.FC<{
  onSelectPlugin?: (p: PluginItem) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}> = ({ onSelectPlugin, favorites, onToggleFavorite }) => {
  const [selectedCat, setSelectedCat] = useState<string>('Equalizadores');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    return Array.from(new Set(ALL_PLUGINS.map(p => p.cat))).sort();
  }, []);

  const pluginsInCat = useMemo(() => {
    return ALL_PLUGINS.filter(p => {
      const inCat = p.cat === selectedCat;
      const matchesSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.func.toLowerCase().includes(search.toLowerCase()) ||
        p.use.toLowerCase().includes(search.toLowerCase());
      return inCat && matchesSearch;
    });
  }, [selectedCat, search]);

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
            Arquitetura de Processamento
          </span>
        </div>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          📂 Categorias de Produção, Mixagem & Mastering
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Navegue pela coleção de 248 plugins organizada por famílias sonoras funcionais.
        </p>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const count = ALL_PLUGINS.filter(p => p.cat === cat).length;
          const isSelected = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                  : 'bg-[#111622] border border-[#1e2a3c] text-slate-400 hover:text-white hover:bg-[#151c2c]'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-black/30 text-black' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-[#111622] border border-[#1e2a3c] p-4 rounded-xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder={`Buscar em ${selectedCat}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white outline-none w-full font-mono placeholder:text-slate-600"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs font-mono text-slate-500 hover:text-white">
            Limpar
          </button>
        )}
      </div>

      {/* Grid of Plugins in Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pluginsInCat.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectPlugin && onSelectPlugin(p)}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-lime-400/50 rounded-2xl p-4 transition-all cursor-pointer group space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono group-hover:text-lime-300">
                  {p.name}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleFavorite(p.id);
                  }}
                  className={`text-xs p-1 ${favorites.has(p.id) ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'}`}
                >
                  ★
                </button>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 font-sans">{p.func}</div>
              <div className="text-[10px] text-slate-500 mt-1 font-sans line-clamp-2">
                <strong>Uso:</strong> {p.use}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-[#1a2332]">
              <span className="px-2 py-0.5 rounded bg-[#090d14] text-slate-400 border border-[#1f2b3e]">
                {p.level}
              </span>
              <span>{p.position || 'Insert'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. 📋 TABELA MASTER TAB
// ==========================================
export const MasterTableTab: React.FC<{
  onSelectPlugin?: (p: PluginItem) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}> = ({ onSelectPlugin, favorites, onToggleFavorite }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(ALL_PLUGINS.map(p => p.cat))).sort()];
  }, []);

  const filtered = useMemo(() => {
    return ALL_PLUGINS.filter(p => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.func.toLowerCase().includes(search.toLowerCase()) ||
        p.use.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'ALL' || p.cat === selectedCat;
      const matchLevel = selectedLevel === 'ALL' || p.level === selectedLevel;
      return matchSearch && matchCat && matchLevel;
    });
  }, [search, selectedCat, selectedLevel]);

  const handleExportCsv = () => {
    let csv = 'Nome,Categoria,Função,Melhor Uso,Nível,Posição\n';
    filtered.forEach(p => {
      csv += `"${p.name}","${p.cat}","${p.func.replace(/"/g, '""')}","${p.use.replace(/"/g, '""')}","${p.level}","${p.position || 'Insert'}"\n`;
    });
    downloadFile(`MeloMusic_Tabela_Master_${filtered.length}_Plugins.csv`, csv, 'text/csv;charset=utf-8');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
            Catálogo Geral Completo
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            📋 Tabela Master de Plugins Waves ({ALL_PLUGINS.length} Processadores)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consulta densa de engenharia com filtragem instantânea e exportação tabular em CSV.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-lime-300 transition-colors shrink-0 shadow-lg shadow-lime-400/20"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#111622] border border-[#1e2a3c] p-4 rounded-xl flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar por nome, função ou palavras-chave..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#090d14] border border-[#232f42] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono outline-none focus:border-lime-400"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="bg-[#090d14] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-lime-400"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'Todas as Categorias' : c}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value)}
          className="bg-[#090d14] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-lime-400"
        >
          <option value="ALL">Todos os Níveis</option>
          <option value="Essencial">Essencial</option>
          <option value="Profissional">Profissional</option>
          <option value="Especializado">Especializado</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-[#090d14] text-slate-400 uppercase sticky top-0 border-b border-[#212d3e] z-10">
              <tr>
                <th className="py-3 px-3 w-10 text-center">★</th>
                <th className="py-3 px-4 text-white">Plugin</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Função</th>
                <th className="py-3 px-4">Melhor Uso</th>
                <th className="py-3 px-3 text-center">Nível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17202e] text-slate-300">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => onSelectPlugin && onSelectPlugin(p)}
                  className="hover:bg-[#141b29] transition-colors cursor-pointer"
                >
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(p.id);
                    }}
                  >
                    <span className={favorites.has(p.id) ? 'text-amber-400' : 'text-slate-600'}>
                      ★
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-lime-300">{p.name}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {p.cat}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-200">{p.func}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-400">{p.use}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.level === 'Essencial'
                          ? 'bg-blue-500/20 text-blue-400'
                          : p.level === 'Profissional'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {p.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. 🎚️ EXPORTAR STUDIO ONE TAB
// ==========================================
export const ExportStudioOneTab: React.FC<{
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ onNotify }) => {
  const [selectedChain, setSelectedChain] = useState<'vocal-lead' | 'kizomba-mixbus' | 'mastering-punch' | 'snare-crack'>('vocal-lead');

  const chainsPresets = {
    'vocal-lead': {
      title: 'Vocal Lead de Alta Definição',
      daw: 'Presonus Studio One 6 / 7',
      desc: 'Cadeia completa de inserção vocal com equalização subtrativa, compressão rápida, de-esser e cor analógica.',
      plugins: [
        { plugin: 'Waves Q10', role: 'HPF em 90 Hz, corte cirúrgico em 340 Hz (-3dB Q=4.0)' },
        { plugin: 'Renaissance DeEsser', role: 'Threshold -22 dB, Frequência 5800 Hz, Band-pass' },
        { plugin: 'CLA-76 (Blacky)', role: 'Attack 3, Release 7, Ratio 4:1, GR de -3 a -5 dB' },
        { plugin: 'CLA-2A', role: 'Peak Reduction para colar os finais de frase (-2 dB de GR)' },
        { plugin: 'PuigTec EQP-1A', role: 'Boost +3 dB em 12 kHz e atenuação de 1 dB em 20 Hz' },
      ],
    },
    'kizomba-mixbus': {
      title: 'Mix Bus Kizomba & Ritmos Africanos',
      daw: 'Studio One Mix Engine FX',
      desc: 'Soma e cola analógica preservando os subgraves sem embolar os médios vocais.',
      plugins: [
        { plugin: 'SSL G-Master Bus Compressor', role: 'Attack 30ms, Release Auto, Ratio 2:1, GR 2dB' },
        { plugin: 'API 550B', role: 'Ajuste sutil em 50 Hz e 10 kHz (+1.5 dB)' },
        { plugin: 'Kramer Master Tape', role: 'Flux 180, Speed 15 ips, Warmth analógica' },
        { plugin: 'L2 Ultramaximizer', role: 'Apenas pegando picos raros (-0.5 dB GR)' },
      ],
    },
    'mastering-punch': {
      title: 'Mastering de Alto Impacto Urbano',
      daw: 'Studio One Project Page',
      desc: 'Cadeia estrita para atingir -9 a -8 LUFS integrados mantendo transientes afiados.',
      plugins: [
        { plugin: 'Linear Phase EQ', role: 'Corte estrito subsônico em 28 Hz com fase linear' },
        { plugin: 'C6 Multiband Compressor', role: 'Controle de transientes de 100-250 Hz e sibilância' },
        { plugin: 'PuigTec MEQ-5', role: 'Médios encorpados em 1 kHz e 3 kHz' },
        { plugin: 'L3-16 Multimaximizer', role: 'Limiter de 16 bandas em perfil Hi-Fi Master' },
      ],
    },
    'snare-crack': {
      title: 'Snare / Caixa com Estalo e Punch',
      daw: 'Studio One Console Track',
      desc: 'Tratamento de caixa para cortar a mixagem densa de Kuduro, Afropop ou Trap.',
      plugins: [
        { plugin: 'Smack Attack', role: 'Attack +4.5 dB para aumentar o estalo inicial' },
        { plugin: 'SSL E-Channel', role: 'Boost em 4 kHz (+4 dB), corte em 450 Hz' },
        { plugin: 'CLA-76 (Blue Stripe)', role: 'Ratio 8:1, ataque rápido para segurar o corpo' },
      ],
    },
  };

  const current = chainsPresets[selectedChain];

  const handleDownloadScript = () => {
    let txt = `PRESONUS STUDIO ONE PRESET SCRIPT\n`;
    txt += `Cadeia: ${current.title}\n`;
    txt += `DAW: ${current.daw}\n`;
    txt += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    txt += `========================================================\n\n`;
    current.plugins.forEach((p, idx) => {
      txt += `SLOT ${idx + 1}: ${p.plugin}\n`;
      txt += `  Ajuste: ${p.role}\n\n`;
    });
    txt += `DICA DE ROTEAMENTO NO STUDIO ONE:\n`;
    txt += `- Salve este canal como 'Track Preset' no console (botão direito no canal > Guardar Predefinição de Pista).\n`;
    downloadFile(`StudioOne_${selectedChain}.txt`, txt, 'text/plain;charset=utf-8');
    if (onNotify) onNotify('Script Studio One baixado com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
            DAW Integration
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            🎚️ Exportar Studio One (Predefinições & Racks)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Gere guias paramétricos estruturados e instruções prontas para carregar no mixer do PreSonus Studio One.
          </p>
        </div>
        <button
          onClick={handleDownloadScript}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Preset Studio One</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(chainsPresets).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setSelectedChain(key as any)}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedChain === key
                ? 'bg-blue-950/40 border-blue-400 shadow-md'
                : 'bg-[#111622] border-[#1e2a3c] hover:border-slate-600'
            }`}
          >
            <div className="text-xs font-mono font-bold text-white">{val.title}</div>
            <div className="text-[10px] text-slate-400 mt-1">{val.plugins.length} Plugins no Rack</div>
          </button>
        ))}
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c2738] pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-mono">{current.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{current.desc}</p>
          </div>
          <span className="text-xs font-mono text-blue-400 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20">
            {current.daw}
          </span>
        </div>

        <div className="space-y-3">
          {current.plugins.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#090d14] border border-[#1e2838] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <strong className="text-xs font-mono text-white">{p.plugin}</strong>
              </div>
              <div className="text-xs font-sans text-slate-300 sm:text-right">{p.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. 🔍 QUAL PLUGIN TAB (DIAGNÓSTICO)
// ==========================================
export const WhichPluginTab: React.FC<{
  onSelectPlugin?: (p: PluginItem) => void;
}> = ({ onSelectPlugin }) => {
  const [symptom, setSymptom] = useState('vocal_mud');

  const diagnostics = [
    {
      id: 'vocal_mud',
      problem: 'Vocal embolado e sem clareza nos médios graves (200-400 Hz)',
      solution: 'Equalização subtrativa cirúrgica + de-esser suave',
      primaryPlugin: 'Waves Q10 ou F6 Dynamic EQ',
      secondaryPlugin: 'Renaissance DeEsser',
      guidance: 'Faça um corte estreito (Q=3.5) de -2 a -4 dB em 320 Hz e verifique se o vocal se descola do arranjo.',
    },
    {
      id: 'snare_weak',
      problem: 'Caixa sem estalo e sem presença para furar guitarras e teclados',
      solution: 'Acentuação de transientes rápidos e compressão VCA rápida',
      primaryPlugin: 'Smack Attack',
      secondaryPlugin: 'CLA-76 (Blacky)',
      guidance: 'Aumente o Attack no Smack Attack em +3 dB e use o CLA-76 com ataque rápido para limitar a sobra.',
    },
    {
      id: 'bass_sub_chaos',
      problem: 'Grave do 808 / Baixo embolando com o bumbo (Kick)',
      solution: 'Sidechain dinâmico pontual ou corte seletivo',
      primaryPlugin: 'Waves C6 (Sidechain Band) ou F6',
      secondaryPlugin: 'Renaissance Bass',
      guidance: 'Comprima apenas os 50-80 Hz do baixo quando o bumbo bater, mantendo os harmônicos superiores intactos.',
    },
    {
      id: 'mix_thin',
      problem: 'Mixagem soando digital, dura e sem calor analógico',
      solution: 'Saturação de fita magnética e harmônicos pares/ímpares',
      primaryPlugin: 'Kramer Master Tape',
      secondaryPlugin: 'NLS Non-Linear Summer',
      guidance: 'Aplique 15 IPS no Kramer Master Tape e module o fluxo para aquecer as pontas agudas e graves.',
    },
    {
      id: 'vocal_harsh',
      problem: 'Voz agressiva, com sibilos cortantes no microfone (5-8 kHz)',
      solution: 'De-esser em série com detector passa-banda',
      primaryPlugin: 'Renaissance DeEsser',
      secondaryPlugin: 'DeEsser clássico',
      guidance: 'Use dois de-essers suaves com -3 dB de GR em frequências ligeiramente distintas em vez de um agressivo.',
    },
  ];

  const activeDiag = diagnostics.find(d => d.id === symptom) || diagnostics[0];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
          Diagnóstico Inteligente
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          🔍 Qual Plugin Devo Usar? (Assistente de Decisão Rápida)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Identifique o sintoma sonoro da sua mixagem e receba instantaneamente a recomendação de processamento exata.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {diagnostics.map(d => (
          <button
            key={d.id}
            onClick={() => setSymptom(d.id)}
            className={`p-4 rounded-xl text-left border transition-all ${
              symptom === d.id
                ? 'bg-amber-950/30 border-amber-400 shadow-md'
                : 'bg-[#111622] border-[#1e2a3c] hover:border-slate-600'
            }`}
          >
            <div className="text-xs font-bold text-white font-mono">{d.problem}</div>
            <div className="text-[10px] text-amber-400 mt-1 font-mono">{d.primaryPlugin}</div>
          </button>
        ))}
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-[#1c2738] pb-3">
          <span className="text-[10px] font-mono uppercase text-slate-500">Problema Detectado</span>
          <h3 className="text-base font-bold text-white font-mono mt-0.5">{activeDiag.problem}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e2838] space-y-2">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase">
              1. Plugin Principal Recomendado
            </span>
            <div className="text-base font-bold text-white font-mono">{activeDiag.primaryPlugin}</div>
            <p className="text-xs text-slate-300">{activeDiag.solution}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1e2838] space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">
              2. Plugin Complementar
            </span>
            <div className="text-base font-bold text-white font-mono">{activeDiag.secondaryPlugin}</div>
            <p className="text-xs text-slate-300">Reforço dinâmico para controle de picos.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed font-sans">
          <strong className="text-amber-300 font-mono block mb-1">Como Executar no Estúdio:</strong>
          {activeDiag.guidance}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. 📁 ORGANIZAÇÃO TAB
// ==========================================
export const OrganizationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
          Padronização Profissional
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          📁 Organização de Sessões, Stems & Nomenclatura Melo Music
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Diretrizes estritas de organização de pastas, cores de tracks e nomenclatura de arquivos para evitar perdas e agilizar colaborações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Folder className="w-4 h-4 text-lime-400" />
            Estrutura Padrão de Pastas do Projeto
          </h3>
          <div className="bg-[#090d14] p-4 rounded-xl border border-[#1e2838] font-mono text-xs text-slate-300 space-y-1">
            <div className="text-lime-300">📂 [ARTISTA]_[NOME_DA_MUSICA]_[BPM]_[TOM]/</div>
            <div className="pl-4">📁 01_Audio_Gravacoes/ (Takes brutos)</div>
            <div className="pl-4">📁 02_Edicao_Afina/ (Melodyne / VocAlign)</div>
            <div className="pl-4">📁 03_Mix_Sessoes/ (.song / .flp / .cpr)</div>
            <div className="pl-4">📁 04_Stems_Wav24/ (WAVs consolidados 0:00)</div>
            <div className="pl-4">📁 05_Masters_Finais/ (WAV 24/48 + MP3 320)</div>
            <div className="pl-4">📁 06_Docs_Contratos/ (Letra, ISRC, Splits)</div>
          </div>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            Nomenclatura Padrão de Stems
          </h3>
          <div className="bg-[#090d14] p-4 rounded-xl border border-[#1e2838] font-mono text-xs text-slate-300 space-y-1.5">
            <div>01_DRUMS_Kick.wav</div>
            <div>02_DRUMS_Snare.wav</div>
            <div>03_BASS_808.wav</div>
            <div>04_INST_Guitarras_L.wav</div>
            <div>05_INST_Keys_Rhodes.wav</div>
            <div>06_VOCAL_Lead_Dry.wav</div>
            <div>07_VOCAL_Backings_Stereo.wav</div>
            <div>08_FX_Risers_Impacts.wav</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. 🎛️ FL STUDIO TAB
// ==========================================
export const FLStudioTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-amber-500 font-bold tracking-wider">
          Workflow Alternativo
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          🎛️ Guia de Integração Waves no Image-Line FL Studio 21 / 24
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Roteamento no mixer, uso de Patcher para cadeias de processamento paralelo e compensação de atraso de plugin (PDC).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2a3c] space-y-2">
          <h4 className="font-bold text-white font-mono text-sm">1. Roteamento de Submix</h4>
          <p className="text-slate-400 leading-relaxed">
            Nunca mande todas as pistas direto para o Master. Crie canais de ônibus: <em>BUS VOCAL</em>, <em>BUS BATERIA</em> e <em>BUS HARMONIA</em> antes do master.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2a3c] space-y-2">
          <h4 className="font-bold text-amber-400 font-mono text-sm">2. Plugin Delay Compensation</h4>
          <p className="text-slate-400 leading-relaxed">
            Plugins de fase linear (Linear Phase EQ / L3) geram latência alta. Certifique-se de que o PDC automático do FL Studio esteja ligado no mixer menu.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2a3c] space-y-2">
          <h4 className="font-bold text-lime-400 font-mono text-sm">3. Patcher Paralelo</h4>
          <p className="text-slate-400 leading-relaxed">
            Use o Patcher para criar compressão paralela tipo "New York" dividindo o sinal limpo e o sinal comprimido com CLA-76 em 'All Buttons In'.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. 📦 JSON/CSV DATA EXPORT TAB
// ==========================================
export const DataExportTab: React.FC<{
  favorites: Set<string>;
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ favorites, onNotify }) => {
  const handleExportJson = () => {
    const backup = {
      app: 'Studio Hub Melo Music',
      exportedAt: new Date().toISOString(),
      favorites: Array.from(favorites),
      version: '2.0.0',
    };
    downloadFile('MeloMusic_Backup.json', JSON.stringify(backup, null, 2), 'application/json');
    if (onNotify) onNotify('Backup JSON exportado com sucesso!', 'success');
  };

  const handleExportCsv = () => {
    let csv = 'ID,Nome,Categoria,Funcao,Nivel\n';
    ALL_PLUGINS.forEach(p => {
      csv += `"${p.id}","${p.name}","${p.cat}","${p.func.replace(/"/g, '""')}","${p.level}"\n`;
    });
    downloadFile('MeloMusic_Catalogo_Completo.csv', csv, 'text/csv');
    if (onNotify) onNotify('Catálogo CSV exportado!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
          Exportação de Dados
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          📦 Funções de Dados, Backup & Exportação JSON / CSV
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Faça download das suas preferências, favoritos e biblioteca de engenharia em formatos universais.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2a3c] space-y-4">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-lime-400" />
            <div>
              <h3 className="text-base font-bold text-white font-mono">Backup Completo (JSON)</h3>
              <p className="text-xs text-slate-400">Exporta favoritos e histórico de estudo.</p>
            </div>
          </div>
          <button
            onClick={handleExportJson}
            className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-mono font-bold text-xs transition-colors"
          >
            Baixar Backup JSON
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2a3c] space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white font-mono">Catálogo Geral (CSV)</h3>
              <p className="text-xs text-slate-400">Planilha universal com todos os 248 plugins.</p>
            </div>
          </div>
          <button
            onClick={handleExportCsv}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors"
          >
            Baixar Catálogo CSV
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. 📝 NOTAS TAB (BLOCO DO PRODUTOR)
// ==========================================
export const NotesTab: React.FC<{
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ onNotify }) => {
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem('melo_music_producer_notes') || '';
  });

  const handleSaveNotes = () => {
    localStorage.setItem('melo_music_producer_notes', notes);
    if (onNotify) onNotify('Anotações salvas com sucesso no armazenamento local!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
            Caderno de Estúdio
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            📝 Bloco de Notas do Produtor & Engenheiro
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Anote ideias de mix, observações de clientes, frequências de ressonância e ideias harmónicas.
          </p>
        </div>
        <button
          onClick={handleSaveNotes}
          className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-lime-400/20"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Notas</span>
        </button>
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-2">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Escreva aqui suas anotações técnicas, observações para o cliente, frequências de corte..."
          rows={14}
          className="w-full bg-[#090d14] border border-[#212d3e] rounded-xl p-4 text-xs text-slate-100 font-mono outline-none focus:border-lime-400 leading-relaxed resize-y"
        />
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Persistência automática no armazenamento local do navegador.</span>
          <span>{notes.length} caracteres</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. 📏 REGRAS TAB (AXIOMAS DE ENGENHARIA)
// ==========================================
export const RulesTab: React.FC = () => {
  const rules = [
    {
      num: '01',
      title: 'Regra do Headroom (-18 dBFS RMS / -6 dBFS Peak)',
      desc: 'Plugins analógicos foram calibrados para responder de forma ideal com -18 dBFS RMS. Nunca entre em 0 dBFS no primeiro insert.',
    },
    {
      num: '02',
      title: 'Verificação em Mono Mandatória',
      desc: 'Abra e ouça sua mix em mono regularmente. Se o vocal principal ou o kick sumirem, você tem problemas graves de fase nos efeitos estéreo.',
    },
    {
      num: '03',
      title: 'Equalização Subtrativa Antes de Aditiva',
      desc: 'Corte frequências indesejadas antes de comprimir. Não dê ganho em frequências ressonantes que vão acionar o compressor indevidamente.',
    },
    {
      num: '04',
      title: 'Compressão em Estágios (Série)',
      desc: 'Dois compressores fazendo 2 dB de redução soam infinitamente mais transparentes e musicais que um único compressor fazendo 6 dB.',
    },
    {
      num: '05',
      title: 'Monitore em Volume de Conversa',
      desc: 'Trabalhar alto engana o ouvido devido à curva de Fletcher-Munson. Mixagens que soam equilibradas em volume baixo soam impecáveis em qualquer lugar.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-lime-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-lime-400 font-bold tracking-wider">
          Axiomas de Áudio
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          📏 Regras de Ouro & Referências de Trabalho
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Princípios inegociáveis de engenharia de áudio para garantir fidelidade, dinâmica e consistência comercial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(r => (
          <div key={r.num} className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-lime-400 px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">
                REGRA {r.num}
              </span>
              <h3 className="text-xs font-bold text-white font-mono">{r.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. 🔄 WORKFLOW TAB
// ==========================================
export const WorkflowTab: React.FC = () => {
  const steps = [
    { step: 1, name: 'Pré-Produção & Guia', action: 'Definir tom, BPM, referência comercial e arranjo inicial.' },
    { step: 2, name: 'Captação & Gravação', action: 'Microfonação adequada, ganho sem distorção e múltiplos takes limpos.' },
    { step: 3, name: 'Edição & Afinação', action: 'Comping vocal, alinhamento rítmico e afinação sutil (Melodyne).' },
    { step: 4, name: 'Mixagem Dinâmica & Tonal', action: 'Equalização cirúrgica, compressão, ambiência e automações expressivas.' },
    { step: 5, name: 'Mastering & Finalização', action: 'Equilíbrio espectral linear, limite de LUFS e checagem em múltiplos sistemas.' },
    { step: 6, name: 'Entrega & Arquivamento', action: 'Exportação de Stems sem clipping, WAV 24/48, MP3 320 e backup em nuvem.' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
          Metodologia Linear
        </span>
        <h2 className="text-xl font-bold text-white font-mono mt-1">
          🔄 Fluxo de Trabalho (Workflow) do Estúdio Melo Music
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          O pipeline padrão de 6 etapas que garante prazos e padrão de qualidade profissional para artistas e gravadoras.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map(s => (
          <div
            key={s.step}
            className="p-4 rounded-2xl bg-[#111622] border border-[#1e2a3c] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-lime-400 text-black font-mono font-black text-xs flex items-center justify-center shadow-md">
                0{s.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{s.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{s.action}</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
};
