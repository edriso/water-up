import {
  type DayState,
  type PersistedState,
  persistedStateSchema,
  type Settings,
} from '@/types/domain';
import { rollover } from './day';

const STORAGE_KEY = 'wu-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { everyMin: 45, goal: 8, theme: 'aqua', accent: '#3fa6c8' },
    app: { day: new Date().toDateString(), glasses: 0, stands: 0 },
  };
}

export interface Repository {
  getState(now?: Date): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setApp(app: DayState): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }
  function getState(now: Date = new Date()): PersistedState {
    const state = read();
    return { ...state, app: rollover(state.app, now) };
  }
  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }
  function setApp(app: DayState): PersistedState {
    const next = { ...read(), app };
    saveState(next);
    return next;
  }
  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { getState, saveState, setSettings, setApp, clear };
}

export const repository: Repository = createLocalStorageRepository();
