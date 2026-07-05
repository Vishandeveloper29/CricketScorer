const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-soft focus-visible:shadow-glow',
  success: 'bg-success-500 text-white hover:bg-success-600 shadow-soft',
  wicket: 'bg-wicket-500 text-white hover:bg-wicket-600 shadow-soft',
  warn: 'bg-warn-500 text-white hover:bg-warn-600 shadow-soft',
  secondary: 'bg-surface-muted text-ink hover:bg-ink/12 dark:bg-surface-darkmuted dark:text-ink-dark dark:hover:bg-white/12',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 dark:text-ink-dark dark:hover:bg-white/10',
  outline: 'bg-transparent border border-ink/20 text-ink hover:bg-ink/5 dark:border-white/20 dark:text-ink-dark dark:hover:bg-white/10',
};

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-xl',
  lg: 'h-14 px-5 text-base rounded-xl2',
  icon: 'h-11 w-11 rounded-xl',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Comp
      className={`inline-flex select-none items-center justify-center gap-1.5 font-semibold transition-all duration-150 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}