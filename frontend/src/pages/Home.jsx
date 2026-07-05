import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, Badge, SectionTitle, EmptyState } from '../components/ui/Surface';
import { useMatchState } from '../context/MatchContext';
import { getHistory } from '../utils/matchHistory';

const FEATURES = [
  { title: 'Ball-by-ball scoring', desc: 'Every dot, run, wide, no-ball and dismissal tracked with full undo/redo.', icon: '🏏' },
  { title: 'Live scoreboard', desc: 'Run rate, required rate, partnerships and projected totals update instantly.', icon: '📊' },
  { title: 'Complete scorecards', desc: 'Batting card, bowling figures, fall of wickets and extras — automatically.', icon: '📋' },
  { title: 'Works offline', desc: 'Everything is saved to this device. No sign-up, no internet required.', icon: '📴' },
  { title: 'Built for one hand', desc: 'Big thumb-friendly buttons designed for scoring mid-over, mid-match.', icon: '👍' },
  { title: 'Every dismissal', desc: 'Bowled to obstructing the field — every mode of dismissal is supported.', icon: '🎯' },
];

function MatchCard({ match, onOpen }) {
  const inningsCount = match.innings?.filter((i) => i.started).length || 0;
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-display font-bold text-ink dark:text-ink-dark">{match.meta?.name || 'Untitled match'}</p>
          <Badge tone={match.status === 'completed' ? 'success' : match.status === 'live' ? 'brand' : 'neutral'}>
            {match.status === 'completed' ? 'Completed' : match.status === 'live' ? 'Live' : 'Setup'}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-sm text-ink-soft dark:text-ink-darksoft">
          {match.teams?.A?.name} vs {match.teams?.B?.name} · {match.meta?.overs} overs
        </p>
      </div>
      <Button size="sm" variant={match.status === 'completed' ? 'outline' : 'primary'} onClick={() => onOpen(match)}>
        {match.status === 'completed' ? 'View' : 'Resume'}
      </Button>
    </Card>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const currentMatch = useMatchState();
  const history = useMemo(() => getHistory().slice(0, 4), [currentMatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-10 pb-8 sm:px-6 sm:pt-16">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-brand-100 blur-3xl dark:bg-brand-500/10" />
        <div className="pointer-events-none absolute top-40 left-[-15%] h-72 w-72 rounded-full bg-success-50 blur-3xl dark:bg-success-500/5" />
        <div className="relative mx-auto max-w-6xl">
          <Badge tone="brand" className="mb-4">
            No sign-up · No servers · 100% on your device
          </Badge>
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink dark:text-ink-dark sm:text-5xl">
            Score cricket like a pro, from your pocket.
          </h1>
          <p className="mt-4 max-w-lg text-base text-ink-soft dark:text-ink-darksoft sm:text-lg">
            Built for street cricket, box cricket, society matches and school tournaments — a clean, fast scorer
            that never needs a connection.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/create')}>
              Quick Start Match
            </Button>
            {currentMatch && currentMatch.status !== 'completed' && (
              <Button size="lg" variant="secondary" onClick={() => navigate('/live')}>
                Continue Last Match
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Recent matches */}
      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-6">
        <SectionTitle
          eyebrow="Scorebook"
          title="Recent matches"
          action={
            <Link to="/history" className="text-sm font-semibold text-brand-500 hover:text-brand-600">
              View all →
            </Link>
          }
        />
        {history.length === 0 ? (
          <EmptyState
            title="No matches yet"
            subtitle="Start your first match and it'll show up here, saved automatically to this device."
            action={
              <Button size="sm" onClick={() => navigate('/create')}>
                Create a match
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {history.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onOpen={(match) => navigate(match.status === 'completed' ? `/scorecard/${match.id}` : '/live')}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <SectionTitle eyebrow="Why Crease" title="Everything a scorer needs, nothing it doesn't" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-lg dark:bg-surface-darkmuted">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-ink dark:text-ink-dark">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-soft dark:text-ink-darksoft">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <Card className="overflow-hidden p-6 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-500">About Crease</p>
              <h2 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
                Made for the scorer standing at square leg, not a broadcast truck.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-ink-darksoft">
                Crease is a fully static scoring app — everything runs in your browser and every match is stored
                privately on your device with LocalStorage. No accounts, no cloud, no dependency on signal at the
                ground. Whether it's a box cricket league, a school tournament, or a Sunday society match, Crease
                gives you a scoreboard as good as the professionals use.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['0', 'Setup steps'],
                ['100%', 'Offline ready'],
                ['∞', 'Matches stored'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl bg-surface-soft p-4 dark:bg-surface-darkmuted">
                  <p className="font-display text-2xl font-extrabold text-brand-500">{n}</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft dark:text-ink-darksoft">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-ink/[0.06] pt-6 text-sm text-ink-faint dark:border-white/[0.06] sm:flex-row">
          <p>© {new Date().getFullYear()} Crease. Built for the love of the game.</p>
          <div className="flex gap-4">
            <Link to="/settings" className="hover:text-ink-soft dark:hover:text-ink-darksoft">
              Settings
            </Link>
            <Link to="/history" className="hover:text-ink-soft dark:hover:text-ink-darksoft">
              Match history
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}