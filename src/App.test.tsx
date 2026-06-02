import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useWuStore } from './store/wu-store';

function reset() {
  localStorage.clear();
  const d = createDefaultState();
  useWuStore.setState({ settings: d.settings, app: d.app });
}
beforeEach(() => {
  reset();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('Water + Up', () => {
  it('shows the glass and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByText('Water + Up')).toBeVisible();
  });

  it('nudges, drinks a glass, then runs the 30s stand and records a break', () => {
    useWuStore.setState((s) => ({ settings: { ...s.settings, everyMin: 20 } }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Start nudges' }));
    act(() => {
      vi.advanceTimersByTime(20 * 60 * 1000);
    });
    expect(screen.getByRole('heading', { name: 'Water break.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /I drank/ }));
    expect(useWuStore.getState().app.glasses).toBe(1);
    expect(screen.getByRole('heading', { name: 'On your feet.' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(30 * 1000);
    });
    expect(useWuStore.getState().app.stands).toBe(1);
  });
});
