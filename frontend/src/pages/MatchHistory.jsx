import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, Badge, SectionTitle, EmptyState } from '../components/ui/Surface';
import { TextField } from '../components/ui/Field';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useMatchActions } from '../context/MatchContext';
import { useSnackbar } from '../context/SnackbarContext';
import { deleteFromHistory, duplicateMatch, getHistory, saveToHistory } from '../utils/matchHistory';

export default function MatchHistory() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState(() => getHistory());
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();
  const { loadMatch } = useMatchActions();
  const snackbar = useSnackbar();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((m) =>
      [m.meta?.name, m.meta?.tournament, m.teams?.A?.name, m.teams?.B?.name, m.meta?.venue].filter(Boolean).some((s) => s.toLowerCase().includes(q))
    );
  }, [history, query]);

  const handleResume = (match) => {
    loadMatch(match);
    navigate(match.status === 'completed' ? `/scorecard/${match.id}` : '/live');
  };

  const handleDuplicate = (match) => {
    const copy = duplicateMatch(match);
    const next = saveToHistory(copy);
    setHistory(next);
    snackbar.show('Match duplicated', { tone: 'success' });
  };

  const handleDelete = (id) => {
    const next = deleteFromHistory(id);
    setHistory(next);
    snackbar.show('Match deleted');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <SectionTitle eyebrow="Scorebook" title="Match history" subtitle="Every match you've scored, saved to this device." />

      <TextField
        placeholder="Search by team, tournament, or venue…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-5"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={history.length === 0 ? 'No matches yet' : 'No matches match your search'}
          subtitle={history.length === 0 ? 'Create your first match to see it here.' : 'Try a different search term.'}
          action={
            history.length === 0 && (
              <Button size="sm" onClick={() => navigate('/create')}>
                Create a match
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-bold text-ink dark:text-ink-dark">{m.meta?.name}</p>
                    <Badge tone={m.status === 'completed' ? 'success' : m.status === 'live' ? 'brand' : 'neutral'}>
                      {m.status === 'completed' ? 'Completed' : m.status === 'live' ? 'Live' : 'Setup'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft dark:text-ink-darksoft">
                    {m.teams?.A?.name} vs {m.teams?.B?.name} · {m.meta?.venue || 'No venue'} · {m.meta?.date}
                  </p>
                  {m.result?.text && <p className="mt-1 text-sm font-semibold text-success-600 dark:text-success-400">{m.result.text}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button size="sm" variant={m.status === 'completed' ? 'outline' : 'primary'} onClick={() => handleResume(m)}>
                    {m.status === 'completed' ? 'View' : 'Resume'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDuplicate(m)}>
                    Duplicate
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setToDelete(m.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => handleDelete(toDelete)}
        title="Delete this match?"
        description="This will permanently remove the match and its scorecard from this device."
        confirmLabel="Delete"
      />
    </div>
  );
}