export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl2 border border-ink/[0.1] bg-white shadow-softer dark:border-white/[0.08] dark:bg-surface-darksoft ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = 'neutral', className = '', children }) {
  const tones = {
    neutral: 'bg-surface-muted text-ink dark:bg-surface-darkmuted dark:text-ink-dark',
    brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 dark:bg-brand-500/20 dark:text-brand-100 dark:ring-brand-500/35',
    success: 'bg-success-50 text-success-600 ring-1 ring-success-400/20 dark:bg-success-500/18 dark:text-success-50 dark:ring-success-500/35',
    wicket: 'bg-wicket-50 text-wicket-600 ring-1 ring-wicket-400/20 dark:bg-wicket-500/18 dark:text-wicket-50 dark:ring-wicket-500/35',
    warn: 'bg-warn-50 text-warn-600 ring-1 ring-warn-400/20 dark:bg-warn-500/18 dark:text-warn-50 dark:ring-warn-500/35',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink/10 px-6 py-12 text-center dark:border-white/10">
      {icon && <div className="text-ink-faint dark:text-ink-darksoft">{icon}</div>}
      <div>
        <p className="font-display font-semibold text-ink dark:text-ink-dark">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-ink-soft dark:text-ink-darksoft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function SectionTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-500">{eyebrow}</p>}
        <h2 className="font-display text-xl font-bold text-ink dark:text-ink-dark sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-soft dark:text-ink-darksoft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}