import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warn' | 'error' | 'info';
  title?: string;
  message?: string;
  msg?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        const borderColors = {
          success: 'border-l-blue-500',
          warn: 'border-l-amber-400',
          error: 'border-l-rose-500',
          info: 'border-l-cyan-400',
        }[t.type];

        return (
          <div
            key={t.id}
            onClick={() => onDismiss(t.id)}
            className={`pointer-events-auto bg-[#131924] border border-[#232f42] ${borderColors} border-l-4 rounded-xl p-4 shadow-2xl text-slate-100 text-sm cursor-pointer transition-all hover:scale-[1.02]`}
          >
            {t.title && <div className="font-bold text-sm tracking-wide mb-1 text-amber-300">{t.title}</div>}
            <div>{t.message || t.msg}</div>
          </div>
        );
      })}
    </div>
  );
};
