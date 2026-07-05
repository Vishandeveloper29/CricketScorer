import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { SelectField } from '../ui/Field';

export default function ChangeBowlerDialog({ open, onClose, bowlingSquad, lastBowler, dismissable = true, onConfirm }) {
  const [bowler, setBowler] = useState('');

  return (
    <BottomSheet open={open} onClose={dismissable ? onClose : undefined} title="Select bowler">
      <p className="mb-4 text-sm text-ink-soft dark:text-ink-darksoft">
        {lastBowler ? `${lastBowler} cannot bowl consecutive overs.` : 'Choose who will bowl this over.'}
      </p>
      <div className="space-y-4">
        <SelectField label="Bowler" value={bowler} onChange={(e) => setBowler(e.target.value)}>
          <option value="">Select player</option>
          {bowlingSquad.map((p) => (
            <option key={p} value={p} disabled={p === lastBowler}>
              {p}
              {p === lastBowler ? ' (bowled last over)' : ''}
            </option>
          ))}
        </SelectField>
        <Button
          className="w-full"
          disabled={!bowler}
          onClick={() => {
            onConfirm(bowler);
            setBowler('');
          }}
        >
          Confirm bowler
        </Button>
      </div>
    </BottomSheet>
  );
}