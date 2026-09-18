import React, { useState, useEffect } from 'react';
import { ALL_PLUGINS } from './data/plugins';
import { DEFAULT_CHAINS } from './data/chains';
import { AFRICAN_GENRES } from './data/genres';
import { PluginItem, ProjectItem } from './types';
import {
  loadFavorites,
  saveFavorites,
  loadStudiedPlugins,
  saveStudiedPlugins,
  loadProjects,
  saveProjects,
  loadChecklists,
  saveChecklists,
  loadCustomChain,
  saveCustomChain,
} from './utils/storage';
import { ToastContainer } from './components/Toast';
import { PluginModal, ProjectModal } from './components/Modal';

// Tabs
import { DashboardTab } from './components/tabs/DashboardTab';
import { CatalogTab, FavoritesTab, CompareTab } from './components/tabs/CatalogTabs';
import {
  ChainsTab,
  CustomChainTab,
  VocalWizardTab,
  ChainValidatorTab,
} from './components/tabs/ChainsTabs';
import {
  VocalTab,
  MixingTab,
  MixBusTab,
  MasteringTab,
  GenresTab,
  ProjectsTab,
  ChecklistsTab,
} from './components/tabs/ProductionTabs';
import {
  BpmCalcTab,
  GainStagingTab,
  Note2HzTab,
  TimerTab,
  LufsTab,
  SpectrumTab,
} from './components/tabs/AudioToolsTabs';
import {
  LearningCenterTab,
  EarTrainingTab,
  QuizTab,
  TutorialsTab,
  ReferencesTab,
  TopPluginsTab,
  DecisionTab,
} from './components/tabs/AcademyTabs';
import { AudioAnalyzerTab } from './components/tabs/AudioAnalyzerTab';
import { MusicGeneratorTab } from './components/tabs/MusicGeneratorTab';
import {
  CategoriesTab,
  MasterTableTab,
  ExportStudioOneTab,
  WhichPluginTab,
  OrganizationTab,
  FLStudioTab,
  DataExportTab,
  NotesTab,
  RulesTab,
  WorkflowTab,
} from './components/tabs/StudioExtraTabs';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';

import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Wand2,
  Globe,
  Clock,
  Volume2,
  CheckSquare,
  FolderKanban,
  GraduationCap,
  Headphones,
  Sliders,
  Radio,
  Tv,
  HelpCircle,
  BarChart2,
  Folder,
  Compass,
  FileSpreadsheet,
  Activity,
  Heart,
  Scale,
  Menu,
  X,
  Search,
  Zap,
  Download,
  Mic,
  Music,
  FileText,
} from 'lucide-react';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Storage states
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [checklists, setChecklists] = useState<Record<string, boolean[]>>({});
  const [customChain, setCustomChain] = useState<string[]>([]);

  // Studio One Selected Chains
  const [selectedChains, setSelectedChains] = useState<Set<string>>(
    new Set(['Vocal Masculino', 'Master Bus Moderno'])
  );

  // Compare Tab State
  const [compareLeft, setCompareLeft] = useState<PluginItem | null>(null);
  const [compareRight, setCompareRight] = useState<PluginItem | null>(null);

  // Modals & Feedback
  const [selectedPlugin, setSelectedPlugin] = useState<PluginItem | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [toasts, setToasts] = useState<
    { id: string; msg: string; type: 'success' | 'warn' | 'error' | 'info' }[]
  >([]);

  // Search in Header
  const [headerSearch, setHeaderSearch] = useState('');

  // Initial Load from localStorage
  useEffect(() => {
    setFavorites(loadFavorites());
    setStudiedIds(loadStudiedPlugins());
    setProjects(loadProjects());
    setChecklists(loadChecklists());
    setCustomChain(loadCustomChain());
  }, []);

  const notify = (
    msg: string,
    type: 'success' | 'warn' | 'error' | 'info' = 'info'
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, msg, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Favorites handler
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        notify('Plugin removido dos favoritos.', 'info');
      } else {
        next.add(id);
        notify('Plugin adicionado aos favoritos!', 'success');
      }
      saveFavorites(next);
      return next;
    });
  };

  // Studied handler
  const handleMarkStudied = (id: string) => {
    setStudiedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        notify('Marcador de estudo removido.', 'info');
      } else {
        next.add(id);
        notify('Estudo concluído! +10 XP creditados.', 'success');
      }
      saveStudiedPlugins(next);
      return next;
    });
  };

  // Compare Handler
  const handleSelectCompare = (p: PluginItem) => {
    if (!compareLeft) {
      setCompareLeft(p);
      notify(`Slot 1 selecionado: ${p.name}`, 'info');
    } else {
      setCompareRight(p);
      notify(`Slot 2 selecionado: ${p.name}`, 'info');
    }
    setActiveTab('compare');
  };

  // Studio One Chains selection
  const handleToggleChain = (name: string) => {
    setSelectedChains(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleSelectAllChains = () => {
    setSelectedChains(new Set(Object.keys(DEFAULT_CHAINS)));
    notify('Todas as cadeias foram selecionadas.', 'info');
  };

  const handleClearAllChains = () => {
    setSelectedChains(new Set());
    notify('Seleção de cadeias limpa.', 'info');
  };

  // Custom Chain builder
  const handleAddCustomPlugin = (id: string) => {
    if (customChain.length >= 16) {
      notify('Limite de 16 slots por cadeia atingido.', 'warn');
      return;
    }
    const next = [...customChain, id];
    setCustomChain(next);
    saveCustomChain(next);
    notify('Plugin adicionado à cadeia customizada.', 'success');
  };

  const handleRemoveCustomPlugin = (index: number) => {
    const next = customChain.filter((_, i) => i !== index);
    setCustomChain(next);
    saveCustomChain(next);
  };

  const handleClearCustomChain = () => {
    setCustomChain([]);
    saveCustomChain([]);
    notify('Cadeia customizada limpa.', 'info');
  };

  // Projects
  const handleSaveProject = (proj: ProjectItem) => {
    const idx = projects.findIndex(p => p.id === proj.id);
    let next: ProjectItem[];
    if (idx >= 0) {
      next = [...projects];
      next[idx] = proj;
      notify('Projeto atualizado com sucesso!', 'success');
    } else {
      next = [proj, ...projects];
      notify('Novo projeto criado!', 'success');
    }
    setProjects(next);
    saveProjects(next);
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    saveProjects(next);
    notify('Projeto excluído.', 'info');
  };

  // Checklists
  const handleToggleChecklist = (groupKey: string, index: number) => {
    setChecklists(prev => {
      const cur = prev[groupKey] ? [...prev[groupKey]] : [];
      cur[index] = !cur[index];
      const next = { ...prev, [groupKey]: cur };
      saveChecklists(next);
      return next;
    });
  };

  const handleResetChecklist = (groupKey: string, size: number) => {
    setChecklists(prev => {
      const next = { ...prev, [groupKey]: new Array(size).fill(false) };
      saveChecklists(next);
      return next;
    });
    notify('Checklist resetada.', 'info');
  };

  // Menu 1: Gerador Musical (destaque exclusivo solicitado)
  const GERADOR_MUSICAL_NAV = [
    { id: 'scales-gen', label: '🎹 Gerador de Escalas' },
    { id: 'chord-gen', label: '🎵 Gerador de Acordes' },
    { id: 'progressions', label: '🔄 Progressões' },
    { id: 'angolan-styles', label: '🇦🇴 Estilos Angolanos' },
    { id: 'listen-player', label: '🎧 Ouvir' },
    { id: 'midi-export', label: '🎹 Exportar MIDI' },
  ];

  // Menu 2: Menu Principal (os 33 botões exatos do Studio Hub)
  const MENU_PRINCIPAL_NAV = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'categories', label: '📂 Categorias' },
    { id: 'master-table', label: '📋 Tabela Master' },
    { id: 'favorites', label: `⭐ Favoritos (${favorites.size})` },
    { id: 'vocal', label: '🎤 Produção Vocal' },
    { id: 'mixing', label: '🎛️ Mixagem' },
    { id: 'mixbus', label: '🎚️ Mix Bus' },
    { id: 'mastering', label: '🔊 Mastering' },
    { id: 'chains', label: '⚡ Cadeias Prontas' },
    { id: 'export-s1', label: '🎚️ Exportar Studio One' },
    { id: 'custom-chain', label: '🎨 Custom Chain' },
    { id: 'vocal-wizard', label: '🧙 Vocal Wizard' },
    { id: 'compare', label: '📊 Comparador' },
    { id: 'bpm', label: '🎼 Calculadora BPM' },
    { id: 'gain', label: '🎚️ Gain Staging' },
    { id: 'note2hz', label: '🎵 Nota → Hz' },
    { id: 'timer', label: '⏱️ Timer' },
    { id: 'lufs', label: '📻 LUFS Streaming' },
    { id: 'spectrum', label: '📈 Espectro' },
    { id: 'decision', label: '🧠 Sistema Decisão' },
    { id: 'which-plugin', label: '🔍 Qual Plugin' },
    { id: 'top-plugins', label: '🏆 Top Plugins' },
    { id: 'organization', label: '📁 Organização' },
    { id: 'ear-training', label: '🎧 Ear Training' },
    { id: 'quiz', label: '🎯 Quiz de Plugins' },
    { id: 'tutorials', label: '📺 Tutoriais' },
    { id: 'references', label: '📀 Referências' },
    { id: 'academy', label: '📚 Guia de Aprendizagem' },
    { id: 'fl-studio', label: '🎛️ FL Studio' },
    { id: 'data-export', label: '📦 JSON/CSV' },
    { id: 'notes', label: '📝 Notas' },
    { id: 'rules', label: '📏 Regras' },
    { id: 'workflow', label: '🔄 Workflow' },
  ];

  return (
    <div className="h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* 1. Header Bar */}
      <header className="flex-shrink-0 z-40 bg-[#0c1017]/95 backdrop-blur border-b border-[#1c2738] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#131a26] border border-[#222e42] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lime-400 to-blue-600 flex items-center justify-center font-mono font-black text-black shadow-lg shadow-lime-400/20 text-sm">
              SH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold font-mono text-white tracking-tight">
                  Studio Hub Melo Music
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-lime-400/20 border border-lime-400/40 text-[10px] font-mono text-lime-400 font-bold">
                  v5.2 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                O Guia Definitivo dos 248 Plugins Waves & Gerador Musical MIDI
              </p>
            </div>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PWAInstallButton onNotify={notify} />

          <button
            onClick={() => {
              setActiveTab('chord-gen');
              notify('Abrindo Gerador de Acordes...', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400/15 border border-lime-400/40 text-xs font-mono font-bold text-lime-300 hover:bg-lime-400/25 transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-lime-400" />
            <span>Gerador Musical</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('timer');
              notify('Abrindo Timer Anti-Fadiga Auditiva...', 'info');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131b28] border border-[#232f42] text-xs font-mono text-amber-400 hover:border-amber-400/50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pausa Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analyzer');
              notify('Carregue seu arquivo no Audio Analyzer.', 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analisar Áudio</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar com barra de rolagem colorida */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-72 flex-shrink-0 h-full max-h-full bg-[#0a0d14] border-r border-[#1a2434] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between overflow-y-scroll sidebar-colorful-scrollbar`}
        >
          <div className="p-3.5 space-y-6">
            {/* Bloco 1: 🎼 GERADOR MUSICAL (Menu exclusivo e visível) */}
            <div className="space-y-2 bg-[#0c131a] p-2.5 rounded-2xl border border-lime-400/30 shadow-lg shadow-lime-400/5">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[11px] font-mono uppercase font-black text-lime-400 tracking-wider flex items-center gap-1.5">
                  <span>🎼</span> GERADOR MUSICAL
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-lime-400 text-black font-black uppercase tracking-wider">
                  NOVO
                </span>
              </div>
              <div className="space-y-1">
                {GERADOR_MUSICAL_NAV.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                        isActive
                          ? 'bg-lime-400 text-black font-black shadow-md shadow-lime-400/20'
                          : 'text-slate-200 hover:text-white hover:bg-lime-400/10'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {isActive && <span className="text-[10px]">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bloco 2: 🎛️ MENU PRINCIPAL (33 Botões com nomes e emojis exatos) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2.5 py-1">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span>🎛️</span> MENU PRINCIPAL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#141b28] text-slate-400 border border-[#202b3c]">
                  {MENU_PRINCIPAL_NAV.length}
                </span>
              </div>

              <div className="space-y-0.5">
                {MENU_PRINCIPAL_NAV.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                          : 'text-slate-400 hover:text-white hover:bg-[#121824]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-[#1a2434] bg-[#080a10] text-[10px] font-mono text-slate-500 space-y-1">
            <div className="text-slate-400 font-bold">Studio Hub Melo Music</div>
            <div>Engenharia · Waves Complete v15</div>
            <div className="text-lime-400 font-bold">Gerador Musical & MIDI 4 Acordes</div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* 3. Main Content Stage */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Gerador Musical - Subtabs */}
          {['scales-gen', 'chord-gen', 'progressions', 'angolan-styles', 'listen-player', 'midi-export'].includes(activeTab) && (
            <MusicGeneratorTab
              initialSubTab={activeTab as any}
              onNotify={notify}
            />
          )}

          {/* Menu Principal */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              onNavigate={setActiveTab}
              favoritesCount={favorites.size}
              studiedCount={studiedIds.size}
              projectsCount={projects.length}
            />
          )}

          {(activeTab === 'categories' || activeTab === 'catalog') && (
            <CategoriesTab
              onSelectPlugin={p => setSelectedPlugin(p)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'master-table' && (
            <MasterTableTab
              onSelectPlugin={p => setSelectedPlugin(p)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesTab
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetails={p => setSelectedPlugin(p)}
            />
          )}

          {activeTab === 'vocal' && <VocalTab />}

          {activeTab === 'mixing' && <MixingTab />}

          {activeTab === 'mixbus' && <MixBusTab />}

          {activeTab === 'mastering' && <MasteringTab />}

          {activeTab === 'chains' && (
            <ChainsTab
              selectedChains={selectedChains}
              onToggleChain={handleToggleChain}
              onSelectAll={handleSelectAllChains}
              onClearAll={handleClearAllChains}
              onNotify={notify}
            />
          )}

          {activeTab === 'export-s1' && <ExportStudioOneTab onNotify={notify} />}

          {activeTab === 'custom-chain' && (
            <CustomChainTab
              customChain={customChain}
              onAddPlugin={handleAddCustomPlugin}
              onRemovePlugin={handleRemoveCustomPlugin}
              onClearChain={handleClearCustomChain}
              onNotify={notify}
            />
          )}

          {activeTab === 'vocal-wizard' && <VocalWizardTab onNotify={notify} />}

          {activeTab === 'compare' && (
            <CompareTab
              pluginLeft={compareLeft}
              pluginRight={compareRight}
              onSelectLeft={p => setCompareLeft(p)}
              onSelectRight={p => setCompareRight(p)}
              onClear={() => {
                setCompareLeft(null);
                setCompareRight(null);
              }}
            />
          )}

          {activeTab === 'bpm' && <BpmCalcTab />}

          {activeTab === 'gain' && <GainStagingTab />}

          {activeTab === 'note2hz' && <Note2HzTab />}

          {activeTab === 'timer' && <TimerTab onNotify={notify} />}

          {activeTab === 'lufs' && <LufsTab />}

          {activeTab === 'spectrum' && <SpectrumTab />}

          {activeTab === 'decision' && <DecisionTab />}

          {activeTab === 'which-plugin' && (
            <WhichPluginTab onSelectPlugin={p => setSelectedPlugin(p)} />
          )}

          {activeTab === 'top-plugins' && (
            <TopPluginsTab
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'organization' && <OrganizationTab />}

          {activeTab === 'ear-training' && <EarTrainingTab />}

          {activeTab === 'quiz' && <QuizTab />}

          {activeTab === 'tutorials' && <TutorialsTab />}

          {activeTab === 'references' && <ReferencesTab />}

          {activeTab === 'academy' && (
            <LearningCenterTab
              studiedIds={studiedIds}
              onMarkStudied={handleMarkStudied}
            />
          )}

          {activeTab === 'fl-studio' && <FLStudioTab />}

          {activeTab === 'data-export' && (
            <DataExportTab favorites={favorites} onNotify={notify} />
          )}

          {activeTab === 'notes' && <NotesTab onNotify={notify} />}

          {activeTab === 'rules' && <RulesTab />}

          {activeTab === 'workflow' && <WorkflowTab />}

          {/* Fallbacks para rotas existentes */}
          {activeTab === 'validator' && <ChainValidatorTab />}
          {activeTab === 'genres' && <GenresTab onNotify={notify} />}
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onOpenCreate={() => {
                setEditingProject(null);
                setProjectModalOpen(true);
              }}
              onEditProject={p => {
                setEditingProject(p);
                setProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
            />
          )}
          {activeTab === 'checklists' && (
            <ChecklistsTab
              checklists={checklists}
              onToggleItem={handleToggleChecklist}
              onResetChecklist={handleResetChecklist}
            />
          )}
          {activeTab === 'analyzer' && <AudioAnalyzerTab onNotify={notify} />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      {selectedPlugin && (
        <PluginModal
          plugin={selectedPlugin}
          isFavorite={favorites.has(selectedPlugin.id)}
          onClose={() => setSelectedPlugin(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {projectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => setProjectModalOpen(false)}
          onSave={handleSaveProject}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
