import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, DayState, Settings, Theme } from '@/types/domain';

interface WuState {
  settings: Settings;
  app: DayState;
  drink: () => void;
  recordStand: () => void;
  setEveryMin: (n: number) => void;
  setGoal: (n: number) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useWuStore = create<WuState>((set, get) => {
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }
  function commitApp(app: DayState): void {
    set({ app: repository.setApp(app).app });
  }
  return {
    settings: initial.settings,
    app: initial.app,
    drink: () => commitApp({ ...get().app, glasses: get().app.glasses + 1 }),
    recordStand: () => commitApp({ ...get().app, stands: get().app.stands + 1 }),
    setEveryMin: (everyMin) => patchSettings({ everyMin }),
    setGoal: (goal) => patchSettings({ goal }),
    setTheme: (theme) => patchSettings({ theme }),
    setAccent: (accent) => patchSettings({ accent }),
  };
});
