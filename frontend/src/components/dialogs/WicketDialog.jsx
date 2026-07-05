import { useMemo, useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { DISMISSALS } from '../../data/constants';
import { SelectField } from '../ui/Field';

export default function WicketDialog({ open, onClose, striker, nonStriker, battingSquad, bowlingSquad, outBatsmenNames, onConfirm }) {
  const [type, setType] = useState('');
  const [outWho, setOutWho] = useState('striker');
  const [fielder, setFielder] = useState('');
  const [newBatsman, setNewBatsman] = useState('');
  const [runsBeforeWicket, setRunsBeforeWicket] = useState(0);

  const dismissalDef = useMemo(() => DISMISSALS.find((d) => d.id === type), [type]);
  const availableBatsmen = battingSquad.filter((p) => !outBatsmenNames.includes(p) && p !== striker && p !== nonStriker);
  const needsNewBatsman = !dismissalDef?.notOut && availableBatsmen.length > 0;

  const reset = () => {
    setType('');
    setOutWho('striker');
    setFielder('');
    setNewBatsman('');
    setRunsBeforeWicket(0);
  };

  const canConfirm = type && (!needsNewBatsman || newBatsman) && (!dismissalDef?.needsFielder || fielder);

  const handleConfirm = () => {
    onConfirm({
      runs: Number(runsBeforeWicket) || 0,
      wicket: { type, outBatsman: outWho, fielder: fielder || null },
      newBatsman: needsNewBatsman ? newBatsman : null,
    });
    reset();
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Record wicket"
    >
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-semibold text-ink dark:text-ink-dark">How out?</p>
          <div className="grid grid-cols-2 gap-2">
            {DISMISSALS.map((d) => (
              <button
                key={d.id}
                onClick={() => setType(d.id)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition ${
                  type === d.id
                    ? 'border-wicket-500 bg-wicket-50 text-wicket-600 dark:bg-wicket-500/15 dark:text-wicket-400'
                    : 'border-ink/10 text-ink-soft hover:bg-ink/5 dark:border-white/10 dark:text-ink-darksoft dark:hover:bg-white/5'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {type === 'run_out' && (
          <SelectField label="Runs completed before the run out" value={runsBeforeWicket} onChange={(e) => setRunsBeforeWicket(e.target.value)}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </SelectField>
        )}

        {(type === 'run_out' || (dismissalDef && !dismissalDef.notOut && type !== 'bowled' && type !== 'lbw' && type !== 'hit_wicket')) && (
          <SelectField label="Batsman out" value={outWho} onChange={(e) => setOutWho(e.target.value)}>
            <option value="striker">{striker}</option>
            {nonStriker && <option value="nonStriker">{nonStriker}</option>}
          </SelectField>
        )}

        {dismissalDef?.needsFielder && (
          <SelectField label={type === 'stumped' ? 'Wicketkeeper' : 'Fielder'} value={fielder} onChange={(e) => setFielder(e.target.value)}>
            <option value="">Select player</option>
            {bowlingSquad.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
        )}

        {needsNewBatsman && (
          <SelectField label="Next batsman" value={newBatsman} onChange={(e) => setNewBatsman(e.target.value)}>
            <option value="">Select player</option>
            {availableBatsmen.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
        )}

        <Button className="w-full" variant="wicket" disabled={!canConfirm} onClick={handleConfirm}>
          Confirm wicket
        </Button>
      </div>
    </BottomSheet>
  );
}