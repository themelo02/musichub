export type PluginLevel = 'Essencial' | 'Profissional' | 'Especializado';

export type PluginCategory =
  | 'VOCALS'
  | 'EQ'
  | 'COMPRESSORS'
  | 'CHANNEL STRIPS'
  | 'SATURATION'
  | 'ANALOG'
  | 'DRUMS'
  | 'TRANSIENTS'
  | 'DRUM REPLACER'
  | 'BASS'
  | 'INSTRUMENTS'
  | 'GUITARS'
  | 'REVERBS'
  | 'DELAYS'
  | 'LIMITERS'
  | 'MASTERING'
  | 'MULTIBAND'
  | 'METERS'
  | 'STEREO'
  | 'MIX BUS'
  | 'RESTORATION'
  | 'VOICE'
  | 'AI'
  | 'SPECIAL FX';

export interface PluginItem {
  id: string;
  name: string;
  cat: PluginCategory;
  func: string;
  use: string;
  level: PluginLevel;
  essential: boolean;
  img?: string;
  type?: string;
  position?: 'INSERT' | 'SEND/AUX' | 'BUS' | 'MASTER';
}

export interface ChainStep {
  plugin: string;
  params: Record<string, string>;
}

export type ChainMap = Record<string, ChainStep[]>;

export interface ProjectItem {
  id: string;
  name?: string;
  title?: string;
  artist?: string;
  client?: string;
  genre: string;
  bpm: string | number;
  key?: string;
  keyScale?: string;
  notes: string;
  stages?: boolean[];
  status?: 'Ideia' | 'Gravando' | 'Mixando' | 'Masterizando' | 'Concluído';
  targetLufs?: string;
  pluginsUsed?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ReferenceTrack {
  track: string;
  artist: string;
  genre: string;
  year: string | number;
  lufs: string;
  why: string;
}

export interface TutorialVideo {
  cat: string;
  title: string;
  yt: string;
}

export interface QuizQuestion {
  q: string;
  a: string;
  wrong: string[];
}

export interface EarTrainingState {
  mode: 'frequency' | 'boost' | 'pan' | 'comp';
  score: number;
  streak: number;
  best: number;
  total: number;
  correct: number;
}
