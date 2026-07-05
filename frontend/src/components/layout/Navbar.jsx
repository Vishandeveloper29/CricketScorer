import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <header className="glass sticky top-0 z-40 hidden border-b border-ink/[0.06] dark:border-white/[0.06] sm:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold text-ink dark:text-ink-dark">Crease</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                location.pathname === l.to
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
                  : 'text-ink-soft hover:bg-ink/5 dark:text-ink-darksoft dark:hover:bg-white/10'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/create">
            <span className="ml-2 inline-flex h-10 items-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600">
              New Match
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}