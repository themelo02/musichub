import React, { useState, useEffect } from 'react';
import { X, Star, ExternalLink, Sliders, CheckCircle2, FileText, Music } from 'lucide-react';
import { PluginItem, ProjectItem } from '../types';

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<GenericModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[85vh] bg-[#111622] border border-[#26354d] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1f2c40] pb-4 mb-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-300 text-sm">{children}</div>
      </div>
    </div>
  );
};

// Plugin Details Modal
interface PluginModalProps {
  plugin: PluginItem;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export const PluginModal: React.FC<PluginModalProps> = ({
  plugin,
  isFavorite,
  onClose,
  onToggleFavorite,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#101520] border border-[#24334a] rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1c293c] pb-4">
          <div className="flex items-center gap-4">
            <img
              src={plugin.img}
              alt={plugin.name}
              className="w-16 h-16 rounded-2xl bg-black/60 border border-slate-700/60 p-1.5 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {plugin.cat}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    plugin.level === 'Essencial'
                      ? 'bg-blue-500/20 text-blue-400'
                      : plugin.level === 'Profissional'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {plugin.level}
                </span>
                {plugin.essential && (
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-black px-2 py-0.5 rounded">
                    CORE
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white font-mono mt-1">{plugin.name}</h2>
              <div className="text-xs text-blue-400 font-medium">{plugin.func}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(plugin.id)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-amber-400/20 border border-amber-400/40 text-amber-400'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 text-xs">
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1c2738]">
            <div className="font-mono text-[11px] uppercase text-slate-400 font-bold mb-1">
              Melhor Aplicação no Estúdio:
            </div>
            <div className="text-slate-200 text-sm leading-relaxed">{plugin.use}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1c2738]">
              <div className="font-mono text-[11px] uppercase text-slate-400 font-bold mb-1">
                Posição no Sinal:
              </div>
              <div className="text-amber-400 font-mono font-bold">
                {plugin.position || 'Insert / Canal Auxiliar'}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090d14] border border-[#1c2738]">
              <div className="font-mono text-[11px] uppercase text-slate-400 font-bold mb-1">
                Tipo de Processamento:
              </div>
              <div className="text-blue-400 font-mono font-bold">
                {plugin.cat} · 64-bit Floating Point
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090d14] border border-[#1c2738] space-y-2">
            <div className="font-mono text-[11px] uppercase text-slate-400 font-bold">
              Guia Prático de Operação:
            </div>
            <p className="text-slate-300 leading-relaxed">
              Inicie com o sinal ajustado em gain staging (-18 dBFS RMS). Compare sempre o sinal com e sem o processador (A/B Test) no mesmo nível de volume para garantir que a melhoria é tímbrica e musical, e não apenas aumento de pressão sonora.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1c293c] pt-4 flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>Waves Audio Complete v15</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};

// Project Creation & Edit Modal
interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSave: (project: ProjectItem) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [client, setClient] = useState(project?.client || '');
  const [genre, setGenre] = useState(project?.genre || 'Afrobeat');
  const [bpm, setBpm] = useState(project?.bpm || 120);
  const [keyScale, setKeyScale] = useState(project?.keyScale || 'C Menor');
  const [targetLufs, setTargetLufs] = useState(project?.targetLufs || '-14 LUFS');
  const [status, setStatus] = useState<ProjectItem['status']>(project?.status || 'Gravando');
  const [notes, setNotes] = useState(project?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      id: project ? project.id : `proj_${Date.now()}`,
      title,
      client,
      genre,
      bpm: Number(bpm) || 120,
      keyScale,
      targetLufs,
      status,
      notes,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      pluginsUsed: project?.pluginsUsed || [],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#111622] border border-[#26354d] rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1f2c40] pb-3 mb-4">
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            {project ? 'Editar Projeto' : 'Novo Projeto de Estúdio'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          <div>
            <label className="block text-slate-400 uppercase font-bold mb-1">Título da Música / Projeto:</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex: Single de Verão - Afrobeat"
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Artista / Cliente:</label>
              <input
                type="text"
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="Nome do artista"
                className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Gênero:</label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="ex: Afrobeat, Trap, Pop"
                className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">BPM:</label>
              <input
                type="number"
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Tonalidade:</label>
              <input
                type="text"
                value={keyScale}
                onChange={e => setKeyScale(e.target.value)}
                placeholder="ex: C# Menor"
                className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Status:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-2 py-2 text-white outline-none focus:border-blue-500 text-[11px]"
              >
                <option value="Ideia">Ideia</option>
                <option value="Gravando">Gravando</option>
                <option value="Mixando">Mixando</option>
                <option value="Masterizando">Masterizando</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-bold mb-1">Alvo de LUFS Integrado:</label>
            <input
              type="text"
              value={targetLufs}
              onChange={e => setTargetLufs(e.target.value)}
              placeholder="-14 LUFS (Spotify)"
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-bold mb-1">Anotações da Sessão:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Instruções de mix, feedbacks do cliente..."
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20"
            >
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
