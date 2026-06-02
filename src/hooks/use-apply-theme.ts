import { useEffect } from 'react';
import { useWuStore } from '@/store/wu-store';

export function useApplyTheme(): void {
  const theme = useWuStore((state) => state.settings.theme);
  const accent = useWuStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}
