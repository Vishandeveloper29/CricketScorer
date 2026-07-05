import { Card, Badge } from '../ui/Surface';
import { requiredRunRate, runRate } from '../../utils/cricketEngine';

export default function Scoreboard({ match, computed, battingTeamName, bowlingTeamName, isSecondInnings, target, ballsPerOver, totalLegalBalls }) {
  const runs = computed?.totalRuns ?? 0;
  const wkts = computed?.totalWickets ?? 0;
  const legalBalls = computed?.legalBalls ?? 0;
  const oversStr = computed?.oversDisplay ?? '0.0';
  const crr = runRate(runs, legalBalls, ballsPerOver);
  const projectedTotal = legalBalls > 0 ? Math.round((runs / legalBalls) * totalLegalBalls) : null;
  const boundaries = (computed?.battingList || []).reduce(
    (acc, batter) => {
      acc.fours += batter.fours || 0;
      acc.sixes += batter.sixes || 0;
      return acc;
    },
    { fours: 0, sixes: 0 }
  );

  const ballsRemaining = Math.max(0, totalLegalBalls - legalBalls);
  const runsNeeded = isSecondInnings && target != null ? target - runs : null;
  const rrr = isSecondInnings && target != null ? requiredRunRate(Math.max(0, runsNeeded), ballsRemaining, ballsPerOver) : null;

  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">{battingTeamName} batting</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-tabular font-display text-5xl font-extrabold text-ink dark:text-ink-dark">{runs}</span>
            <span className="font-tabular font-display text-3xl font-bold text-ink-faint">/{wkts}</span>
          </div>
          <p className="mt-1 font-tabular text-sm font-semibold text-ink-soft dark:text-ink-darksoft">
            Overs {oversStr} <span className="text-ink-faint">/ {Math.floor(totalLegalBalls / ballsPerOver)}</span>
          </p>
        </div>
        <div className="text-right">
          <Badge tone="brand">CRR {crr}</Badge>
          {isSecondInnings && target != null && (
            <div className="mt-2">
              <Badge tone="warn">RRR {rrr}</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-ink/[0.06] pt-4 dark:border-white/[0.06] sm:grid-cols-4">
        <Stat label="Total runs" value={runs} />
        <Stat label="Run rate" value={crr} />
        <Stat label="Extras" value={computed?.totalExtras ?? 0} />
        <Stat label="4s/6s" value={`${boundaries.fours}/${boundaries.sixes}`} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Projected" value={projectedTotal ?? '-'} />
        <Stat label="Balls faced" value={legalBalls} />
        <Stat label="Bowling team" value={bowlingTeamName || '-'} />
        <Stat label="Wkts lost" value={wkts} />
      </div>

      {isSecondInnings && target != null && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/[0.06] pt-4 dark:border-white/[0.06]">
          <Stat label="Target" value={target} />
          <Stat label="Runs needed" value={Math.max(0, runsNeeded)} />
          <Stat label="Balls left" value={ballsRemaining} />
        </div>
      )}

      {computed?.partnership && (computed.striker || computed.nonStriker) && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-soft px-4 py-2.5 text-sm dark:bg-surface-darkmuted">
          <span className="font-medium text-ink-soft dark:text-ink-darksoft">Partnership</span>
          <span className="font-tabular font-bold text-ink dark:text-ink-dark">
            {computed.partnership.runs} ({computed.partnership.balls})
          </span>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-soft py-2.5 text-center dark:bg-surface-darkmuted">
      <p className="font-tabular text-lg font-extrabold text-ink dark:text-ink-dark">{value}</p>
      <p className="text-[11px] font-medium text-ink-faint">{label}</p>
    </div>
  );
}