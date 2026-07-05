import { Card } from '../ui/Surface';
import Button from '../ui/Button';

export default function BowlerPanel({ computed, onChangeBowler, ballsPerOver = 6 }) {
  if (!computed) return null;
  const bowler = computed.currentBowler ? computed.bowlers[computed.currentBowler] : null;
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-faint">Bowling</p>
        <p className="font-semibold text-ink dark:text-ink-dark">{computed.currentBowler || 'No bowler set'}</p>
        {bowler && (
          <p className="mt-0.5 font-tabular text-sm text-ink-soft dark:text-ink-darksoft">
            {Math.floor(bowler.legalBalls / ballsPerOver)}.{bowler.legalBalls % ballsPerOver}-{bowler.maidens}-{bowler.runs}-{bowler.wickets} · Econ {bowler.economy}
          </p>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={onChangeBowler}>
        Change
      </Button>
    </Card>
  );
}