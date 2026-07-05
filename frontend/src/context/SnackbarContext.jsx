import { createContext, useCallback, useContext, useRef, useState } from 'react';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [items, setItems] = useState([]);
  const counter = useRef(0);

  const show = useCallback((message, opts = {}) => {
    const id = ++counter.current;
    const item = { id, message, tone: opts.tone || 'default', action: opts.action, duration: opts.duration ?? 3200 };
    setItems((prev) => [...prev, item]);
    if (item.duration) {
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), item.duration);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  return (
    <SnackbarContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="fixed bottom-20 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto animate-slide-up flex w-full max-w-sm items-center justify-between gap-3 rounded-xl2 px-4 py-3 shadow-lift text-sm font-medium
              ${item.tone === 'success' ? 'bg-success-500 text-white' : item.tone === 'error' ? 'bg-wicket-500 text-white' : 'bg-ink text-white dark:bg-surface-darkmuted'}`}
          >
            <span>{item.message}</span>
            {item.action && (
              <button
                onClick={() => {
                  item.action.onClick();
                  dismiss(item.id);
                }}
                className="shrink-0 rounded-lg px-2 py-1 font-semibold underline underline-offset-2 hover:opacity-80"
              >
                {item.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}