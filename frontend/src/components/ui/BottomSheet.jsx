import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function BottomSheet({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-pop-in" onClick={() => onClose?.()} />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[88vh] overflow-y-auto rounded-t-xl3 bg-white p-5 pb-safe shadow-lift animate-sheet-up dark:bg-surface-darksoft sm:rounded-xl3 sm:animate-pop-in sm:mb-0 sm:max-h-[80vh]`}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink/10 dark:bg-white/10 sm:hidden" />
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 dark:text-ink-darksoft dark:hover:bg-white/10"
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}