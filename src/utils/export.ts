import { ChainStep, ChainMap, PluginItem } from '../types';

export function downloadFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildStudioOneGuide(chainName: string, steps: ChainStep[]): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Studio One Preset — ${chainName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f14; color: #f0f4f8; padding: 40px 20px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #ffd600; font-family: monospace; font-size: 2rem; border-bottom: 2px solid #2979ff; padding-bottom: 12px; margin-bottom: 8px; text-transform: uppercase; }
    .subtitle { color: #8892b0; font-size: 0.9rem; margin-bottom: 30px; }
    .plugin-card { background: #121824; border: 1px solid #1f2a3d; border-left: 4px solid #2979ff; border-radius: 8px; padding: 18px 24px; margin-bottom: 16px; }
    .plugin-card h3 { color: #ffffff; margin-top: 0; margin-bottom: 12px; font-size: 1.15rem; }
    .params-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    .param-pill { background: #0a0d14; border: 1px solid #2a384f; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.85rem; }
    .param-pill b { color: #2979ff; display: block; font-size: 0.72rem; text-transform: uppercase; }
    .footer { margin-top: 50px; font-size: 0.8rem; color: #5b6880; border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; }
    @media print { body { background: #fff; color: #000; } .plugin-card { border: 1px solid #ddd; border-left: 4px solid #000; background: #fafafa; } .param-pill { background: #fff; border: 1px solid #ccc; } }
  </style>
</head>
<body>
  <h1>Studio One Chain: ${chainName}</h1>
  <div class="subtitle">Guia de configuração paramétrica de inserção · Studio Hub Melo Music · ${new Date().toLocaleDateString('pt-BR')}</div>
  ${steps.map((step, idx) => `
    <div class="plugin-card">
      <h3>${idx + 1}. ${step.plugin}</h3>
      <div class="params-grid">
        ${Object.entries(step.params).map(([k, v]) => `
          <div class="param-pill">
            <b>${k}</b>
            ${v}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}
  <div class="footer">
    © Studio Hub Melo Music · Guia de Mixagem e Produção Profissional
  </div>
</body>
</html>`;
}

export function buildStudioOneScript(chainName: string, steps: ChainStep[]): string {
  let txt = `STUDIO ONE CHAIN — ${chainName.toUpperCase()}\n`;
  txt += `========================================================\n`;
  txt += `Total de Plugins: ${steps.length}\n`;
  txt += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

  steps.forEach((step, idx) => {
    txt += `[SLOT ${idx + 1}] ${step.plugin}\n`;
    Object.entries(step.params).forEach(([k, v]) => {
      txt += `   ├─ ${k.padEnd(20)}: ${v}\n`;
    });
    txt += `\n`;
  });

  return txt;
}

export function buildChainsCSV(chains: ChainMap): string {
  let csv = 'Chain,Step,Plugin,Parameter,Setting\n';
  Object.entries(chains).forEach(([chainName, steps]) => {
    steps.forEach((step, sIdx) => {
      Object.entries(step.params).forEach(([k, v]) => {
        csv += `"${chainName}",${sIdx + 1},"${step.plugin}","${k}","${v}"\n`;
      });
    });
  });
  return csv;
}

export function buildPluginsCSV(plugins: PluginItem[], favorites: Set<string>): string {
  let csv = 'ID,Name,Category,Function,Use,Level,Essential,Favorite\n';
  plugins.forEach(p => {
    csv += `"${p.id}","${p.name}","${p.cat}","${p.func}","${p.use}","${p.level}",${p.essential},${favorites.has(p.id)}\n`;
  });
  return csv;
}
