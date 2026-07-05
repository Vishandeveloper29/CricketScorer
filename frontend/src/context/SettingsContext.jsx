import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../data/constants';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark);
      root.classList.toggle('dark', dark);
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [settings.theme]);

  const value = useMemo(
    () => ({
      settings,
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setBallsPerOver: (n) => setSettings((s) => ({ ...s, ballsPerOver: n })),
      resetSettings: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings, setSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}