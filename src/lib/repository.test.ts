import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

const NOW = new Date(2026, 2, 10, 12, 0, 0);

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });
  it('returns defaults / tolerates corrupt data', () => {
    expect(repo.getState(NOW).settings.goal).toBe(8);
    storage.setItem('wu-v1', 'nope');
    expect(repo.getState(NOW).app.glasses).toBe(0);
  });
  it('applies the daily rollover on read', () => {
    repo.setApp({ day: new Date(2026, 2, 9).toDateString(), glasses: 6, stands: 3 });
    expect(repo.getState(NOW).app.glasses).toBe(0);
  });
  it('round-trips counts and settings', () => {
    repo.setApp({ day: NOW.toDateString(), glasses: 2, stands: 1 });
    repo.setSettings({ goal: 10 });
    expect(repo.getState(NOW).app.glasses).toBe(2);
    expect(repo.getState(NOW).settings.goal).toBe(10);
  });
});
