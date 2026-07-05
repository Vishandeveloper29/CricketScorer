import { Link, useLocation } from 'react-router-dom';

const ICONS = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 4v5h5M12 8v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  add: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1L15 3h-4l-.4 2.5a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1L9 21h4l.4-2.5a8 8 0 0 0 1.7-1l2.3.9 2-3.4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/create', label: 'New', icon: 'add', primary: true },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-ink/[0.06] pb-safe pt-1.5 dark:border-white/[0.06] sm:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2">
        {LINKS.map((l) => {
          const active = location.pathname === l.to;
          if (l.primary) {
            return (
              <Link key={l.to} to={l.to} className="-mt-6 flex flex-col items-center gap-1">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-glow transition active:scale-90">
                  {ICONS[l.icon]}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 transition-colors ${
                active ? 'text-brand-600 dark:text-brand-400' : 'text-ink-faint dark:text-ink-darksoft'
              }`}
            >
              {ICONS[l.icon]}
              <span className="text-[11px] font-semibold">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}