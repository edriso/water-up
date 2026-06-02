import type { DayState } from '@/types/domain';

/** The local calendar day as a stable string key. */
export function dayKey(date: Date = new Date()): string {
  return date.toDateString();
}

/** Reset the glasses and stand counts when the calendar day changes. Pure. */
export function rollover(state: DayState, now: Date = new Date()): DayState {
  const key = dayKey(now);
  if (state.day === key) {
    return state;
  }
  return { day: key, glasses: 0, stands: 0 };
}
