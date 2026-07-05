import { Card, Badge } from '../ui/Surface';
import { requiredRunRate, runRate } from '../../utils/cricketEngine';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function ChaseWinWidget({ computed, target, ballsPerOver, totalLegalBalls, maxWickets }) {
  if (!computed || target == null) return null;

  const targetToWin = target;
  const runs = computed.totalRuns;
  const legalBalls = computed.legalBalls;
  const wicketsLost = computed.totalWickets;

  const ballsRemaining = Math.max(0, totalLegalBalls - legalBalls);
  const runsNeeded = Math.max(0, targetToWin - runs);
  const wicketsInHand = Math.max(0, maxWickets - wicketsLost);

  const crr = Number(runRate(runs, legalBalls, ballsPerOver));
  const rrr = Number(requiredRunRate(runsNeeded, ballsRemaining, ballsPerOver));

  const progress = clamp(runs / Math.max(1, targetToWin), 0, 1.3);
  const wicketFactor = maxWickets > 0 ? wicketsInHand / maxWickets : 0;
  const ballFactor = totalLegalBalls > 0 ? ballsRemaining / totalLegalBalls : 0;
  const rrGap = rrr - crr;

  // Heuristic probability model for quick in-match pressure guidance.
  const score = 0.5 + progress * 0.42 + wicketFactor * 0.2 + ballFactor * 0.08 - rrGap * 0.06;
  const chaseProbability = clamp(score, 0.03, 0.97);
  const chancePct = Math.round(chaseProbability * 100);

  const pressure =
    runsNeeded === 0
      ? 'Won'
      : chancePct >= 70
      ? 'Comfortable chase'
      : chancePct >= 45
      ? 'Game on'
      : chancePct >= 30
      ? 'Pressure building'
      : 'High pressure';

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Chase meter</p>
        <Badge tone={chancePct >= 50 ? 'success' : 'warn'}>{chancePct}% win chance</Badge>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-surface-muted dark:bg-surface-darkmuted">
        <div
          className={`h-full rounded-full ${chancePct >= 50 ? 'bg-success-500' : 'bg-warn-500'}`}
          style={{ width: `${chancePct}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Need" value={runsNeeded} />
        <Stat label="Balls" value={ballsRemaining} />
        <Stat label="RRR" value={rrr.toFixed(2)} />
        <Stat label="In hand" value={wicketsInHand} />
      </div>

      <p className="mt-3 text-xs font-medium text-ink-soft dark:text-ink-darksoft">{pressure}</p>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-surface-soft px-2 py-2 text-center dark:bg-surface-darkmuted">
      <p className="font-tabular text-sm font-extrabold text-ink dark:text-ink-dark">{value}</p>
      <p className="text-[10px] font-medium text-ink-faint">{label}</p>
    </div>
  );
}
