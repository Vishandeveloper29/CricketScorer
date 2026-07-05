import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { SelectField } from '../ui/Field';

export default function BatsmanMenuDialog({ open, onClose, batsmanName, battingSquad, outBatsmenNames, otherBatsman, onRetire, onSwap }) {
  const [mode, setMode] = useState(null); // 'retired_hurt' | 'retired_out'
  const [newBatsman, setNewBatsman] = useState('');

  const available = battingSquad.filter((p) => !outBatsmenNames.includes(p) && p !== batsmanName && p !== otherBatsman);

  const reset = () => {
    setMode(null);
    setNewBatsman('');
  };

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={batsmanName || 'Batsman'}
      maxWidth="max-w-sm"
    >
      {!mode ? (
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start" onClick={onSwap}>
            Swap strike manually
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setMode('retired_hurt')}>
            Retired hurt
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setMode('retired_out')}>
            Retired out
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <SelectField label="Next batsman" value={newBatsman} onChange={(e) => setNewBatsman(e.target.value)}>
            <option value="">Select player</option>
            {available.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
          <Button
            className="w-full"
            disabled={!newBatsman}
            onClick={() => {
              onRetire(mode, newBatsman);
              reset();
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}