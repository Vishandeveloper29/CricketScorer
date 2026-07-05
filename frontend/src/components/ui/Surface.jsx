export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl2 border border-ink/[0.06] bg-white shadow-softer dark:border-white/[0.06] dark:bg-surface-darksoft ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = 'neutral', className = '', children }) {
  const tones = {
    neutral: 'bg-surface-muted text-ink-soft dark:bg-surface-darkmuted dark:text-ink-darksoft',
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
    success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400',
    wicket: 'bg-wicket-50 text-wicket-600 dark:bg-wicket-500/15 dark:text-wicket-400',
    warn: 'bg-warn-50 text-warn-600 dark:bg-warn-500/15 dark:text-warn-400',
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