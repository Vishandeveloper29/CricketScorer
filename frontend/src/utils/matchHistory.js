import { STORAGE_KEYS } from '../data/constants';

export function getHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.MATCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(match) {
  const history = getHistory();
  const idx = history.findIndex((m) => m.id === match.id);
  if (idx >= 0) history[idx] = match;
  else history.unshift(match);
  try {
    window.localStorage.setItem(STORAGE_KEYS.MATCH_HISTORY, JSON.stringify(history));
  } catch {
    /* quota exceeded — ignore, in-memory state still valid for this session */
  }
  return history;
}

export function deleteFromHistory(id) {
  const history = getHistory().filter((m) => m.id !== id);
  window.localStorage.setItem(STORAGE_KEYS.MATCH_HISTORY, JSON.stringify(history));
  return history;
}

export function duplicateMatch(match) {
  const copy = {
    ...match,
    id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'setup',
    currentInningsIndex: 0,
    innings: match.innings.map((inn) => ({ ...inn, log: [], redoStack: [], started: false, closed: false, target: null })),
    result: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    meta: { ...match.meta, name: `${match.meta.name} (copy)` },
  };
  return copy;
}