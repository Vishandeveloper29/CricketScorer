import { DISMISSALS } from '../data/constants';

const dismissalMap = Object.fromEntries(DISMISSALS.map((d) => [d.id, d]));

const emptyBatsman = (name) => ({
  name,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  out: false,
  retiredHurt: false,
  dismissal: null, // { type, bowler, fielder, overStr, score }
  inAt: null, // { over, ball } when they came to crease
});

const emptyBowler = (name) => ({
  name,
  legalBalls: 0,
  runs: 0,
  wickets: 0,
  maidens: 0,
  oversBowled: 0, // completed overs count for maiden detection is done via per-over tally below
});

/**
 * Replays a flat ball log into complete derived innings state.
 * This is the single source of truth — undo/redo/edit just mutate the log
 * and recompute, so correctness never drifts.
 */
export function computeInnings(log, { ballsPerOver = 6, openingStriker, openingNonStriker, openingBowler } = {}) {
  const batsmen = {};
  const bowlers = {};
  const battingOrder = [];
  const bowlingOrder = [];
  const overs = []; // { overNumber, bowler, balls: [event], runs, wickets }
  const fallOfWickets = [];
  const extras = { wide: 0, no_ball: 0, bye: 0, leg_bye: 0, penalty: 0 };

  let striker = openingStriker || null;
  let nonStriker = openingNonStriker || null;
  let currentBowler = openingBowler || null;
  let totalRuns = 0;
  let totalWickets = 0;
  let legalBalls = 0; // total legal balls bowled in the innings
  let ballInOverCount = 0; // legal balls bowled in current over
  let currentOver = null;
  let lastOverBowler = null;

  const ensureBatsman = (name) => {
    if (!name) return;
    if (!batsmen[name]) {
      batsmen[name] = emptyBatsman(name);
      battingOrder.push(name);
      batsmen[name].inAt = { over: Math.floor(legalBalls / ballsPerOver), ball: ballInOverCount };
    }
  };
  const ensureBowler = (name) => {
    if (!name) return;
    if (!bowlers[name]) {
      bowlers[name] = emptyBowler(name);
      bowlingOrder.push(name);
    }
  };

  ensureBatsman(striker);
  ensureBatsman(nonStriker);
  ensureBowler(currentBowler);

  const startOverIfNeeded = (bowlerName) => {
    if (!currentOver) {
      currentOver = { overNumber: overs.length, bowler: bowlerName, balls: [], runs: 0, wickets: 0 };
    }
  };

  const closeOver = () => {
    if (currentOver) {
      overs.push(currentOver);
      lastOverBowler = currentOver.bowler;
      const b = bowlers[currentOver.bowler];
      if (b && currentOver.runs === 0) b.maidens += 1;
      currentOver = null;
      ballInOverCount = 0;
      // swap ends after over completes
      [striker, nonStriker] = [nonStriker, striker];
    }
  };

  const swapStrike = () => {
    [striker, nonStriker] = [nonStriker, striker];
  };

  for (const entry of log) {
    if (entry.type === 'swap') {
      swapStrike();
      continue;
    }

    if (entry.type === 'retire') {
      const b = batsmen[entry.batsman];
      if (b) {
        b.out = entry.mode === 'retired_out';
        b.retiredHurt = entry.mode === 'retired_hurt';
        b.dismissal = { type: entry.mode, bowler: null, fielder: null };
      }
      ensureBatsman(entry.newBatsman);
      if (striker === entry.batsman) striker = entry.newBatsman;
      else if (nonStriker === entry.batsman) nonStriker = entry.newBatsman;
      continue;
    }

    if (entry.type === 'bowler_change') {
      currentBowler = entry.bowler;
      ensureBowler(currentBowler);
      continue;
    }

    if (entry.type === 'ball') {
      const { runs = 0, extra = null, extraRuns = 0, wicket = null, newBatsman = null, bowler } = entry;
      const bowlerName = bowler || currentBowler;
      currentBowler = bowlerName;
      ensureBowler(bowlerName);
      ensureBatsman(striker);
      ensureBatsman(nonStriker);
      startOverIfNeeded(bowlerName);

      const isWide = extra === 'wide';
      const isNoBall = extra === 'no_ball';
      const isBye = extra === 'bye';
      const isLegBye = extra === 'leg_bye';
      const isPenalty = extra === 'penalty';
      const isLegalDelivery = !isWide && !isNoBall && !isPenalty;

      let runsToBatsman = 0;
      let runsToTeam = 0;
      let bowlerConceded = 0;

      if (!extra) {
        runsToBatsman = runs;
        runsToTeam = runs;
        bowlerConceded = runs;
        batsmen[striker].balls += 1;
        batsmen[striker].runs += runs;
        if (runs === 4) batsmen[striker].fours += 1;
        if (runs === 6) batsmen[striker].sixes += 1;
      } else if (isWide) {
        runsToTeam = 1 + extraRuns;
        bowlerConceded = 1 + extraRuns;
        extras.wide += 1 + extraRuns;
      } else if (isNoBall) {
        runsToTeam = 1 + runs;
        bowlerConceded = 1 + runs;
        extras.no_ball += 1;
        batsmen[striker].balls += 1;
        if (runs > 0) {
          batsmen[striker].runs += runs;
          if (runs === 4) batsmen[striker].fours += 1;
          if (runs === 6) batsmen[striker].sixes += 1;
        }
      } else if (isBye) {
        runsToTeam = runs;
        bowlerConceded = runs;
        extras.bye += runs;
        batsmen[striker].balls += 1;
      } else if (isLegBye) {
        runsToTeam = runs;
        bowlerConceded = runs;
        extras.leg_bye += runs;
        batsmen[striker].balls += 1;
      } else if (isPenalty) {
        runsToTeam = runs;
        extras.penalty += runs;
      }

      totalRuns += runsToTeam;
      bowlers[bowlerName].runs += bowlerConceded;
      if (currentOver) currentOver.runs += runsToTeam;

      let wicketFell = false;
      if (wicket) {
        wicketFell = true;
        totalWickets += 1;
        const dismissalDef = dismissalMap[wicket.type];
        const outName = wicket.outBatsman === 'nonStriker' ? nonStriker : striker;
        ensureBatsman(outName);
        batsmen[outName].out = true;
        batsmen[outName].dismissal = {
          type: wicket.type,
          label: dismissalDef?.label || wicket.type,
          bowler: dismissalDef?.needsBowlerCredit ? bowlerName : null,
          fielder: wicket.fielder || null,
        };
        if (dismissalDef?.needsBowlerCredit) bowlers[bowlerName].wickets += 1;
        fallOfWickets.push({
          wicketNumber: totalWickets,
          score: totalRuns,
          batsman: outName,
          overStr: `${Math.floor(legalBalls / ballsPerOver)}.${ballInOverCount + (isLegalDelivery ? 1 : 0)}`,
        });
        if (currentOver) currentOver.wickets += 1;
        if (newBatsman) {
          ensureBatsman(newBatsman);
          if (outName === striker) striker = newBatsman;
          else if (outName === nonStriker) nonStriker = newBatsman;
        } else {
          if (outName === striker) striker = null;
          else if (outName === nonStriker) nonStriker = null;
        }
      }

      if (currentOver) {
        currentOver.balls.push({
          ...entry,
          bowler: bowlerName,
          runsToTeam,
          isLegalDelivery,
          displayOver: `${Math.floor(legalBalls / ballsPerOver)}.${ballInOverCount + (isLegalDelivery ? 1 : 0)}`,
        });
      }

      if (isLegalDelivery) {
        legalBalls += 1;
        ballInOverCount += 1;
        bowlers[bowlerName].legalBalls += 1;
      }

      // strike rotation on odd runs (bat runs, or bye/legbye runs, or wide extra runs run through)
      if (!wicketFell) {
        const runningRuns = !extra ? runs : isBye || isLegBye ? runs : isWide ? extraRuns : isNoBall ? runs : 0;
        if (runningRuns % 2 === 1) swapStrike();
      }

      if (isLegalDelivery && ballInOverCount >= ballsPerOver) {
        closeOver();
      }
    }
  }

  const bowlersList = bowlingOrder.map((n) => {
    const b = bowlers[n];
    const overStr = `${Math.floor(b.legalBalls / ballsPerOver)}.${b.legalBalls % ballsPerOver}`;
    const oversForEcon = b.legalBalls / ballsPerOver;
    return {
      ...b,
      overStr,
      economy: oversForEcon > 0 ? (b.runs / oversForEcon).toFixed(2) : '0.00',
    };
  });

  const battingList = battingOrder.map((n) => {
    const b = batsmen[n];
    return {
      ...b,
      strikeRate: b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0',
    };
  });

  const oversDisplay = `${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`;
  const partnership = (() => {
    if (!striker || !nonStriker) return { runs: 0, balls: 0 };
    // sum runs/balls of current pair since the last fall of wicket
    const lastFowIdx = fallOfWickets.length;
    let runs = 0;
    let balls = 0;
    const pairSet = new Set([striker, nonStriker]);
    // Walk overs balls after last wicket to accumulate partnership; simpler: recompute from log slice
    let sawWicketAt = -1;
    let idx = 0;
    for (const entry of log) {
      if (entry.type === 'ball') {
        idx += 1;
        if (entry.wicket) sawWicketAt = idx;
      }
    }
    let count = 0;
    for (const entry of log) {
      if (entry.type === 'ball') {
        count += 1;
        if (count <= sawWicketAt) continue;
        const { runs: r = 0, extra } = entry;
        if (!extra) runs += r;
        else if (extra === 'bye' || extra === 'leg_bye') runs += r;
        else if (extra === 'wide') runs += 1 + (entry.extraRuns || 0);
        else if (extra === 'no_ball') runs += 1 + r;
        if (!extra || extra === 'no_ball') balls += 1;
        else if (extra === 'bye' || extra === 'leg_bye') balls += 1;
      }
    }
    return { runs, balls };
  })();

  return {
    batsmen,
    battingList,
    bowlers,
    bowlersList,
    overs,
    currentOver,
    striker,
    nonStriker,
    currentBowler,
    lastOverBowler,
    totalRuns,
    totalWickets,
    legalBalls,
    ballInOverCount,
    oversDisplay,
    extras,
    totalExtras: Object.values(extras).reduce((a, b) => a + b, 0),
    fallOfWickets,
    battingOrder,
    bowlingOrder,
    partnership,
  };
}

export function runRate(runs, legalBalls, ballsPerOver = 6) {
  if (!legalBalls) return '0.00';
  const overs = legalBalls / ballsPerOver;
  return (runs / overs).toFixed(2);
}

export function requiredRunRate(runsNeeded, ballsRemaining, ballsPerOver = 6) {
  if (ballsRemaining <= 0) return '0.00';
  const overs = ballsRemaining / ballsPerOver;
  return Math.max(0, runsNeeded / overs).toFixed(2);
}

export function formatOvers(legalBalls, ballsPerOver = 6) {
  return `${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`;
}