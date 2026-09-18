import React from 'react';
import { PluginItem } from '../types';
import { ALL_PLUGINS } from '../data/plugins';
import { Star } from 'lucide-react';

interface PluginCardProps {
  plugin: PluginItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect?: (plugin: PluginItem) => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const badgeMap: Record<string, string> = {
    Essencial: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-500/10',
    Profissional: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10',
    Especializado: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/10',
  };
  const levelBadgeClass = badgeMap[plugin.level] || 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <div
      onClick={() => onSelect?.(plugin)}
      className="group relative bg-gradient-to-br from-[#121722] to-[#0a0d14] border border-[#1e2838] hover:border-blue-500/60 rounded-xl p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex gap-3 items-start cursor-pointer"
    >
      <div className="relative shrink-0">
        <img
          src={plugin.img}
          alt={plugin.name}
          className="w-12 h-12 rounded-lg bg-black/50 border border-slate-700/50 p-1 object-contain"
        />
        {plugin.essential && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold" title="Plugin Essencial">
            ★
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 truncate tracking-wide">
          {plugin.name}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{plugin.func}</p>
        <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{plugin.use}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${levelBadgeClass}`}>
            {plugin.level}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
            {plugin.cat}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(plugin.id);
        }}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
          isFavorite
            ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:scale-110'
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
        }`}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
      </button>
    </div>
  );
};
