import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { STORAGE_KEYS } from '../data/constants';
import { computeInnings } from '../utils/cricketEngine';

const MatchStateContext = createContext(null);
const MatchDispatchContext = createContext(null);

function newInnings(battingTeam, bowlingTeam) {
  return {
    battingTeam,
    bowlingTeam,
    log: [],
    redoStack: [],
    openingStriker: null,
    openingNonStriker: null,
    openingBowler: null,
    started: false,
    closed: false,
    target: null,
    declaredResult: null,
  };
}

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CURRENT_MATCH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_MATCH': {
      const { meta, teams, toss } = action.payload;
      const firstBats = toss.decision === 'bat' ? toss.winner : toss.winner === 'A' ? 'B' : 'A';
      const secondBats = firstBats === 'A' ? 'B' : 'A';
      return {
        id: action.payload.id,
        meta,
        teams,
        toss,
        status: 'setup',
        currentInningsIndex: 0,
        innings: [newInnings(firstBats, secondBats)],
        result: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    case 'LOAD_MATCH':
      return action.payload;
    case 'CLEAR_MATCH':
      return null;
    case 'START_INNINGS': {
      if (!state) return state;
      const innings = [...state.innings];
      const idx = state.currentInningsIndex;
      innings[idx] = {
        ...innings[idx],
        openingStriker: action.payload.striker,
        openingNonStriker: action.payload.nonStriker,
        openingBowler: action.payload.bowler,
        started: true,
      };
      return { ...state, innings, status: 'live', updatedAt: Date.now() };
    }
    case 'ADD_LOG_ENTRY': {
      if (!state) return state;
      const innings = [...state.innings];
      const idx = state.currentInningsIndex;
      innings[idx] = {
        ...innings[idx],
        log: [...innings[idx].log, action.payload],
        redoStack: [],
      };
      return { ...state, innings, updatedAt: Date.now() };
    }
    case 'UNDO': {
      if (!state) return state;
      const innings = [...state.innings];
      const idx = state.currentInningsIndex;
      const cur = innings[idx];
      if (cur.log.length === 0) return state;
      const log = [...cur.log];
      const removed = log.pop();
      innings[idx] = { ...cur, log, redoStack: [removed, ...cur.redoStack] };
      return { ...state, innings, updatedAt: Date.now() };
    }
    case 'REDO': {
      if (!state) return state;
      const innings = [...state.innings];
      const idx = state.currentInningsIndex;
      const cur = innings[idx];
      if (cur.redoStack.length === 0) return state;
      const [next, ...rest] = cur.redoStack;
      innings[idx] = { ...cur, log: [...cur.log, next], redoStack: rest };
      return { ...state, innings, updatedAt: Date.now() };
    }
    case 'CLOSE_INNINGS': {
      if (!state) return state;
      const innings = [...state.innings];
      const idx = state.currentInningsIndex;
      const target = action.payload?.target ?? null;
      innings[idx] = { ...innings[idx], closed: true, target: idx === 0 ? target : innings[idx].target };
      const isLastPossible = idx >= 1;
      let nextIndex = state.currentInningsIndex;
      let status = state.status;
      if (!isLastPossible) {
        const nextBats = innings[idx].bowlingTeam;
        const nextBowls = innings[idx].battingTeam;
        innings.push(newInnings(nextBats, nextBowls));
        innings[idx + 1].target = target;
        nextIndex = idx + 1;
        status = 'live';
      }
      return { ...state, innings, currentInningsIndex: nextIndex, status, updatedAt: Date.now() };
    }
    case 'SET_MATCH_RESULT': {
      if (!state) return state;
      return { ...state, status: 'completed', result: action.payload, updatedAt: Date.now() };
    }
    case 'UPDATE_META': {
      if (!state) return state;
      return { ...state, meta: { ...state.meta, ...action.payload }, updatedAt: Date.now() };
    }
    default:
      return state;
  }
}

export function MatchProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadInitial);

  useEffect(() => {
    try {
      if (state) {
        window.localStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify(state));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.CURRENT_MATCH);
      }
    } catch {
      /* ignore quota errors */
    }
  }, [state]);

  return (
    <MatchStateContext.Provider value={state}>
      <MatchDispatchContext.Provider value={dispatch}>{children}</MatchDispatchContext.Provider>
    </MatchStateContext.Provider>
  );
}

export function useMatchState() {
  return useContext(MatchStateContext);
}

export function useMatchDispatch() {
  return useContext(MatchDispatchContext);
}

/** Derived, memoized view of the current innings — recomputed from the log each time it changes. */
export function useCurrentInnings() {
  const match = useMatchState();
  return useMemo(() => {
    if (!match) return null;
    const idx = match.currentInningsIndex;
    const inn = match.innings[idx];
    if (!inn || !inn.started) return { raw: inn, computed: null, index: idx };
    const computed = computeInnings(inn.log, {
      ballsPerOver: match.meta.ballsPerOver,
      openingStriker: inn.openingStriker,
      openingNonStriker: inn.openingNonStriker,
      openingBowler: inn.openingBowler,
    });
    return { raw: inn, computed, index: idx };
  }, [match]);
}

export function useInningsByIndex(idx) {
  const match = useMatchState();
  return useMemo(() => {
    if (!match) return null;
    const inn = match.innings[idx];
    if (!inn || !inn.started) return { raw: inn, computed: null, index: idx };
    const computed = computeInnings(inn.log, {
      ballsPerOver: match.meta.ballsPerOver,
      openingStriker: inn.openingStriker,
      openingNonStriker: inn.openingNonStriker,
      openingBowler: inn.openingBowler,
    });
    return { raw: inn, computed, index: idx };
  }, [match, idx]);
}

export function useMatchActions() {
  const dispatch = useMatchDispatch();

  return useMemo(
    () => ({
      createMatch: (payload) => dispatch({ type: 'CREATE_MATCH', payload }),
      loadMatch: (match) => dispatch({ type: 'LOAD_MATCH', payload: match }),
      clearMatch: () => dispatch({ type: 'CLEAR_MATCH' }),
      startInnings: (payload) => dispatch({ type: 'START_INNINGS', payload }),
      addBall: (entry) => dispatch({ type: 'ADD_LOG_ENTRY', payload: { type: 'ball', timestamp: Date.now(), ...entry } }),
      swapStrike: () => dispatch({ type: 'ADD_LOG_ENTRY', payload: { type: 'swap', timestamp: Date.now() } }),
      changeBowler: (bowler) =>
        dispatch({ type: 'ADD_LOG_ENTRY', payload: { type: 'bowler_change', bowler, timestamp: Date.now() } }),
      retireBatsman: (batsman, mode, newBatsman) =>
        dispatch({ type: 'ADD_LOG_ENTRY', payload: { type: 'retire', batsman, mode, newBatsman, timestamp: Date.now() } }),
      undo: () => dispatch({ type: 'UNDO' }),
      redo: () => dispatch({ type: 'REDO' }),
      closeInnings: (target) => dispatch({ type: 'CLOSE_INNINGS', payload: { target } }),
      setMatchResult: (result) => dispatch({ type: 'SET_MATCH_RESULT', payload: result }),
      updateMeta: (payload) => dispatch({ type: 'UPDATE_META', payload }),
    }),
    [dispatch]
  );
}