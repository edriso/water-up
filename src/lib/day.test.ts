import { describe, expect, it } from 'vitest';
import { rollover } from './day';

describe('rollover', () => {
  const today = new Date(2026, 2, 10, 12, 0, 0);
  it('keeps the counts on the same day', () => {
    const state = { day: today.toDateString(), glasses: 3, stands: 2 };
    expect(rollover(state, today)).toEqual(state);
  });
  it('resets the counts on a new day', () => {
    const state = { day: new Date(2026, 2, 9).toDateString(), glasses: 5, stands: 4 };
    const next = rollover(state, today);
    expect(next.glasses).toBe(0);
    expect(next.stands).toBe(0);
    expect(next.day).toBe(today.toDateString());
  });
});
