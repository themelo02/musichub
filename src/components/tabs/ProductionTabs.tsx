import React, { useState } from 'react';
import { ArrowRight, Sliders, Volume2, ShieldCheck, Zap, Disc3, Plus, Trash2, Edit, CheckCircle, RotateCcw, Download } from 'lucide-react';
import { AFRICAN_GENRES } from '../../data/genres';
import { ProjectItem } from '../../types';

// 1. Vocal Production Tab
export const VocalTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎤 Produção Vocal Completa — Da Gravação ao Refrão Final
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Guia estruturado em 4 etapas lineares para captura, afinação precisa, restauração de ruídos e canal vocal principal com compressão e ambiência.
        </p>
      </div>

      <div className="space-y-6">
        {/* Etapa 1 */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">1</span>
            Gravação & Preparação
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Etapa</th>
                <th className="py-2.5 px-3">Plugin Recomendado</th>
                <th className="py-2.5 px-3">Configuração Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Preparação de Canal</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves AudioTrack</td>
                <td className="py-2.5 px-3">HPF 80 Hz, Gate suave (-42 dB), ganho nivelado</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Nivelamento de Ganho</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves Vocal Rider</td>
                <td className="py-2.5 px-3">Target -18 dBFS, Range ±3 dB, Fast Attack</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Compressão de Tracking</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves CLA-76</td>
                <td className="py-2.5 px-3">Ratio 4:1, Attack 3 (lento), Release 7 (rápido), 2–3 dB de redução</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Proteção contra Picos</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves L1 Ultramaximizer</td>
                <td className="py-2.5 px-3">Ceiling -1.0 dBTP, Threshold apenas nos picos mais fortes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Etapa 2 */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
            Afinação & Pitch Correction
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Etapa</th>
                <th className="py-2.5 px-3">Plugin Recomendado</th>
                <th className="py-2.5 px-3">Configuração Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Afinação em Tempo Real</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves Tune Real-Time</td>
                <td className="py-2.5 px-3">Speed 20–30 ms, Transition 15–20 ms, Escala selecionada</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Edição Cirúrgica Gráfica</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves Tune</td>
                <td className="py-2.5 px-3">Modo Snap to Note, vibrato natural preservado</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Variação de Formante / Efeitos</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves Vocal Bender</td>
                <td className="py-2.5 px-3">Formant shift ±2 semitons para dobra ou timbre moderno</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Etapa 3 */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
            Limpeza & Restauração (Cleanup)
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Problema</th>
                <th className="py-2.5 px-3">Plugin Recomendado</th>
                <th className="py-2.5 px-3">Configuração Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Ruído de Sala / Ventilador</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">Waves Clarity Vx</td>
                <td className="py-2.5 px-3">Neural reduction 50–70% em modo Broad 1</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Respirações Excessivas</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">Waves DeBreath</td>
                <td className="py-2.5 px-3">Sensitivity 40%, Reduction -12 dB (não matar 100%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Sibilância ("S", "T")</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">Waves DeEsser</td>
                <td className="py-2.5 px-3">Banda centrada em 6.5–7.5 kHz, 4 a 6 dB de atenuação</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Reverb de Quarto / Parede</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">Waves Clarity Vx DeReverb</td>
                <td className="py-2.5 px-3">DeReverb 40–60%, preserve a naturalidade do corpo</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Etapa 4 */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">4</span>
            Vocal Principal (Lead Vocal Chain)
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3">Plugin</th>
                <th className="py-2.5 px-3">Configuração Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Equalizador Analógico</td>
                <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">Waves Scheps 73</td>
                <td className="py-2.5 px-3">HPF 80 Hz, 10 kHz Shelf +2.5 dB, Médio 3.2 kHz +1 dB</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Compressor Óptico</td>
                <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">Waves CLA-2A</td>
                <td className="py-2.5 px-3">Peak Reduction 4–6 dB, Gain +3 dB de compensação</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">De-esser Dinâmico</td>
                <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">Waves Renaissance DeEsser</td>
                <td className="py-2.5 px-3">Freq 7.2 kHz, Threshold -24 dB</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Saturação de Fita</td>
                <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">Waves Kramer Master Tape</td>
                <td className="py-2.5 px-3">Speed 15 ips, Input +2 dB para cola e calor harmônico</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Presença & Ar</td>
                <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">Waves Silk Vocal</td>
                <td className="py-2.5 px-3">Presence 35%, Low-mid control automático</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. Mixing Tab
export const MixingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎛️ Engenharia de Mixagem — Bateria, Baixo e Instrumentos
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Recomendações técnicas detalhadas para garantir punch no bumbo, nitidez no baixo e clareza nas melodias sem conflito espectral.
        </p>
      </div>

      <div className="space-y-6">
        {/* Kick & Snare */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-blue-400 font-mono uppercase tracking-wide mb-3 flex items-center gap-2">
            🥁 Kick & Snare
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Canal</th>
                <th className="py-2.5 px-3">Processador</th>
                <th className="py-2.5 px-3">Ajustes Recomendados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Kick EQ</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves SSL E-Channel</td>
                <td className="py-2.5 px-3">+3 dB em 60 Hz, -3 dB em 300 Hz (lama), +2.5 dB em 4 kHz (clique)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Kick Compressão</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves CLA-76</td>
                <td className="py-2.5 px-3">Ratio 4:1, Attack 3 (lento para deixar o punch passar), Release 7</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Kick Transientes</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves Smack Attack</td>
                <td className="py-2.5 px-3">Attack +3 dB, Sustain -1.5 dB para bumbo focado</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Snare Corpo</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves API 550</td>
                <td className="py-2.5 px-3">+3 dB em 200 Hz (corpo), +2 dB em 5 kHz (estalo)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Snare Saturação</td>
                <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">Waves Berzerk Distortion</td>
                <td className="py-2.5 px-3">Drive 25%, blend paralelo em 20% para densidade</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bass & 808 */}
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wide mb-3 flex items-center gap-2">
            🎸 Bass & 808
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-2.5 px-3">Elemento</th>
                <th className="py-2.5 px-3">Processador</th>
                <th className="py-2.5 px-3">Ajustes Recomendados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Bass Elétrico</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves Scheps 73</td>
                <td className="py-2.5 px-3">HPF em 40 Hz, Boost suave em 80 Hz (+2 dB), Corte em 400 Hz</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Harmónicos de Celular</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves MaxxBass</td>
                <td className="py-2.5 px-3">Focus 80 Hz, Intensity 35% (cria harmónicos audíveis em caixas pequenas)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">808 Controle Dinâmico</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves CLA-76</td>
                <td className="py-2.5 px-3">Ratio 4:1, controle rápido de transiente inicial para nivelar sustain</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Subgrave Profundo</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves LoAir</td>
                <td className="py-2.5 px-3">30 Hz sub generation em 35% para peso físico nos clubes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Glue Kick + Bass</td>
                <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">Waves API 2500</td>
                <td className="py-2.5 px-3">Thrust Loud (protege o grave de ativar a compressão indevidamente)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Mix Bus Tab
export const MixBusTab: React.FC = () => {
  const buses = [
    {
      name: 'Transparente & Dinâmico',
      desc: 'Ideal para música acústica, MPB, R&B elegante e pop moderno onde a fidelidade sonora é prioridade.',
      chain: ['Waves SSL G-Master', 'Waves F6 Dynamic EQ', 'Waves Abbey Road TG Mastering', 'Waves L2 Ultramaximizer'],
    },
    {
      name: 'Punchy & Moderno',
      desc: 'Perfeito para Afrobeat, Trap, Hip-Hop e Kuduro com impacto no peito e graves controlados.',
      chain: ['Waves API 2500', 'Waves Smack Attack', 'Waves MaxxBass', 'Waves L3-16 Multimaximizer'],
    },
    {
      name: 'Calor Analógico (Vintage)',
      desc: 'Emula a soma de consoles analógicos britânicos e fita de rolo de 15 polegadas.',
      chain: ['Waves NLS Non-Linear Summer', 'Waves Kramer Master Tape', 'Waves PuigTec EQP-1A', 'Waves Abbey Road TG'],
    },
    {
      name: 'Clean Comercial',
      desc: 'Cadeia balanceada para alta compatibilidade de streaming em Spotify e Apple Music.',
      chain: ['Waves Scheps Omni Channel 2', 'Waves C6 Multiband', 'Waves Vitamin Sonic Enhancer', 'Waves WLM Plus'],
    },
    {
      name: 'Agressivo & Alta Energia',
      desc: 'Saturação harmónica pronunciada para faixas de club, festival e eletrônica pesada.',
      chain: ['Waves Berzerk Distortion', 'Waves CLA-76', 'Waves API 560 Graphic EQ', 'Waves L3-16'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-cyan-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎚️ Cadeias do Mix Bus (5 Variações Consagradas)
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          O Mix Bus é a última ponte antes da masterização. Escolha a cadeia adequada ao estilo para criar coesão e cola sonora.
        </p>
      </div>

      <div className="space-y-4">
        {buses.map((b, idx) => (
          <div
            key={b.name}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="text-cyan-400">0{idx + 1}.</span> {b.name}
              </h3>
              <span className="text-xs font-mono text-slate-400">{b.chain.length} Plugins</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{b.desc}</p>
            <div className="flex flex-wrap gap-2 items-center mt-4 pt-3 border-t border-[#1a2536]">
              {b.chain.map((plugin, pIdx) => (
                <React.Fragment key={plugin}>
                  <span className="px-3 py-1.5 rounded-lg bg-[#0a0d14] border border-cyan-500/30 text-white font-mono text-xs font-bold shadow-sm">
                    {plugin.replace(/^Waves\s+/, '')}
                  </span>
                  {pIdx < b.chain.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Mastering Tab
export const MasteringTab: React.FC = () => {
  const chains = [
    { name: 'Master Transparente', flow: 'Linear Phase EQ → C4 Multiband → Abbey Road TG → L2 Ultramaximizer' },
    { name: 'Master Comercial Spotify', flow: 'F6 Dynamic EQ → SSL G-Master → Vitamin → L3-16 → WLM Plus' },
    { name: 'Master Hip-Hop & Rap', flow: 'F6 Dynamic EQ → API 2500 → MaxxBass → L3-16 Multimaximizer' },
    { name: 'Master Afrobeat', flow: 'F6 Dynamic EQ → CLA-2A → Vitamin Sonic Enhancer → L3-16' },
    { name: 'Master Trap 808', flow: 'F6 Dynamic EQ → CLA-76 → MaxxBass → L3-16' },
    { name: 'Master R&B Aveludado', flow: 'Linear Phase EQ → CLA-2A → PuigTec EQP-1A → L2' },
    { name: 'Master Club & DJ', flow: 'F6 Dynamic EQ → SSL G-Master → MaxxBass → L3-16 Multimaximizer' },
    { name: 'Master Acústico / Gospel', flow: 'Linear Phase EQ → C4 Multiband → Abbey Road TG → L2' },
    { name: 'Master Agressivo de Pista', flow: 'Berzerk Distortion → CLA-76 → API 560 → L3-16' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🔊 Cadeias de Masterização por Gênero
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Fluxos de sinal testados em produções comerciais. Lembre-se: masterizar é tomar decisões de equilíbrio tonal, dinâmica e loudness sem destruir a mixagem.
        </p>
      </div>

      <div className="space-y-3.5">
        {chains.map((c, idx) => {
          const parts = c.flow.split(' → ');
          return (
            <div key={c.name} className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider mb-2">
                0{idx + 1}. {c.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {parts.map((plugin, pIdx) => (
                  <React.Fragment key={plugin}>
                    <span className="px-3 py-1.5 rounded-lg bg-[#090d14] border border-amber-500/30 text-white font-mono text-xs font-bold">
                      {plugin}
                    </span>
                    {pIdx < parts.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Instrumental Master Tab
export const InstrumentalMasterTab: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'Pre-Master Check & Inspeção',
      desc: 'Receba o instrumental estéreo sem vocal com margem saudável (-6 a -3 dBFS). Ouça sem plugins procurando clipping, desequilíbrio e ruído.',
      tools: 'Waves PAZ Analyzer / Audio Analyzer',
      listen: 'Verifique se há clipping de inter-sample, graves exagerados ou estéreo fora de fase.',
    },
    {
      step: '02',
      title: 'Equilíbrio Tonal & Limpeza Cirúrgica',
      desc: 'Corrija apenas o que a mixagem precisa. Remova frequências inaudíveis abaixo de 20 Hz e atenuie ressonâncias de low-mid que turvam a faixa.',
      tools: 'Waves F6 Dynamic EQ / Linear Phase EQ',
      listen: 'Faça cortes pequenos e compare no mesmo volume percebido (gain matching).',
    },
    {
      step: '03',
      title: 'Controle Dinâmico & Cola (Glue)',
      desc: 'Se o instrumental precisar de sustentação, aplique compressão suave com compressor de bus. Preserve o impacto do kick e da caixa.',
      tools: 'Waves SSL G-Master / API 2500 / C4 Multiband',
      listen: 'Atente-se à redução de ganho (1 a 2 dB no máximo). Se o kick afundar, diminua a compressão.',
    },
    {
      step: '04',
      title: 'Cor Analógica & Densidade Harmónica',
      desc: 'Adicione harmónicos e textura se o instrumental soar digital ou frio demais.',
      tools: 'Waves Abbey Road TG / Kramer Master Tape / Vitamin',
      listen: 'Se o grave perder definição ou os agudos ficarem estridentes, reduza a intensidade.',
    },
    {
      step: '05',
      title: 'Imagem Estéreo & Compatibilidade Mono',
      desc: 'Expanda o campo estéreo apenas se o arranjo pedir. Verifique o subgrave rigorosamente em mono.',
      tools: 'Waves S1 Stereo Imager / Center',
      listen: 'Ouça em mono para garantir que instrumentos laterais não desapareçam por cancelamento de fase.',
    },
    {
      step: '06',
      title: 'Loudness & Limiting Final',
      desc: 'O limiter é o controle final de pico. Aumente até o ponto em que o impacto e a clareza se mantenham musicais.',
      tools: 'Waves L3-16 / L2 Ultramaximizer / WLM Plus',
      listen: 'Ajuste o ceiling para -1.0 dBTP (evita distorção em compressões MP3/AAC de streaming).',
    },
    {
      step: '07',
      title: 'Master Check & Entrega',
      desc: 'Validação final de especificações de áudio: Peak, RMS, True Peak, sample rate e pausas auditivas.',
      tools: 'Audio Analyzer / WLM Plus Loudness Meter',
      listen: 'Faça uma pausa auditiva de 5 minutos e volte para escutar a faixa completa em volume moderado.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-400 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          🎛️ Masterização de Instrumental Completo — sem vocal
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Fluxo de trabalho profissional para masterização do instrumental estéreo final antes da entrega ou distribuição. A cadeia é um ponto de partida; as decisões vêm dos ouvidos e das medições.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map(st => (
          <div
            key={st.step}
            className="bg-[#111622] border border-[#1e2a3c] hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                  PASSO {st.step}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Workflow</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">{st.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{st.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1c2738] space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-500 font-mono uppercase">Ferramentas:</span>{' '}
                <strong className="text-blue-400 font-mono">{st.tools}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-mono uppercase">O que ouvir:</span>{' '}
                <span className="text-slate-300">{st.listen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. African & Urban Genres Production Guides
export const GenresTab: React.FC<{
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}> = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const genre = AFRICAN_GENRES[selectedIdx] || AFRICAN_GENRES[0];
  const pluginList = genre.plugins ? genre.plugins.split(', ') : [];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-amber-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
            🌍 Herança Sonora & Produção
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            Gêneros Africanos & Urbanos Modernos
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Guias de produção e mixagem detalhados para Afrobeat, Amapiano, Kizomba, Kuduro, Semba, Gqom e mais. Aprenda o tratamento correto para bumbo, 808/log drum, percussões e vocais.
          </p>
        </div>
      </div>

      {/* Genre Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {AFRICAN_GENRES.map((g, idx) => (
          <button
            key={g.name}
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedIdx === idx
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-[#111622] border border-[#1e2a3c] text-slate-300 hover:text-white hover:bg-[#141c2b]'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Genre Dossier Card */}
      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2a3c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-white font-mono">{genre.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                {genre.bpm}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                {genre.country}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {genre.history}
            </p>
          </div>
          <div className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-right font-mono shrink-0">
            <div className="text-[10px] text-slate-400 uppercase">Target Loudness</div>
            <div className="text-base font-black text-amber-400">{genre.lufs}</div>
          </div>
        </div>

        {/* Pillars of the Genre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-1.5">
              🥁 Ritmo & Grooves
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{genre.rhythm}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
              🎹 Harmonia & Melodia
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{genre.harmony}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              🎛️ Engenharia de Mixagem
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{genre.mix}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-1.5">
              🔊 Requisitos de Masterização
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{genre.master}</p>
          </div>
        </div>

        {/* Essential Plugins for this genre */}
        <div className="p-4 rounded-xl bg-[#0d121c] border border-blue-500/20 space-y-2">
          <div className="text-xs font-mono uppercase font-bold text-slate-400">
            Plugins Waves Recomendados para {genre.name}:
          </div>
          <div className="flex flex-wrap gap-2">
            {pluginList.map((p: string) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-lg bg-[#141b27] border border-[#222e42] text-xs font-mono font-bold text-amber-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Projects Tab
export const ProjectsTab: React.FC<{
  projects: ProjectItem[];
  onOpenCreate: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
}> = ({ projects, onOpenCreate, onEditProject, onDeleteProject }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
            Sessões Ativas
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            Gerenciador de Projetos & Clientes
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Organize suas músicas em produção, anote tonalidade, BPM, metas de loudness (LUFS) e mantenha histórico de cada entrega.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#111622] border border-dashed border-[#232f42] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="text-slate-500 font-mono text-xs">Nenhum projeto cadastrado ainda.</div>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-xl"
          >
            Cadastrar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => {
            const status = p.status || 'Gravando';
            const title = p.title || p.name || 'Projeto sem título';
            const client = p.client || p.artist || '';
            const keyScale = p.keyScale || p.key || '—';
            const targetLufs = p.targetLufs || '-14 LUFS';
            const updatedAt = p.updatedAt || p.createdAt || 'Recente';

            return (
              <div
                key={p.id}
                className="bg-[#111622] border border-[#1e2a3c] hover:border-blue-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        status === 'Concluído'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : status === 'Masterizando'
                          ? 'bg-purple-500/20 text-purple-400'
                          : status === 'Mixando'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{updatedAt}</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-mono mt-2">{title}</h3>
                  <div className="text-xs text-slate-400 font-medium">
                    {client ? `${client} · ` : ''}
                    {p.genre}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-3 text-[11px] font-mono">
                    <div className="p-2 rounded bg-[#0a0d14] text-center">
                      <span className="text-slate-500 block text-[9px]">BPM</span>
                      <strong className="text-amber-400">{p.bpm}</strong>
                    </div>
                    <div className="p-2 rounded bg-[#0a0d14] text-center">
                      <span className="text-slate-500 block text-[9px]">TOM</span>
                      <strong className="text-blue-400">{keyScale}</strong>
                    </div>
                    <div className="p-2 rounded bg-[#0a0d14] text-center">
                      <span className="text-slate-500 block text-[9px]">LUFS</span>
                      <strong className="text-white">{targetLufs}</strong>
                    </div>
                  </div>

                  {p.notes && (
                    <p className="text-xs text-slate-400 mt-3 p-2.5 bg-[#0a0d14] rounded-lg border border-[#1b2536] italic line-clamp-2">
                      "{p.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b2536]">
                  <button
                    onClick={() => onEditProject(p)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(p.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 8. Studio Checklists Tab
export const ChecklistsTab: React.FC<{
  checklists: Record<string, boolean[]>;
  onToggleItem: (groupKey: string, index: number) => void;
  onResetChecklist: (groupKey: string, size: number) => void;
}> = ({ checklists, onToggleItem, onResetChecklist }) => {
  const GROUPS = [
    {
      key: 'tracking',
      title: '1. Gravação & Tracking Vocal',
      items: [
        'Ganho de pré-amplificador ajustado com picos entre -18 dBFS e -12 dBFS',
        'Filtro anti-pop posicionado a 10–15 cm da cápsula do microfone',
        'Headphone mix do artista sem latência audível e com reverb de conforto',
        'Uso de passa-altas (HPF 80 Hz) no canal do microfone',
        'Gravação de take principal + 2 dobras + ad-libs limpas',
      ],
    },
    {
      key: 'premix',
      title: '2. Pré-Mixagem & Organização',
      items: [
        'Pistas nomeadas, coloridas e roteadas para seus respectivos subgrupos (buses)',
        'Limpeza manual de silêncios, respirações e cliques com fades nas bordas',
        'Alinhamento de fase de bumbos compostos e caixas de esteira',
        'Afinação de vocal calibrada antes de qualquer compressor pesado',
        'Trim inicial de todos os canais para garantir headroom de 6 a 8 dB no master',
      ],
    },
    {
      key: 'mix',
      title: '3. Mixagem',
      items: [
        'Kick e Bass conversando sem conflito espectral (sidechain ou EQ inverso)',
        'Vocal principal audível e nítido em volume baixo de monitoramento',
        'Efeitos de tempo (reverb e delay) inseridos em canais Send/Aux e filtrados',
        'Verificação da mix em mono (mono check) para garantir compatibilidade estéreo',
        'Nenhum compressor atingindo mais de 4 a 5 dB de redução contínua num único estágio',
      ],
    },
    {
      key: 'master',
      title: '4. Masterização & Entrega',
      items: [
        'Corte passa-altas inaudível abaixo de 20 Hz para livrar energia desnecessária',
        'True Peak configurado em -1.0 dBTP para proteção contra distorção inter-sample',
        'Loudness integrado verificado no alvo planejado (-14 LUFS para streaming)',
        'Escuta crítica em fones de ouvido e sistema alternativo (celular / carro)',
        'Exportação em WAV 24-bit 44.1 kHz / 48 kHz sem dither duplicado',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-emerald-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
          📋 Checklists de Estúdio — Da Captação à Master Final
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Procedimento Operacional Padrão (SOP) para engenheiros de áudio. Marque cada etapa concluída para assegurar consistência profissional em todas as suas sessões.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROUPS.map(group => {
          const state = checklists[group.key] || new Array(group.items.length).fill(false);
          const completedCount = state.filter(Boolean).length;
          const progressPct = Math.round((completedCount / group.items.length) * 100);

          return (
            <div
              key={group.key}
              className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1c2838] pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white font-mono">{group.title}</h3>
                  <button
                    onClick={() => onResetChecklist(group.key, group.items.length)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                    title="Resetar checklist"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0a0d14] h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="space-y-2.5">
                  {group.items.map((item, idx) => {
                    const checked = !!state[idx];
                    return (
                      <label
                        key={idx}
                        onClick={() => onToggleItem(group.key, idx)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                          checked
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200'
                            : 'bg-[#0a0d14] border border-[#1c2738] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-0.5 accent-emerald-500 rounded"
                        />
                        <span className={checked ? 'line-through opacity-80' : ''}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>
                  {completedCount} de {group.items.length} concluídos
                </span>
                <span className="text-emerald-400 font-bold">{progressPct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

