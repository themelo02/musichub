import React, { useState } from 'react';
import { Download, Wifi, WifiOff, CheckCircle2, X, Smartphone, Info } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface PWAInstallButtonProps {
  onNotify?: (msg: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onNotify }) => {
  const { isInstallable, isInstalled, isOnline, isIOS, install } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok && onNotify) {
        onNotify('Studio Hub instalado com sucesso! Acesso 100% offline ativo.', 'success');
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowOfflineModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Offline / Online Status Pill */}
        <button
          onClick={() => setShowOfflineModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono font-semibold transition-all ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-400 animate-pulse'
          }`}
          title={isOnline ? 'Pronto para uso 100% offline' : 'Modo Offline Ativo - todos os recursos funcionam sem internet'}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="hidden md:inline">100% Offline Ready</span>
              <span className="md:hidden">Offline</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Modo Offline</span>
            </>
          )}
        </button>

        {/* Install Button (visible if installable, or if iOS not installed, or compact in header) */}
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 shadow-md shadow-blue-600/20 text-xs font-mono font-bold transition-all"
            title="Instalar App no Computador ou Celular"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App</span>
            <span className="sm:hidden">Instalar</span>
          </button>
        )}
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e131d] border border-blue-500/40 rounded-2xl max-w-sm w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold font-mono text-white text-base">Instalar no iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              O Safari no iOS permite instalar o Studio Hub direto na tela de início para funcionar 100% sem internet:
            </p>

            <ol className="space-y-2.5 text-xs text-slate-300 font-mono list-decimal list-inside bg-[#141c2b] p-3.5 rounded-xl border border-blue-500/20">
              <li>Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima no Safari).</li>
              <li>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</li>
              <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Offline Info Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e131d] border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold font-mono text-white text-base">Arquitetura 100% Offline</h3>
              </div>
              <button
                onClick={() => setShowOfflineModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>
                O <strong>Studio Hub Melo Music</strong> opera de forma totalmente independente de conexões externas:
              </p>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <div className="p-3 bg-[#131b29] rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white">Service Worker & Cache PWA:</strong>
                    <div className="text-slate-400 text-[11px]">Todos os arquivos do aplicativo ficam salvos em cache permanente no seu navegador.</div>
                  </div>
                </div>

                <div className="p-3 bg-[#131b29] rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white">Sintetizador & Web Audio API:</strong>
                    <div className="text-slate-400 text-[11px]">A reprodução de escalas e acordes ocorre pelo processador da sua máquina sem chamadas de rede.</div>
                  </div>
                </div>

                <div className="p-3 bg-[#131b29] rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white">Gerador de MIDI Direto:</strong>
                    <div className="text-slate-400 text-[11px]">Arquivos .mid são gerados e baixados instantaneamente em memória local.</div>
                  </div>
                </div>

                <div className="p-3 bg-[#131b29] rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white">Dados e Armazenamento Local:</strong>
                    <div className="text-slate-400 text-[11px]">Projetos, favoritos, cadeias customizadas e notas ficam salvos no LocalStorage.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    setShowOfflineModal(false);
                    await install();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Instalar Aplicativo Agora
                </button>
              )}
              <button
                onClick={() => setShowOfflineModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
