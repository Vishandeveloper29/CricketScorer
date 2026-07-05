import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { SelectField } from '../ui/Field';

export default function StartInningsDialog({ open, battingPlayers, bowlingPlayers, battingTeamName, bowlingTeamName, onStart }) {
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');

  const canStart = striker && nonStriker && bowler && striker !== nonStriker;

  return (
    <BottomSheet open={open} title="Start innings" maxWidth="max-w-md">
      <p className="mb-4 text-sm text-ink-soft dark:text-ink-darksoft">
        {battingTeamName} are batting. Choose the opening pair and {bowlingTeamName}'s first bowler.
      </p>
      <div className="space-y-4">
        <SelectField label="Striker (on strike)" value={striker} onChange={(e) => setStriker(e.target.value)}>
          <option value="">Select player</option>
          {battingPlayers.map((p) => (
            <option key={p} value={p} disabled={p === nonStriker}>
              {p}
            </option>
          ))}
        </SelectField>
        <SelectField label="Non-striker" value={nonStriker} onChange={(e) => setNonStriker(e.target.value)}>
          <option value="">Select player</option>
          {battingPlayers.map((p) => (
            <option key={p} value={p} disabled={p === striker}>
              {p}
            </option>
          ))}
        </SelectField>
        <SelectField label="Opening bowler" value={bowler} onChange={(e) => setBowler(e.target.value)}>
          <option value="">Select player</option>
          {bowlingPlayers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </SelectField>
        <Button className="w-full" size="lg" disabled={!canStart} onClick={() => onStart({ striker, nonStriker, bowler })}>
          Start innings
        </Button>
      </div>
    </BottomSheet>
  );
}