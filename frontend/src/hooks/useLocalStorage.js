import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (value === undefined || value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // storage full or unavailable — fail silently, app still works in-memory
    }
  }, [key, value]);

  const update = useCallback((updater) => {
    setValue((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return [value, update];
}