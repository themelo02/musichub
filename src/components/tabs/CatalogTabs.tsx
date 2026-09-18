import React, { useState, useMemo } from 'react';
import { PluginItem, PluginCategory, PluginLevel } from '../../types';
import { ALL_PLUGINS } from '../../data/plugins';
import { PluginCard } from '../PluginCard';
import {
  Search,
  Star,
  FolderOpen,
  Filter,
  Check,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Trash2,
  Scale,
  LayoutGrid,
  Table as TableIcon,
  Eye,
} from 'lucide-react';

// Main Catalog Tab (Grid + Master Table + Filters)
interface CatalogTabProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (plugin: PluginItem) => void;
  onCompare: (plugin: PluginItem) => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({
  favorites,
  onToggleFavorite,
  onOpenDetails,
  onCompare,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(ALL_PLUGINS.map(p => p.cat))).sort()];
  }, []);

  const filtered = useMemo(() => {
    return ALL_PLUGINS.filter(p => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase()) ||
        p.func.toLowerCase().includes(search.toLowerCase()) ||
        p.use.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCat === 'ALL' || p.cat === selectedCat;
      const matchLevel = levelFilter === 'ALL' || p.level === levelFilter;
      const matchFav = !onlyFavorites || favorites.has(p.id);

      return matchSearch && matchCat && matchLevel && matchFav;
    });
  }, [search, selectedCat, levelFilter, onlyFavorites, favorites]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
            Waves Audio Complete v15
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            Catálogo Oficial de Plugins ({ALL_PLUGINS.length} Processadores)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Navegue por toda a coleção com busca instantânea, filtragem por categoria e nível de prioridade (Essencial, Profissional, Especializado).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-[#0a0d14] border-[#212c3e] text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grade
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-[#0a0d14] border-[#212c3e] text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-4 h-4" /> Tabela
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, categoria, instrumento ou função..."
              className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="bg-[#0a0d14] border border-[#232f42] rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Todas as Categorias' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Level Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1c2738]">
          <div className="flex flex-wrap gap-2 items-center">
            {(['ALL', 'Essencial', 'Profissional', 'Especializado'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  levelFilter === lvl
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#0a0d14] border border-[#202b3c] text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'Todos os Níveis' : lvl}
              </button>
            ))}

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                onlyFavorites
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-[#0a0d14] border border-[#202b3c] text-amber-400 hover:text-amber-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-black' : 'fill-amber-400'}`} />
              Favoritos ({favorites.size})
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Exibindo <span className="text-amber-400 font-bold">{filtered.length}</span> plugins
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map(p => (
            <div key={p.id} className="relative group">
              <PluginCard
                plugin={p}
                isFavorite={favorites.has(p.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onOpenDetails}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCompare(p);
                  }}
                  title="Comparar plugin"
                  className="p-1 rounded-md bg-slate-800/90 text-blue-400 hover:text-white text-xs font-mono"
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[680px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#090d14] border-b border-blue-500/30 z-10 font-mono uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">★</th>
                  <th className="py-3 px-4">Plugin</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Função Técnica</th>
                  <th className="py-3 px-4">Melhor Uso</th>
                  <th className="py-3 px-4">Nível</th>
                  <th className="py-3 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182232] text-slate-300">
                {filtered.map(p => {
                  const isFav = favorites.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onOpenDetails(p)}
                      className="hover:bg-blue-500/5 transition-colors cursor-pointer"
                    >
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                      >
                        <Star
                          className={`w-4 h-4 mx-auto ${
                            isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-slate-300'
                          }`}
                        />
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-100 font-mono">{p.name}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {p.cat}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">{p.func}</td>
                      <td className="py-2.5 px-4 text-slate-400">{p.use}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
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
                      <td className="py-2.5 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onCompare(p)}
                          title="Comparar"
                          className="p-1 rounded text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Favorites Tab
export const FavoritesTab: React.FC<{
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDetails?: (plugin: PluginItem) => void;
}> = ({ favorites, onToggleFavorite, onOpenDetails }) => {
  const favPlugins = useMemo(() => {
    return ALL_PLUGINS.filter(p => favorites.has(p.id));
  }, [favorites]);

  if (favPlugins.length === 0) {
    return (
      <div className="bg-[#111622] border border-amber-500/30 rounded-2xl p-12 text-center max-w-lg mx-auto">
        <Star className="w-12 h-12 text-amber-400 mx-auto stroke-[1.5] mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">Nenhum plugin favorito ainda</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Navegue pelo Catálogo e clique na estrela (★) para adicionar plugins à sua biblioteca de favoritos para acesso instantâneo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#111622] border border-[#1e2a3c] p-4 rounded-xl">
        <div className="text-sm text-slate-300 font-mono">
          ⭐ Você possui <strong className="text-amber-400">{favPlugins.length}</strong> plugins favoritos salvos.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {favPlugins.map(p => (
          <PluginCard
            key={p.id}
            plugin={p}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onSelect={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};

// Compare Tab
export const CompareTab: React.FC<{
  pluginLeft: PluginItem | null;
  pluginRight: PluginItem | null;
  onSelectLeft: (p: PluginItem) => void;
  onSelectRight: (p: PluginItem) => void;
  onClear: () => void;
}> = ({ pluginLeft, pluginRight, onSelectLeft, onSelectRight, onClear }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border-l-4 border-blue-500 border-t border-r border-b border-[#1e2a3c] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
            Análise Comparativa
          </span>
          <h2 className="text-xl font-bold text-white font-mono mt-1">
            Comparador de Plugins A / B
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Selecione dois processadores para confrontar suas arquiteturas, níveis de controle dinâmico ou tonal e locais ideais no sinal.
          </p>
        </div>
        {(pluginLeft || pluginRight) && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Limpar Comparação
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#111622] border border-[#1e2a3c] p-4 rounded-2xl space-y-2">
          <label className="block text-xs font-mono uppercase text-blue-400 font-bold">
            Plugin Slot A:
          </label>
          <select
            value={pluginLeft?.id || ''}
            onChange={e => {
              const p = ALL_PLUGINS.find(x => x.id === e.target.value);
              if (p) onSelectLeft(p);
            }}
            className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
          >
            <option value="">— Selecione o Plugin A —</option>
            {ALL_PLUGINS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cat})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#111622] border border-[#1e2a3c] p-4 rounded-2xl space-y-2">
          <label className="block text-xs font-mono uppercase text-amber-400 font-bold">
            Plugin Slot B:
          </label>
          <select
            value={pluginRight?.id || ''}
            onChange={e => {
              const p = ALL_PLUGINS.find(x => x.id === e.target.value);
              if (p) onSelectRight(p);
            }}
            className="w-full bg-[#0a0d14] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
          >
            <option value="">— Selecione o Plugin B —</option>
            {ALL_PLUGINS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cat})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by side comparison cards */}
      {pluginLeft && pluginRight ? (
        <div className="bg-[#111622] border border-[#1e2a3c] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#090d14] border-b border-blue-500/30 text-slate-400 font-mono uppercase">
                <th className="py-3.5 px-4 w-1/4">Característica</th>
                <th className="py-3.5 px-4 w-3/8 font-bold text-blue-400 text-sm font-mono">
                  {pluginLeft.name}
                </th>
                <th className="py-3.5 px-4 w-3/8 font-bold text-amber-400 text-sm font-mono">
                  {pluginRight.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#192434] text-slate-300 font-mono">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-400">Categoria</td>
                <td className="py-3 px-4 text-white font-bold">{pluginLeft.cat}</td>
                <td className="py-3 px-4 text-white font-bold">{pluginRight.cat}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-400">Função Principal</td>
                <td className="py-3 px-4 font-sans text-slate-200">{pluginLeft.func}</td>
                <td className="py-3 px-4 font-sans text-slate-200">{pluginRight.func}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-400">Melhor Uso</td>
                <td className="py-3 px-4 font-sans text-slate-300">{pluginLeft.use}</td>
                <td className="py-3 px-4 font-sans text-slate-300">{pluginRight.use}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-400">Nível Técnico</td>
                <td className="py-3 px-4 text-amber-400 font-bold">{pluginLeft.level}</td>
                <td className="py-3 px-4 text-amber-400 font-bold">{pluginRight.level}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-400">Posição no Sinal</td>
                <td className="py-3 px-4 text-blue-400">{pluginLeft.position || 'Insert'}</td>
                <td className="py-3 px-4 text-blue-400">{pluginRight.position || 'Insert'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#111622] border border-blue-500/20 p-8 rounded-2xl text-center text-slate-400 text-xs font-mono">
          Selecione dois plugins nos menus acima para ativar a tabela comparativa A / B.
        </div>
      )}
    </div>
  );
};
