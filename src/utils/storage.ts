import { ProjectItem } from '../types';

export function storeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem('shmm_' + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function storeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem('shmm_' + key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

export function loadFavorites(): Set<string> {
  const arr = storeGet<string[]>('favorites', []);
  return new Set(arr);
}

export function saveFavorites(favs: Set<string>): void {
  storeSet('favorites', Array.from(favs));
}

export function loadStudiedPlugins(): Set<string> {
  const arr = storeGet<string[]>('studied', []);
  return new Set(arr);
}

export function saveStudiedPlugins(studied: Set<string>): void {
  storeSet('studied', Array.from(studied));
}

export function loadProjects(): ProjectItem[] {
  return storeGet<ProjectItem[]>('projects', []);
}

export function saveProjects(projects: ProjectItem[]): void {
  storeSet('projects', projects);
}

export function loadChecklists(): Record<string, boolean[]> {
  return storeGet<Record<string, boolean[]>>('checklists', {});
}

export function saveChecklists(checklists: Record<string, boolean[]>): void {
  storeSet('checklists', checklists);
}

export function loadCustomChain(): string[] {
  return storeGet<string[]>('custom_chain', []);
}

export function saveCustomChain(chain: string[]): void {
  storeSet('custom_chain', chain);
}
