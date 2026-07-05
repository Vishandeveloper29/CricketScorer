export function TextField({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">{label}</span>}
      <input
        className="h-12 w-full rounded-xl border border-ink/15 bg-surface-soft px-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-white/15 dark:bg-surface-darkmuted dark:text-ink-dark dark:focus:border-brand-400 dark:focus:bg-surface-darkmuted"
        {...props}
      />
    </label>
  );
}

export function SelectField({ label, className = '', children, ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">{label}</span>}
      <select
        className="h-12 w-full rounded-xl border border-ink/15 bg-surface-soft px-3.5 text-[15px] text-ink outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-white/15 dark:bg-surface-darkmuted dark:text-ink-dark dark:focus:border-brand-400"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Stepper({ label, value, onChange, min = 1, max = 999, step = 1 }) {
  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">{label}</span>}
      <div className="flex h-12 items-center justify-between rounded-xl border border-ink/15 bg-surface-soft px-2 dark:border-white/15 dark:bg-surface-darkmuted">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - step))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-ink hover:bg-ink/5 active:scale-90 dark:text-ink-dark dark:hover:bg-white/10"
        >
          −
        </button>
        <span className="font-tabular text-lg font-bold text-ink dark:text-ink-dark">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + step))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-ink hover:bg-ink/5 active:scale-90 dark:text-ink-dark dark:hover:bg-white/10"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex rounded-xl bg-surface-muted p-1 ring-1 ring-ink/10 dark:bg-surface-darkmuted dark:ring-white/10 ${className}`} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            value === opt.value
              ? 'bg-white text-ink shadow-softer dark:bg-surface-darksoft dark:text-ink-dark'
              : 'text-ink-soft hover:text-ink dark:text-ink-darksoft'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}