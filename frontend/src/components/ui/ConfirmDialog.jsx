import BottomSheet from './BottomSheet';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', tone = 'wicket' }) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-soft dark:text-ink-darksoft">{description}</p>
      <div className="mt-5 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={tone}
          className="flex-1"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}