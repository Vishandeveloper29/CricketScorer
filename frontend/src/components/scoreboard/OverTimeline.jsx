import { Card } from '../ui/Surface';

function ballLabel(ball) {
  if (ball.wicket) return 'W';
  if (ball.extra === 'wide') return `wd${ball.extraRuns ? '+' + ball.extraRuns : ''}`;
  if (ball.extra === 'no_ball') return `nb${ball.runs ? '+' + ball.runs : ''}`;
  if (ball.extra === 'bye') return `${ball.runs}b`;
  if (ball.extra === 'leg_bye') return `${ball.runs}lb`;
  if (ball.extra === 'penalty') return `+${ball.runs}`;
  return String(ball.runs ?? 0);
}

function toneFor(ball) {
  if (ball.wicket) return 'bg-wicket-500 text-white';
  if (ball.extra) return 'bg-warn-500 text-white';
  if (ball.runs === 4 || ball.runs === 6) return 'bg-success-500 text-white';
  if (ball.runs === 0) return 'bg-surface-muted text-ink-soft dark:bg-surface-darkmuted dark:text-ink-darksoft';
  return 'bg-brand-500 text-white';
}

export default function OverTimeline({ computed }) {
  if (!computed) return null;
  const current = computed.currentOver;
  const previous = computed.overs.slice(-2).reverse();

  return (
    <Card className="p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">This over</p>
      <div className="flex flex-wrap gap-2">
        {(current?.balls || []).map((b, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold font-tabular ${toneFor(b)}`}
          >
            {ballLabel(b)}
          </span>
        ))}
        {(!current || current.balls.length === 0) && <span className="text-sm text-ink-faint">No balls bowled yet this over.</span>}
      </div>

      {previous.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-ink/[0.06] pt-3 dark:border-white/[0.06]">
          {previous.map((over) => (
            <div key={over.overNumber} className="flex items-center gap-2 overflow-x-auto">
              <span className="w-8 shrink-0 font-tabular text-xs font-bold text-ink-faint">Ov{over.overNumber + 1}</span>
              {over.balls.map((b, i) => (
                <span
                  key={i}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold font-tabular ${toneFor(b)}`}
                >
                  {ballLabel(b)}
                </span>
              ))}
              <span className="ml-auto shrink-0 font-tabular text-xs font-semibold text-ink-soft dark:text-ink-darksoft">{over.runs} runs</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}