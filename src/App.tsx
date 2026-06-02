import { useEffect, useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { useInterval } from '@/hooks/use-interval';
import { useWuStore } from '@/store/wu-store';
import type { Mode } from '@/types/domain';

export function App() {
  useApplyTheme();
  const { everyMin, goal, theme } = useWuStore((state) => state.settings);
  const app = useWuStore((state) => state.app);
  const drink = useWuStore((state) => state.drink);
  const recordStand = useWuStore((state) => state.recordStand);
  const setTheme = useWuStore((state) => state.setTheme);

  const [mode, setMode] = useState<Mode>('home');
  const [next, setNext] = useState(everyMin * 60);
  const [standLeft, setStandLeft] = useState(30);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function startNudges() {
    setNext(everyMin * 60);
    setMode('running');
  }

  // Nudge interval (pure decrement; the transition runs in an effect).
  useInterval(() => setNext((s) => Math.max(0, s - 1)), mode === 'running' ? 1000 : null);
  useEffect(() => {
    if (mode === 'running' && next <= 0) {
      setMode('nudge');
    }
  }, [mode, next]);

  // The 30-second stand countdown.
  useInterval(() => setStandLeft((s) => Math.max(0, s - 1)), mode === 'stand' ? 1000 : null);
  useEffect(() => {
    if (mode === 'stand' && standLeft <= 0) {
      doneStand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, standLeft]);

  function doneStand() {
    recordStand();
    setNext(everyMin * 60);
    setMode('running');
  }

  const pct = Math.min(100, Math.round((app.glasses / goal) * 100));
  const mm = Math.floor(next / 60);
  const ss = next % 60;

  return (
    <div className="app">
      <button
        className="corner corner-l"
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Settings"
      >
        ⚙
      </button>
      <button
        className="corner"
        type="button"
        onClick={() => setTheme(theme === 'aqua' ? 'light' : 'aqua')}
        aria-label="Theme"
      >
        {theme === 'aqua' ? '☀' : '☾'}
      </button>

      <div className="stage">
        <div className="word">Water + Up</div>

        {(mode === 'home' || mode === 'running') && (
          <div className="rise">
            <div className="glass" aria-hidden="true">
              <div className="fill" style={{ height: `${pct}%` }} />
              <div className="pct">
                {app.glasses}/{goal}
              </div>
            </div>
            <div className="stats">
              <div className="st">
                <b>{app.glasses}</b>
                <span>glasses</span>
              </div>
              <div className="st">
                <b>{app.stands}</b>
                <span>stand breaks</span>
              </div>
            </div>
            {mode === 'running' ? (
              <>
                <div className="timer" aria-live="polite">
                  next nudge in {mm > 0 ? `${mm}m ` : ''}
                  {String(ss).padStart(2, '0')}s
                </div>
                <button className="cta ghost" type="button" onClick={() => setMode('home')}>
                  Pause nudges
                </button>
              </>
            ) : (
              <>
                <p className="sub">
                  One nudge, two wins: a glass of water and 30 seconds on your feet. Every{' '}
                  {everyMin} minutes.
                </p>
                <button className="cta" type="button" onClick={startNudges}>
                  Start nudges
                </button>
              </>
            )}
          </div>
        )}

        {mode === 'nudge' && (
          <div className="rise">
            <div className="big-cue" aria-hidden="true">
              💧
            </div>
            <h1 className="h1">Water break.</h1>
            <p className="sub">
              Take a real drink of water, then we&rsquo;ll get you on your feet for thirty seconds.
            </p>
            <button
              className="cta"
              type="button"
              onClick={() => {
                drink();
                setStandLeft(30);
                setMode('stand');
              }}
            >
              I drank — now stand me up
            </button>
          </div>
        )}

        {mode === 'stand' && (
          <div className="rise">
            <div className="big-cue" aria-hidden="true">
              🧍
            </div>
            <h1 className="h1">On your feet.</h1>
            <p className="sub">
              Stand up. Stretch tall, roll your shoulders, look away from the screen.
            </p>
            <div className="timer" style={{ fontSize: 40 }} aria-live="polite">
              {standLeft}s
            </div>
            <button className="cta ghost" type="button" onClick={doneStand}>
              Done early
            </button>
          </div>
        )}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
