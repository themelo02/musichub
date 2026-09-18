import React, { useState } from 'react';
import { DEFAULT_CHAINS } from '../../data/chains';
import { ALL_PLUGINS } from '../../data/plugins';
import { ChainStep, ChainMap, PluginItem } from '../../types';
import {
  downloadFile,
  buildStudioOneGuide,
  buildStudioOneScript,
  buildChainsCSV,
} from '../../utils/export';
import {
  Check,
  Download,
  FileCode,
  FileText,
  Sliders,
  Plus,
  Trash2,
  Wand2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// 1. Chains & Studio One Tabs
export const ChainsTab: React.FC<{
  selectedChains: Set<string>;
  onToggleChain: (name: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onNotify: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ selectedChains, onToggleChain, onSelectAll, onClearAll, onNotify }) => {
  const chainNames = Object.keys(DEFAULT_CHAINS);

  const handleExportSelected = () => {
    if (selectedChains.size === 0) {
      onNotify('Selecione pelo menos uma cadeia para exportar.', 'warn');
      return;
    }
    const arr = Array.from(selectedChains);
    arr.forEach((name, idx) => {
      setTimeout(() => {
        downloadFile(
          `StudioOne_${name.replace(/\s+/g, '_')}.html`,
          buildStudioOneGuide(name, DEFAULT_CHAINS[name]),
          'text/html'
        );
      }, idx * 150);
      setTimeout(() => {
        downloadFile(
          `StudioOne_${name.replace(/\s+/g, '_')}.txt`,
          buildStudioOneScript(name, DEFAULT_CHAINS[name]),
          'text/plain'
        );
      }, idx * 150 + 50);
    });

    setTimeout(() => {
      const filtered: ChainMap = {};
      arr.forEach(n => {
        filtered[n] = DEFAULT_CHAINS[n];
      });
      downloadFile('chains_parametric.csv', buildChainsCSV(filtered), 'text/csv');
      onNotify(`Exportadas ${arr.length} cadeia(s) em HTML, TXT e CSV.`, 'success');
    }, arr.length * 150 + 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111622] border border-[#1e2a3c] p-4 rounded-2xl shadow-xl">
        <div className="text-xs font-mono text-slate-300">
          Cadeias Selecionadas:{' '}
          <strong className="text-amber-400 font-bold">{selectedChains.size}</strong> / {chainNames.length}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-amber-400"
          >
            ✓ Selecionar Todas
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300"
          >
            ✕ Limpar
          </button>
          <button
            onClick={handleExportSelected}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Studio One ({selectedChains.size})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chainNames.map(name => {
          const isSelected = selectedChains.has(name);
          const steps = DEFAULT_CHAINS[name];

          return (
            <div
              key={name}
              onClick={() => onToggleChain(name)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                isSelected
                  ? 'bg-[#121927] border-amber-400/80 shadow-xl shadow-amber-400/10'
                  : 'bg-[#111622] border-[#1e2a3c] hover:border-blue-500/50 hover:bg-[#131a29]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-amber-400">⚡</span> {name}
                </h3>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                      : 'border border-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                {steps.map((s, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-md bg-[#090d14] border border-[#232f42] text-slate-200 font-mono text-[11px]">
                      {s.plugin.replace(/^Waves\s+/, '')}
                    </span>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-amber-400/80 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#1c2738] flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>{steps.length} plugins no insert</span>
                <span className={isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {isSelected ? 'Pronta para exportar' : 'Clique para selecionar'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Custom Chain Builder Tab
export const CustomChainTab: React.FC<{
  customChain: string[];
  onAddPlugin: (id: string) => void;
  onRemovePlugin: (index: number) => void;
  onClearChain: () => void;
  onNotify: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ customChain, onAddPlugin, onRemovePlugin, onClearChain, onNotify }) => {
  const [search, setSearch] = useState('');

  const filtered = ALL_PLUGINS.filter(
    p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cat.toLowerCase().includes(search.toLowerCase()) ||
      p.func.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCustom = () => {
    if (customChain.length === 0) {
      onNotify('Sua cadeia customizada está vazia.', 'warn');
      return;
    }
    const steps: ChainStep[] = customChain.map(id => {
      const p = ALL_PLUGINS.find(x => x.id === id);
      return {
        plugin: p?.name || id,
        params: { Modo: 'Insert Paramétrico', Ajuste: 'Calibrado no canal' },
      };
    });

    const name = `Custom_Chain_${Date.now()}`;
    downloadFile(`StudioOne_${name}.html`, buildStudioOneGuide('Minha Cadeia Custom', steps), 'text/html');
    downloadFile(`StudioOne_${name}.txt`, buildStudioOneScript('Minha Cadeia Custom', steps), 'text/plain');
    onNotify('Cadeia customizada exportada em HTML e TXT com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎨 Construtor de Cadeia Customizada (Studio Rack)
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Monte o seu próprio rack de processamento a partir dos 248 plugins Waves. Adicione, reordene e exporte diretamente para o Studio One.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Plugin Library */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              ➕ Biblioteca Waves ({filtered.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Clique para adicionar</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrar por nome ou categoria..."
            className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
          />
          <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
            {filtered.slice(0, 70).map(p => (
              <div
                key={p.id}
                onClick={() => onAddPlugin(p.id)}
                className="p-2.5 rounded-xl bg-[#0d121b] border border-[#1c2636] hover:border-blue-500/60 hover:bg-[#111824] cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white font-mono">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {p.cat} · {p.func}
                  </div>
                </div>
                <button className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-mono font-bold transition-colors">
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Custom Chain slots */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
                🎚️ Sua Cadeia de Inserção ({customChain.length} slots)
              </h3>
              {customChain.length > 0 && (
                <button
                  onClick={onClearChain}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="min-h-[350px] border border-dashed border-[#232f42] rounded-xl p-3 space-y-2 max-h-[460px] overflow-y-auto">
              {customChain.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-72 text-center text-slate-500 font-mono text-xs">
                  <Sliders className="w-8 h-8 mb-2 opacity-50 stroke-[1.5]" />
                  <span>Sua cadeia está vazia.</span>
                  <span className="text-[11px] text-slate-600 mt-1">
                    Clique em qualquer plugin da biblioteca à esquerda para adicioná-lo ao sinal.
                  </span>
                </div>
              ) : (
                customChain.map((id, index) => {
                  const p = ALL_PLUGINS.find(x => x.id === id);
                  return (
                    <div
                      key={`${id}-${index}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-[#1f2b3e]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white font-mono">{p?.name || id}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p?.cat}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemovePlugin(index)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleExportCustom}
              disabled={customChain.length === 0}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Studio One (HTML + TXT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Vocal Wizard Tab
export const VocalWizardTab: React.FC<{
  onNotify: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = ({ onNotify }) => {
  const [genre, setGenre] = useState('Afrobeat');
  const [voice, setVoice] = useState('Masculina');
  const [problems, setProblems] = useState<string[]>(['Sibilância', 'Dinâmica excessiva']);
  const [generated, setGenerated] = useState<ChainStep[] | null>(null);

  const GENRES = ['Afrobeat', 'Trap', 'Hip-Hop/Rap', 'R&B', 'Pop', 'Kuduro', 'Kizomba', 'Gospel'];
  const VOICES = ['Masculina', 'Feminina', 'Neutra', 'Rap Rápido'];
  const ISSUES = [
    'Sibilância',
    'Dinâmica excessiva',
    'Falta de presença',
    'Ruído/Reverb de sala',
    'Falta de corpo (grave)',
    'Excesso de graves (lama)',
    'Nasalidade',
  ];

  const toggleProblem = (item: string) => {
    if (problems.includes(item)) {
      setProblems(problems.filter(x => x !== item));
    } else {
      setProblems([...problems, item]);
    }
  };

  const handleGenerate = () => {
    const chain: ChainStep[] = [
      { plugin: 'Waves Scheps 73', params: { 'HPF': '80 Hz', '10 kHz': '+2.5 dB' } },
    ];

    if (problems.includes('Ruído/Reverb de sala')) {
      chain.push({ plugin: 'Waves Clarity Vx', params: { 'Reduction': '60%', 'Mode': 'Broad 1' } });
    }
    if (problems.includes('Sibilância')) {
      chain.push({ plugin: 'Waves DeEsser', params: { 'Frequency': '7.2 kHz', 'Threshold': '-22 dB' } });
    }
    if (problems.includes('Dinâmica excessiva')) {
      chain.push({ plugin: 'Waves CLA-76', params: { 'Ratio': '8:1', 'Attack': '3', 'Release': '7' } });
    } else {
      chain.push({ plugin: 'Waves CLA-2A', params: { 'Peak Reduction': '4.5', 'Gain': '+3 dB' } });
    }
    if (problems.includes('Falta de presença')) {
      chain.push({ plugin: 'Waves Silk Vocal', params: { 'Presence': '40%', 'Mid': 'Optimized' } });
    }
    if (problems.includes('Falta de corpo (grave)')) {
      chain.push({ plugin: 'Waves PuigTec EQP-1A', params: { 'CPS 100': '+2 dB', 'Bandwidth': '5' } });
    }
    if (problems.includes('Excesso de graves (lama)')) {
      chain.push({ plugin: 'Waves F6 Dynamic EQ', params: { 'Band 2': '280 Hz -2.5dB Dynamic' } });
    }

    chain.push({ plugin: 'Waves Kramer Master Tape', params: { 'Input': '+2 dB', 'Speed': '15 ips' } });
    chain.push({ plugin: 'Waves H-Delay', params: { 'Time': '1/8 Dotted', 'Mix': '15%' } });

    setGenerated(chain);
    onNotify('Cadeia personalizada gerada com sucesso!', 'success');
  };

  const handleExport = () => {
    if (!generated) return;
    const name = `Vocal_Wizard_${genre}_${voice}`;
    downloadFile(`StudioOne_${name}.html`, buildStudioOneGuide(name, generated), 'text/html');
    onNotify('Preset exportado!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🧙 Vocal Chain Wizard — Gerador Inteligente
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Responda ao questionário musical abaixo para que o assistente construa uma cadeia paramétrica sob medida para o seu vocal.
        </p>
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Step 1: Genre */}
        <div>
          <label className="block text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2">
            1. Qual é o gênero musical da faixa?
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  genre === g
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#0a0d14] border border-[#232f42] text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Voice */}
        <div>
          <label className="block text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2">
            2. Que tipo de voz foi gravada?
          </label>
          <div className="flex flex-wrap gap-2">
            {VOICES.map(v => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  voice === v
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#0a0d14] border border-[#232f42] text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Problems */}
        <div>
          <label className="block text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2">
            3. Quais problemas você precisa resolver? (Múltipla escolha)
          </label>
          <div className="flex flex-wrap gap-2">
            {ISSUES.map(issue => {
              const selected = problems.includes(issue);
              return (
                <button
                  key={issue}
                  onClick={() => toggleProblem(issue)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-[#0a0d14] border border-[#232f42] text-slate-400 hover:text-white'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}
                  {issue}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-mono text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Gerar Cadeia Personalizada
        </button>
      </div>

      {generated && (
        <div className="bg-[#111622] border border-blue-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2b3e] pb-3">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">Resultado Gerado</span>
              <h3 className="text-base font-bold text-white font-mono">
                Cadeia: {genre} · Voz {voice} ({generated.length} plugins)
              </h3>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Studio One
            </button>
          </div>

          <div className="space-y-3">
            {generated.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e2a3c] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white font-mono">{step.plugin}</div>
                    <div className="text-xs text-slate-400">Inserção recomendada para este estágio</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(step.params).map(([k, v]) => (
                    <div
                      key={k}
                      className="px-2.5 py-1 rounded bg-[#131a26] border border-blue-500/20 text-xs font-mono"
                    >
                      <span className="text-blue-400 font-semibold">{k}:</span>{' '}
                      <span className="text-white font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Chain Validator Tab
export const ChainValidatorTab: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string>('Vocal Masculino');

  const chain = DEFAULT_CHAINS[selectedChain] || [];

  const analysis = React.useMemo(() => {
    const issues: { type: 'ok' | 'warn'; text: string }[] = [];
    const comps = chain.filter(x => /comp|cla-|api 2500|ssl g-master|2a/i.test(x.plugin)).length;
    const timeFx = chain.filter(x => /reverb|delay|echo|chamber|trueverb/i.test(x.plugin)).length;
    const limiters = chain.filter(x => /l1|l2|l3|limiter/i.test(x.plugin)).length;

    if (comps >= 3) {
      issues.push({
        type: 'warn',
        text: `Identificados ${comps} compressores no mesmo canal. Verifique se o acúmulo de redução de ganho não está achatando a dinâmica e a respiração.`,
      });
    }
    if (timeFx > 0) {
      issues.push({
        type: 'warn',
        text: `Detectados ${timeFx} efeito(s) de tempo/reverb no insert direto. Considere usar canais auxiliares (Send/Aux) para melhor controle estéreo e filtragem do retorno.`,
      });
    }
    if (limiters > 0 && /vocal|808|kick/i.test(selectedChain)) {
      issues.push({
        type: 'warn',
        text: `Existe um limitador brickwall no canal do elemento. Confirme se a intenção é apenas proteção de pico para evitar distorção digital indesejada.`,
      });
    }

    if (issues.length === 0) {
      issues.push({
        type: 'ok',
        text: 'Estrutura de inserção técnica aprovada sem redundâncias ou conflitos evidentes. Valide sempre por audição crítica.',
      });
    }

    return issues;
  }, [chain, selectedChain]);

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🧪 Chain Validator — Inspeção de Engenharia de Áudio
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Analisa a estrutura da cadeia selecionada para alertar sobre acúmulo de compressão, efeitos de tempo colocados no insert direto e perdas de transientes.
        </p>
      </div>

      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
            Selecione a cadeia para auditar:
          </label>
          <select
            value={selectedChain}
            onChange={e => setSelectedChain(e.target.value)}
            className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-blue-500"
          >
            {Object.keys(DEFAULT_CHAINS).map(name => (
              <option key={name} value={name}>
                {name} ({DEFAULT_CHAINS[name].length} plugins)
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-[#0a0d14] border border-[#1e2a3c] rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3">
            Fluxo de Sinal Analisado:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {chain.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1.5 rounded-lg bg-[#141b27] border border-[#233045] text-xs font-mono font-bold text-white">
                  {idx + 1}. {step.plugin.replace(/^Waves\s+/, '')}
                </span>
                {idx < chain.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-mono uppercase font-bold text-slate-400">
            Diagnóstico do Validator:
          </div>
          {analysis.map((res, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                res.type === 'ok'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {res.type === 'ok' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{res.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
