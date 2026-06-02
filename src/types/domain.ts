import { z } from 'zod';

export const THEMES = ['aqua', 'light'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const ACCENTS = ['#3fa6c8', '#3fb29a', '#5f8fd0', '#7f9fb0'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  everyMin: z.number().int().min(20).max(90),
  goal: z.number().int().min(4).max(12),
  theme: themeSchema,
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const dayStateSchema = z.object({
  day: z.string(),
  glasses: z.number().int().nonnegative(),
  stands: z.number().int().nonnegative(),
});
export type DayState = z.infer<typeof dayStateSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  app: dayStateSchema,
});
export type PersistedState = z.infer<typeof persistedStateSchema>;

export type Mode = 'home' | 'running' | 'nudge' | 'stand';
