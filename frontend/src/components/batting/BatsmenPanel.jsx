import { Card } from '../ui/Surface';

function Row({ name, stats, onStrike, onMenu }) {
  if (!name) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-surface-soft px-4 py-3 dark:bg-surface-darkmuted">
        <span className="text-sm font-medium text-ink-faint">Select batsman…</span>
      </div>
    );
  }
  const b = stats?.[name];
  return (
    <button
      onClick={onMenu}
      className="flex w-full items-center justify-between rounded-xl bg-surface-soft px-4 py-3 text-left transition hover:bg-ink/[0.04] dark:bg-surface-darkmuted dark:hover:bg-white/[0.06]"
    >
      <div className="flex items-center gap-2 min-w-0">
        {onStrike && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="on strike" />}
        <span className="truncate font-semibold text-ink dark:text-ink-dark">{name}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3 font-tabular text-sm">
        <span className="font-bold text-ink dark:text-ink-dark">
          {b?.runs ?? 0}
          <span className="text-ink-faint">({b?.balls ?? 0})</span>
        </span>
        <span className="hidden text-ink-soft dark:text-ink-darksoft sm:inline">4s {b?.fours ?? 0}</span>
        <span className="hidden text-ink-soft dark:text-ink-darksoft sm:inline">6s {b?.sixes ?? 0}</span>
        <span className="text-ink-faint">SR {b?.balls ? ((b.runs / b.balls) * 100).toFixed(0) : '0'}</span>
      </div>
    </button>
  );
}

export default function BatsmenPanel({ computed, onOpenBatsmanMenu }) {
  if (!computed) return null;
  return (
    <Card className="space-y-2 p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-faint">Batting</p>
      <Row name={computed.striker} stats={computed.batsmen} onStrike onMenu={() => onOpenBatsmanMenu(computed.striker, 'striker')} />
      <Row name={computed.nonStriker} stats={computed.batsmen} onMenu={() => onOpenBatsmanMenu(computed.nonStriker, 'nonStriker')} />
    </Card>
  );
}