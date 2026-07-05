import { useState } from 'react';
import { Card, SectionTitle } from '../components/ui/Surface';
import { SegmentedControl, Stepper } from '../components/ui/Field';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useSettings } from '../context/SettingsContext';
import { useSnackbar } from '../context/SnackbarContext';
import { STORAGE_KEYS } from '../data/constants';

export default function Settings() {
  const { settings, setTheme, setBallsPerOver, resetSettings } = useSettings();
  const snackbar = useSnackbar();
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleResetAll = () => {
    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    resetSettings();
    snackbar.show('All data cleared', { tone: 'success' });
    setTimeout(() => window.location.assign('/'), 600);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <SectionTitle eyebrow="Preferences" title="Settings" />

      <Card className="mb-4 space-y-3 p-5">
        <h3 className="font-display font-bold text-ink dark:text-ink-dark">Appearance</h3>
        <SegmentedControl
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
          value={settings.theme}
          onChange={setTheme}
        />
      </Card>

      <Card className="mb-4 space-y-3 p-5">
        <h3 className="font-display font-bold text-ink dark:text-ink-dark">Default balls per over</h3>
        <p className="text-sm text-ink-soft dark:text-ink-darksoft">Used as the default when creating a new match. Existing matches keep their own setting.</p>
        <Stepper value={settings.ballsPerOver} onChange={setBallsPerOver} min={4} max={10} />
      </Card>

      <Card className="space-y-3 border-wicket-500/20 p-5">
        <h3 className="font-display font-bold text-wicket-600 dark:text-wicket-400">Danger zone</h3>
        <p className="text-sm text-ink-soft dark:text-ink-darksoft">
          Permanently deletes every match, team, and preference stored in this browser. This cannot be undone.
        </p>
        <Button variant="wicket" onClick={() => setResetConfirm(true)}>
          Reset all data
        </Button>
      </Card>

      <ConfirmDialog
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleResetAll}
        title="Reset all data?"
        description="Every match, team, and preference stored on this device will be permanently deleted."
        confirmLabel="Reset everything"
      />
    </div>
  );
}