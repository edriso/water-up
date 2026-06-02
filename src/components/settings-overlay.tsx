import { useEffect, useRef, type ReactNode } from 'react';
import { useWuStore } from '@/store/wu-store';
import { ACCENTS } from '@/types/domain';

/** A small, focus-trapping settings dialog: interval, water goal, accent. */
export function SettingsOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const settings = useWuStore((state) => state.settings);
  const setEveryMin = useWuStore((state) => state.setEveryMin);
  const setGoal = useWuStore((state) => state.setGoal);
  const setAccent = useWuStore((state) => state.setAccent);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      ref={ref}
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(6,12,16,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 24,
          color: 'var(--ink)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 18 }}>Settings</span>
          <button
            onClick={onClose}
            className="corner"
            type="button"
            aria-label="Close"
            style={{ position: 'static' }}
          >
            ✕
          </button>
        </div>
        <Label>{`Nudge every · ${settings.everyMin}m`}</Label>
        <input
          type="range"
          min={20}
          max={90}
          step={5}
          value={settings.everyMin}
          onChange={(e) => setEveryMin(Number(e.target.value))}
          aria-label="Nudge every"
          style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 22 }}
        />
        <Label>{`Daily water goal · ${settings.goal} glasses`}</Label>
        <input
          type="range"
          min={4}
          max={12}
          step={1}
          value={settings.goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          aria-label="Daily water goal"
          style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 22 }}
        />
        <Label>Accent</Label>
        <div role="group" aria-label="Accent" style={{ display: 'flex', gap: 12 }}>
          {ACCENTS.map((color) => {
            const selected = settings.accent === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setAccent(color)}
                aria-pressed={selected}
                aria-label={color}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: color,
                  border: `2.5px solid ${selected ? 'var(--ink)' : 'transparent'}`,
                  boxShadow: '0 0 0 1px var(--line)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--ui)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
