import { Card, Badge } from '../ui/Surface';

export default function MomentumTrend({ computed }) {
  if (!computed) return null;

  const overRuns = computed.overs.map((over) => ({
    label: `Ov ${over.overNumber + 1}`,
    runs: over.runs,
  }));

  if (computed.currentOver?.balls?.length) {
    overRuns.push({
      label: `Ov ${computed.currentOver.overNumber + 1}*`,
      runs: computed.currentOver.runs,
    });
  }

  const recent = overRuns.slice(-5);
  if (recent.length === 0) return null;

  const maxRuns = Math.max(1, ...recent.map((item) => item.runs));
  const first = recent[0].runs;
  const last = recent[recent.length - 1].runs;
  const trendDelta = last - first;
  const avg = (recent.reduce((sum, item) => sum + item.runs, 0) / recent.length).toFixed(1);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Momentum (last 5 overs)</p>
        <Badge tone={trendDelta >= 0 ? 'success' : 'warn'}>{trendDelta >= 0 ? `+${trendDelta}` : trendDelta} trend</Badge>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {recent.map((item) => {
          const heightPct = Math.max(12, Math.round((item.runs / maxRuns) * 100));
          return (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-24 w-full items-end rounded-lg bg-surface-soft px-1.5 pb-1.5 dark:bg-surface-darkmuted">
                <div
                  className="w-full rounded-md bg-brand-500/90 text-center text-[11px] font-bold text-white"
                  style={{ height: `${heightPct}%` }}
                  title={`${item.runs} runs`}
                >
                  {item.runs}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-ink-faint">{item.label.replace('Ov ', '')}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-ink-soft dark:text-ink-darksoft">
        Recent over average: <span className="font-tabular font-bold text-ink dark:text-ink-dark">{avg}</span> runs/over
      </p>
    </Card>
  );
}
