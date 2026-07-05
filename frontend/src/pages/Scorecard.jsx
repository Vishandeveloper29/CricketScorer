import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, Badge, SectionTitle, EmptyState } from '../components/ui/Surface';
import { SegmentedControl } from '../components/ui/Field';
import { useMatchState } from '../context/MatchContext';
import { computeInnings, formatOvers, runRate } from '../utils/cricketEngine';
import { getHistory } from '../utils/matchHistory';

function BattingTable({ computed, ballsPerOver }) {
  if (!computed) return <p className="p-4 text-sm text-ink-faint">Innings not started.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-ink/[0.06] text-left text-xs font-bold uppercase tracking-wide text-ink-faint dark:border-white/[0.06]">
            <th className="py-2 pr-2">Batsman</th>
            <th className="px-2 py-2 text-right">R</th>
            <th className="px-2 py-2 text-right">B</th>
            <th className="px-2 py-2 text-right">4s</th>
            <th className="px-2 py-2 text-right">6s</th>
            <th className="px-2 py-2 text-right">SR</th>
          </tr>
        </thead>
        <tbody>
          {computed.battingList.map((b) => (
            <tr key={b.name} className="border-b border-ink/[0.04] last:border-0 dark:border-white/[0.04]">
              <td className="py-2.5 pr-2">
                <p className="font-semibold text-ink dark:text-ink-dark">
                  {b.name}
                  {(b.name === computed.striker || b.name === computed.nonStriker) && !b.out && (
                    <span className="ml-1 text-brand-500">•</span>
                  )}
                </p>
                <p className="text-xs text-ink-faint">
                  {b.out ? b.dismissal?.label + (b.dismissal?.bowler ? ` b ${b.dismissal.bowler}` : '') + (b.dismissal?.fielder ? ` (${b.dismissal.fielder})` : '') : b.retiredHurt ? 'retired hurt' : 'not out'}
                </p>
              </td>
              <td className="px-2 py-2.5 text-right font-tabular font-bold text-ink dark:text-ink-dark">{b.runs}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.balls}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.fours}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.sixes}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.strikeRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-ink-soft dark:text-ink-darksoft">
        Extras: <span className="font-tabular font-semibold">{computed.totalExtras}</span>{' '}
        <span className="text-xs text-ink-faint">
          (w {computed.extras.wide}, nb {computed.extras.no_ball}, b {computed.extras.bye}, lb {computed.extras.leg_bye}, p {computed.extras.penalty})
        </span>
      </p>
      <p className="mt-1 font-tabular text-sm font-bold text-ink dark:text-ink-dark">
        Total: {computed.totalRuns}/{computed.totalWickets} in {computed.oversDisplay} overs (RR {runRate(computed.totalRuns, computed.legalBalls, ballsPerOver)})
      </p>
    </div>
  );
}

function BowlingTable({ computed }) {
  if (!computed || computed.bowlersList.length === 0) return null;
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-ink/[0.06] text-left text-xs font-bold uppercase tracking-wide text-ink-faint dark:border-white/[0.06]">
            <th className="py-2 pr-2">Bowler</th>
            <th className="px-2 py-2 text-right">O</th>
            <th className="px-2 py-2 text-right">M</th>
            <th className="px-2 py-2 text-right">R</th>
            <th className="px-2 py-2 text-right">W</th>
            <th className="px-2 py-2 text-right">Econ</th>
          </tr>
        </thead>
        <tbody>
          {computed.bowlersList.map((b) => (
            <tr key={b.name} className="border-b border-ink/[0.04] last:border-0 dark:border-white/[0.04]">
              <td className="py-2.5 pr-2 font-semibold text-ink dark:text-ink-dark">{b.name}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.overStr}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.maidens}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.runs}</td>
              <td className="px-2 py-2.5 text-right font-tabular font-bold text-ink dark:text-ink-dark">{b.wickets}</td>
              <td className="px-2 py-2.5 text-right font-tabular text-ink-soft dark:text-ink-darksoft">{b.economy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FallOfWickets({ computed }) {
  if (!computed || computed.fallOfWickets.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {computed.fallOfWickets.map((f) => (
        <span key={f.wicketNumber} className="rounded-lg bg-surface-soft px-2.5 py-1.5 text-xs font-medium text-ink-soft dark:bg-surface-darkmuted dark:text-ink-darksoft">
          {f.wicketNumber}-{f.score} <span className="text-ink-faint">({f.batsman}, {f.overStr} ov)</span>
        </span>
      ))}
    </div>
  );
}

export default function Scorecard() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const liveMatch = useMatchState();
  const history = useMemo(() => getHistory(), []);
  const [inningsTab, setInningsTab] = useState('0');

  const match = useMemo(() => {
    if (matchId) return history.find((m) => m.id === matchId) || (liveMatch?.id === matchId ? liveMatch : null);
    return liveMatch;
  }, [matchId, history, liveMatch]);

  if (!match) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <EmptyState title="Match not found" subtitle="This match may have been deleted, or hasn't started yet." action={<Button onClick={() => navigate('/history')}>Go to match history</Button>} />
      </div>
    );
  }

  const ballsPerOver = match.meta.ballsPerOver;
  const inningsList = match.innings.filter((i) => i.started);
  const activeIdx = Number(inningsTab);
  const activeInnings = match.innings[activeIdx];
  const computed = activeInnings?.started
    ? computeInnings(activeInnings.log, {
        ballsPerOver,
        openingStriker: activeInnings.openingStriker,
        openingNonStriker: activeInnings.openingNonStriker,
        openingBowler: activeInnings.openingBowler,
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <SectionTitle
        eyebrow={match.meta.tournament || 'Scorecard'}
        title={match.meta.name}
        subtitle={`${match.teams.A.name} vs ${match.teams.B.name} · ${match.meta.venue || 'Venue not set'} · ${match.meta.date}`}
        action={
          match.status === 'live' && (
            <Button size="sm" onClick={() => navigate('/live')}>
              Back to scoring
            </Button>
          )
        }
      />

      {match.result && (
        <Card className="mb-4 flex items-center gap-3 border-l-4 border-l-success-500 p-4">
          <Badge tone="success">Result</Badge>
          <p className="font-semibold text-ink dark:text-ink-dark">{match.result.text}</p>
        </Card>
      )}

      {inningsList.length > 1 && (
        <div className="mb-4">
          <SegmentedControl
            options={inningsList.map((inn, i) => ({
              value: String(match.innings.indexOf(inn)),
              label: `${match.teams[inn.battingTeam].name} innings`,
            }))}
            value={inningsTab}
            onChange={setInningsTab}
          />
        </div>
      )}

      <Card className="p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {match.teams[activeInnings?.battingTeam]?.name} batting
        </p>
        <BattingTable computed={computed} ballsPerOver={ballsPerOver} />
        <BowlingTable computed={computed} />
        <FallOfWickets computed={computed} />
      </Card>
    </div>
  );
}