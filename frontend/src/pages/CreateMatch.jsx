import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, SelectField, Stepper, SegmentedControl } from '../components/ui/Field';
import Button from '../components/ui/Button';
import { Card, SectionTitle } from '../components/ui/Surface';
import { useMatchActions } from '../context/MatchContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useSettings } from '../context/SettingsContext';

function PlayerList({ teamLabel, players, setPlayers, count }) {
  const updateName = (i, name) => {
    const next = [...players];
    next[i] = name;
    setPlayers(next);
  };
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink dark:text-ink-dark">{teamLabel} — Players ({count})</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <input
            key={i}
            value={players[i] || ''}
            onChange={(e) => updateName(i, e.target.value)}
            placeholder={`Player ${i + 1}`}
            className="h-11 w-full rounded-lg border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-surface-darkmuted dark:text-ink-dark"
          />
        ))}
      </div>
    </div>
  );
}

export default function CreateMatch() {
  const navigate = useNavigate();
  const { createMatch } = useMatchActions();
  const snackbar = useSnackbar();
  const { settings } = useSettings();

  const [form, setForm] = useState({
    name: '',
    venue: '',
    date: new Date().toISOString().slice(0, 10),
    tournament: '',
    overs: 20,
    ballsPerOver: settings?.ballsPerOver || 6,
    playersCount: 11,
    teamAName: 'Team A',
    teamBName: 'Team B',
    tossCaller: 'A',
    tossCall: 'heads',
    tossResult: '',
    tossWinner: 'A',
    tossDecision: 'bat',
  });
  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  const runToss = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    window.setTimeout(() => {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const callerWon = form.tossCall === result;
    const winner = callerWon ? form.tossCaller : form.tossCaller === 'A' ? 'B' : 'A';

    setForm((f) => ({ ...f, tossResult: result, tossWinner: winner }));
    snackbar.show(`${winner === 'A' ? form.teamAName || 'Team A' : form.teamBName || 'Team B'} won the toss (${result})`, {
      tone: 'success',
    });
      setIsFlipping(false);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.teamAName.trim() || !form.teamBName.trim()) {
      snackbar.show('Both team names are required', { tone: 'error' });
      return;
    }
    const fillNames = (arr, fallback) =>
      Array.from({ length: form.playersCount }).map((_, i) => (arr[i] && arr[i].trim()) || `${fallback} ${i + 1}`);

    const id = `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    createMatch({
      id,
      meta: {
        name: form.name.trim() || `${form.teamAName} vs ${form.teamBName}`,
        venue: form.venue.trim(),
        date: form.date,
        tournament: form.tournament.trim(),
        overs: Number(form.overs),
        ballsPerOver: Number(form.ballsPerOver),
        playersCount: Number(form.playersCount),
      },
      teams: {
        A: { name: form.teamAName.trim(), players: fillNames(playersA, 'A-Player') },
        B: { name: form.teamBName.trim(), players: fillNames(playersB, 'B-Player') },
      },
      toss: {
        winner: form.tossWinner,
        decision: form.tossDecision,
        caller: form.tossCaller,
        call: form.tossCall,
        result: form.tossResult || null,
      },
    });
    snackbar.show('Match created — set your openers to begin', { tone: 'success' });
    navigate('/live');
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
      <SectionTitle eyebrow="New match" title="Set up your match" subtitle="This takes less than a minute." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="space-y-4 p-5">
          <h3 className="font-display font-bold text-ink dark:text-ink-dark">Match details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Match name" placeholder="Sunday Society Derby" value={form.name} onChange={set('name')} />
            <TextField label="Tournament (optional)" placeholder="Winter Box League" value={form.tournament} onChange={set('tournament')} />
            <TextField label="Venue" placeholder="Central Turf Ground" value={form.venue} onChange={set('venue')} />
            <TextField type="date" label="Date" value={form.date} onChange={set('date')} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
            <Stepper label="Overs" value={form.overs} onChange={(v) => setForm((f) => ({ ...f, overs: v }))} min={1} max={50} />
            <Stepper
              label="Balls / over"
              value={form.ballsPerOver}
              onChange={(v) => setForm((f) => ({ ...f, ballsPerOver: v }))}
              min={4}
              max={10}
            />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display font-bold text-ink dark:text-ink-dark">Teams</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Team A name" value={form.teamAName} onChange={set('teamAName')} />
            <TextField label="Team B name" value={form.teamBName} onChange={set('teamBName')} />
          </div>
          <Stepper
            label="Number of players per side"
            value={form.playersCount}
            onChange={(v) => setForm((f) => ({ ...f, playersCount: v }))}
            min={2}
            max={15}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <PlayerList teamLabel={form.teamAName || 'Team A'} players={playersA} setPlayers={setPlayersA} count={form.playersCount} />
            <PlayerList teamLabel={form.teamBName || 'Team B'} players={playersB} setPlayers={setPlayersB} count={form.playersCount} />
          </div>
          <p className="text-xs text-ink-faint">Leave blank to auto-fill placeholder names — you can edit later from the scoring screen.</p>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display font-bold text-ink dark:text-ink-dark">Toss</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl2 border border-ink/10 bg-surface-soft p-4 dark:border-white/10 dark:bg-surface-darkmuted">
              <p className="text-sm font-semibold text-ink dark:text-ink-dark">Coin toss</p>
              <div className="mt-3 flex items-center gap-4">
                <div className={`coin ${isFlipping ? 'coin-flipping' : ''}`}>{form.tossResult || 'Flip'}</div>
                <div className="space-y-1.5">
                  <p className="text-xs text-ink-soft dark:text-ink-darksoft">
                    Caller: <span className="font-semibold text-ink dark:text-ink-dark">{form.tossCaller === 'A' ? form.teamAName : form.teamBName}</span>
                  </p>
                  <p className="text-xs text-ink-soft dark:text-ink-darksoft">
                    Call: <span className="font-semibold uppercase text-ink dark:text-ink-dark">{form.tossCall}</span>
                  </p>
                  {form.tossResult && (
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      Landed: {form.tossResult.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
              <Button type="button" className="mt-4 w-full" variant="secondary" disabled={isFlipping} onClick={runToss}>
                {isFlipping ? 'Flipping...' : 'Flip coin'}
              </Button>
            </div>

            <div className="space-y-4">
              <SelectField label="Toss called by" value={form.tossCaller} onChange={set('tossCaller')}>
                <option value="A">{form.teamAName || 'Team A'}</option>
                <option value="B">{form.teamBName || 'Team B'}</option>
              </SelectField>
              <SelectField label="Call" value={form.tossCall} onChange={set('tossCall')}>
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </SelectField>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Toss won by" value={form.tossWinner} onChange={set('tossWinner')}>
              <option value="A">{form.teamAName || 'Team A'}</option>
              <option value="B">{form.teamBName || 'Team B'}</option>
            </SelectField>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">Elected to</span>
              <SegmentedControl
                options={[
                  { value: 'bat', label: 'Bat first' },
                  { value: 'bowl', label: 'Bowl first' },
                ]}
                value={form.tossDecision}
                onChange={(v) => setForm((f) => ({ ...f, tossDecision: v }))}
              />
            </div>
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Save match &amp; start scoring
        </Button>
      </form>
    </div>
  );
}