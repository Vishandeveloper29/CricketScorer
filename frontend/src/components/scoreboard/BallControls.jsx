import { useState } from 'react';
import Button from '../ui/Button';
import { Card } from '../ui/Surface';
import BottomSheet from '../ui/BottomSheet';

const RUN_BUTTONS = [0, 1, 2, 3, 4, 6];

const EXTRA_DEFS = [
  { key: 'wide', label: 'Wide', short: 'WD' },
  { key: 'no_ball', label: 'No Ball', short: 'NB' },
  { key: 'bye', label: 'Bye', short: 'B' },
  { key: 'leg_bye', label: 'Leg Bye', short: 'LB' },
];

export default function BallControls({ canScore, canUndo, canRedo, onScore, onWicket, onUndo, onRedo }) {
  const [extraSheet, setExtraSheet] = useState(null); // {key,label}
  const [manualOpen, setManualOpen] = useState(false);
  const [manualRuns, setManualRuns] = useState(0);
  const [manualExtra, setManualExtra] = useState('');

  const submitExtra = (extraRuns) => {
    const key = extraSheet.key;
    if (key === 'wide') onScore({ runs: 0, extra: 'wide', extraRuns });
    else if (key === 'no_ball') onScore({ runs: extraRuns, extra: 'no_ball' });
    else onScore({ runs: extraRuns, extra: key }); // bye / leg_bye
    setExtraSheet(null);
  };

  const submitManual = () => {
    onScore({ runs: Number(manualRuns) || 0, extra: manualExtra || null });
    setManualOpen(false);
    setManualRuns(0);
    setManualExtra('');
  };

  return (
    <Card className="space-y-3 p-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">Runs</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {RUN_BUTTONS.map((r) => (
            <Button
              key={r}
              disabled={!canScore}
              variant={r === 4 || r === 6 ? 'success' : r === 0 ? 'secondary' : 'primary'}
              size="lg"
              className="font-tabular text-xl"
              onClick={() => onScore({ runs: r, extra: null })}
              aria-label={r === 0 ? 'Dot ball' : `${r} run${r === 1 ? '' : 's'}`}
            >
              {r === 0 ? '•' : r}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">Extras</p>
        <div className="grid grid-cols-4 gap-2">
          {EXTRA_DEFS.map((ex) => (
            <Button key={ex.key} disabled={!canScore} variant="warn" size="md" onClick={() => setExtraSheet(ex)}>
              {ex.short}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-ink/[0.06] pt-3 dark:border-white/[0.06]">
        <Button disabled={!canScore} variant="wicket" size="lg" onClick={onWicket}>
          Wicket
        </Button>
        <Button variant="outline" size="lg" onClick={() => setManualOpen(true)}>
          Manual Edit
        </Button>
        <Button variant="secondary" disabled={!canUndo} onClick={onUndo}>
          ↺ Undo
        </Button>
        <Button variant="secondary" disabled={!canRedo} onClick={onRedo}>
          ↻ Redo
        </Button>
      </div>

      <BottomSheet open={!!extraSheet} onClose={() => setExtraSheet(null)} title={`${extraSheet?.label ?? ''} — additional runs?`} maxWidth="max-w-sm">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <Button key={n} variant="secondary" size="md" className="font-tabular" onClick={() => submitExtra(n)}>
              {n}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          {extraSheet?.key === 'wide' && 'The +1 wide penalty is added automatically — pick any runs the batsmen ran.'}
          {extraSheet?.key === 'no_ball' && 'The +1 no-ball penalty is added automatically — pick any runs scored off the bat.'}
          {(extraSheet?.key === 'bye' || extraSheet?.key === 'leg_bye') && 'Pick the runs taken.'}
        </p>
      </BottomSheet>

      <BottomSheet open={manualOpen} onClose={() => setManualOpen(false)} title="Manual score edit" maxWidth="max-w-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">Runs</label>
            <input
              type="number"
              min={0}
              max={36}
              value={manualRuns}
              onChange={(e) => setManualRuns(e.target.value)}
              className="h-12 w-full rounded-xl border border-ink/10 bg-surface-soft px-3.5 font-tabular text-lg outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-surface-darkmuted dark:text-ink-dark"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink dark:text-ink-dark">Type</label>
            <select
              value={manualExtra}
              onChange={(e) => setManualExtra(e.target.value)}
              className="h-12 w-full rounded-xl border border-ink/10 bg-surface-soft px-3.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-surface-darkmuted dark:text-ink-dark"
            >
              <option value="">Normal delivery (bat runs)</option>
              <option value="bye">Bye</option>
              <option value="leg_bye">Leg Bye</option>
              <option value="penalty">Penalty runs</option>
            </select>
          </div>
          <Button className="w-full" onClick={submitManual}>
            Add ball
          </Button>
        </div>
      </BottomSheet>
    </Card>
  );
}