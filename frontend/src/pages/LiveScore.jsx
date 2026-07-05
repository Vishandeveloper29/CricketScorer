import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, Badge, EmptyState } from '../components/ui/Surface';
import Scoreboard from '../components/scoreboard/Scoreboard';
import OverTimeline from '../components/scoreboard/OverTimeline';
import BallControls from '../components/scoreboard/BallControls';
import BatsmenPanel from '../components/batting/BatsmenPanel';
import BowlerPanel from '../components/bowling/BowlerPanel';
import StartInningsDialog from '../components/dialogs/StartInningsDialog';
import WicketDialog from '../components/dialogs/WicketDialog';
import ChangeBowlerDialog from '../components/dialogs/ChangeBowlerDialog';
import BatsmanMenuDialog from '../components/dialogs/BatsmanMenuDialog';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useCurrentInnings, useMatchActions, useMatchState } from '../context/MatchContext';
import { useSnackbar } from '../context/SnackbarContext';
import { saveToHistory } from '../utils/matchHistory';

export default function LiveScore() {
  const match = useMatchState();
  const { index: inningsIndex, raw: rawInnings, computed } = useCurrentInnings() || {};
  const actions = useMatchActions();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [wicketOpen, setWicketOpen] = useState(false);
  const [bowlerDialogOpen, setBowlerDialogOpen] = useState(false);
  const [batsmanMenu, setBatsmanMenu] = useState(null); // { name, role }
  const [endInningsConfirm, setEndInningsConfirm] = useState(false);

  const battingTeamKey = rawInnings?.battingTeam;
  const bowlingTeamKey = rawInnings?.bowlingTeam;
  const battingTeam = match?.teams?.[battingTeamKey];
  const bowlingTeam = match?.teams?.[bowlingTeamKey];
  const ballsPerOver = match?.meta?.ballsPerOver || 6;
  const totalLegalBalls = (match?.meta?.overs || 20) * ballsPerOver;
  const isSecondInnings = inningsIndex === 1;

  const outBatsmenNames = useMemo(() => {
    if (!computed) return [];
    return Object.values(computed.batsmen)
      .filter((b) => b.out || b.retiredHurt)
      .map((b) => b.name);
  }, [computed]);

  const maxWickets = (match?.meta?.playersCount || 11) - 1;

  const inningsComplete = useMemo(() => {
    if (!computed) return false;
    if (computed.legalBalls >= totalLegalBalls) return true;
    if (computed.totalWickets >= maxWickets) return true;
    if (isSecondInnings && rawInnings?.target != null && computed.totalRuns >= rawInnings.target) return true;
    return false;
  }, [computed, totalLegalBalls, maxWickets, isSecondInnings, rawInnings]);

  const lastLogEntry = rawInnings?.log?.[rawInnings.log.length - 1];
  const needsNewBowler = !!computed && computed.legalBalls > 0 && !computed.currentOver && !inningsComplete;
  const bowlerSetForNextOver = lastLogEntry?.type === 'bowler_change';
  // Only block scoring if an over ended and a new bowler has not been confirmed yet.
  const betweenOvers = needsNewBowler && !bowlerSetForNextOver;

  // Auto-prompt for a new bowler between overs
  useEffect(() => {
    if (betweenOvers) {
      setBowlerDialogOpen(true);
    }
  }, [betweenOvers]);

  if (!match) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <EmptyState
          title="No match in progress"
          subtitle="Create a match to start live scoring."
          action={
            <Button as={Link} to="/create">
              Create a match
            </Button>
          }
        />
      </div>
    );
  }

  const handleScore = (payload) => {
    if (!computed?.striker) {
      snackbar.show('Set the striker first', { tone: 'error' });
      return;
    }
    if (!computed?.currentBowler) {
      snackbar.show('Select a bowler before scoring this over', { tone: 'error' });
      return;
    }
    actions.addBall({ ...payload, bowler: computed.currentBowler, striker: computed.striker, nonStriker: computed.nonStriker });
  };

  const handleWicketConfirm = ({ runs, wicket, newBatsman }) => {
    actions.addBall({ runs, wicket, newBatsman, bowler: computed.currentBowler });
    snackbar.show('Wicket recorded', { tone: 'success' });
  };

  const handleStartInnings = ({ striker, nonStriker, bowler }) => {
    actions.startInnings({ striker, nonStriker, bowler });
  };

  const finalizeMatchResult = (finalComputedSecond) => {
    const firstIdx = 0;
    const secondIdx = 1;
    const firstInn = match.innings[firstIdx];
    const secondComputed = finalComputedSecond;
    const firstComputedTotal = firstInn.target - 1; // target was set as totalRuns+1
    const secondRuns = secondComputed.totalRuns;
    let result;
    const chasingTeamName = match.teams[secondInningsBattingKey()].name;
    const firstTeamName = match.teams[firstInn.battingTeam].name;

    function secondInningsBattingKey() {
      return match.innings[secondIdx].battingTeam;
    }

    if (secondRuns >= firstInn.target) {
      const wicketsInHand = maxWickets - secondComputed.totalWickets;
      result = { type: 'win_wickets', winner: chasingTeamName, text: `${chasingTeamName} won by ${wicketsInHand} wicket${wicketsInHand === 1 ? '' : 's'}` };
    } else if (secondRuns === firstComputedTotal) {
      result = { type: 'tie', winner: null, text: 'Match tied' };
    } else {
      const margin = firstComputedTotal - secondRuns;
      result = { type: 'win_runs', winner: firstTeamName, text: `${firstTeamName} won by ${margin} run${margin === 1 ? '' : 's'}` };
    }
    actions.setMatchResult(result);
    return result;
  };

  const handleProceed = () => {
    if (!computed) return;
    if (inningsIndex === 0) {
      const target = computed.totalRuns + 1;
      actions.closeInnings(target);
      snackbar.show(`Innings closed. Target: ${target}`, { tone: 'success' });
    } else {
      const result = finalizeMatchResult(computed);
      const finalMatch = { ...match, status: 'completed', result };
      saveToHistory(finalMatch);
      snackbar.show(result.text, { tone: 'success', duration: 5000 });
      navigate(`/scorecard/${match.id}`);
    }
  };

  // persist ongoing match snapshot into history list too, so it shows on Home/History while live
  useEffect(() => {
    if (match && match.status !== 'setup') {
      saveToHistory(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.updatedAt]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-ink dark:text-ink-dark">{match.meta.name}</p>
          <p className="text-xs text-ink-soft dark:text-ink-darksoft">
            {match.teams.A.name} vs {match.teams.B.name} · {match.meta.overs} overs
          </p>
        </div>
        <Link to={`/scorecard/${match.id}`}>
          <Badge tone="brand">Scorecard →</Badge>
        </Link>
      </div>

      {!rawInnings?.started ? (
        <Card className="p-6">
          <EmptyState title="Ready to start" subtitle={`${battingTeam?.name} bat first. Choose your openers to begin.`} />
        </Card>
      ) : (
        <div className="space-y-4">
          <Scoreboard
            match={match}
            computed={computed}
            battingTeamName={battingTeam?.name}
            bowlingTeamName={bowlingTeam?.name}
            isSecondInnings={isSecondInnings}
            target={rawInnings?.target}
            ballsPerOver={ballsPerOver}
            totalLegalBalls={totalLegalBalls}
          />

          {betweenOvers && (
            <Card className="border border-warn-500/30 bg-warn-500/5 p-4">
              <p className="text-sm font-semibold text-ink dark:text-ink-dark">Over complete</p>
              <p className="text-xs text-ink-soft dark:text-ink-darksoft">Set the next bowler to continue scoring.</p>
            </Card>
          )}

          {inningsComplete ? (
            <Card className="space-y-3 p-5 text-center">
              <p className="font-display font-bold text-ink dark:text-ink-dark">
                {isSecondInnings ? 'Innings complete — match finished' : 'Innings complete'}
              </p>
              <p className="text-sm text-ink-soft dark:text-ink-darksoft">
                {computed.totalRuns}/{computed.totalWickets} off {computed.oversDisplay} overs
              </p>
              <Button size="lg" className="w-full" onClick={handleProceed}>
                {isSecondInnings ? 'Finish match & view scorecard' : 'Start second innings'}
              </Button>
            </Card>
          ) : (
            <>
              <BatsmenPanel computed={computed} onOpenBatsmanMenu={(name, role) => name && setBatsmanMenu({ name, role })} />
              <BowlerPanel computed={computed} ballsPerOver={ballsPerOver} onChangeBowler={() => setBowlerDialogOpen(true)} />
              <OverTimeline computed={computed} />
              <BallControls
                canScore={!betweenOvers && !!computed?.currentBowler}
                canUndo={rawInnings.log.length > 0}
                canRedo={rawInnings.redoStack.length > 0}
                onScore={handleScore}
                onWicket={() => setWicketOpen(true)}
                onUndo={actions.undo}
                onRedo={actions.redo}
              />
              <Button variant="outline" className="w-full" onClick={() => setEndInningsConfirm(true)}>
                End innings now
              </Button>
            </>
          )}
        </div>
      )}

      <StartInningsDialog
        open={!!match && rawInnings && !rawInnings.started}
        battingTeamName={battingTeam?.name}
        bowlingTeamName={bowlingTeam?.name}
        battingPlayers={battingTeam?.players || []}
        bowlingPlayers={bowlingTeam?.players || []}
        onStart={handleStartInnings}
      />

      {computed && (
        <WicketDialog
          open={wicketOpen}
          onClose={() => setWicketOpen(false)}
          striker={computed.striker}
          nonStriker={computed.nonStriker}
          battingSquad={battingTeam?.players || []}
          bowlingSquad={bowlingTeam?.players || []}
          outBatsmenNames={outBatsmenNames}
          onConfirm={handleWicketConfirm}
        />
      )}

      {computed && (
        <ChangeBowlerDialog
          open={bowlerDialogOpen}
          dismissable={!betweenOvers}
          onClose={() => setBowlerDialogOpen(false)}
          bowlingSquad={bowlingTeam?.players || []}
          lastBowler={computed.lastOverBowler}
          onConfirm={(bowler) => {
            actions.changeBowler(bowler);
            setBowlerDialogOpen(false);
          }}
        />
      )}

      {computed && batsmanMenu && (
        <BatsmanMenuDialog
          open={!!batsmanMenu}
          onClose={() => setBatsmanMenu(null)}
          batsmanName={batsmanMenu.name}
          battingSquad={battingTeam?.players || []}
          outBatsmenNames={outBatsmenNames}
          otherBatsman={batsmanMenu.role === 'striker' ? computed.nonStriker : computed.striker}
          onSwap={() => {
            actions.swapStrike();
            setBatsmanMenu(null);
          }}
          onRetire={(mode, newBatsman) => {
            actions.retireBatsman(batsmanMenu.name, mode, newBatsman);
            setBatsmanMenu(null);
          }}
        />
      )}

      <ConfirmDialog
        open={endInningsConfirm}
        onClose={() => setEndInningsConfirm(false)}
        onConfirm={handleProceed}
        title="End innings now?"
        description="This will close the current innings early. This can't be undone from here."
        confirmLabel="End innings"
      />
    </div>
  );
}