export const STORAGE_KEYS = {
  CURRENT_MATCH: 'cs_current_match',
  MATCH_HISTORY: 'cs_match_history',
  SETTINGS: 'cs_settings',
  TEAMS: 'cs_teams',
};

export const DISMISSALS = [
  { id: 'bowled', label: 'Bowled', needsFielder: false, needsBowlerCredit: true },
  { id: 'caught', label: 'Caught', needsFielder: true, needsBowlerCredit: true },
  { id: 'lbw', label: 'LBW', needsFielder: false, needsBowlerCredit: true },
  { id: 'run_out', label: 'Run Out', needsFielder: true, needsBowlerCredit: false },
  { id: 'stumped', label: 'Stumped', needsFielder: true, needsBowlerCredit: true },
  { id: 'hit_wicket', label: 'Hit Wicket', needsFielder: false, needsBowlerCredit: true },
  { id: 'retired_out', label: 'Retired Out', needsFielder: false, needsBowlerCredit: false },
  { id: 'retired_hurt', label: 'Retired Hurt', needsFielder: false, needsBowlerCredit: false, notOut: true },
  { id: 'timed_out', label: 'Timed Out', needsFielder: false, needsBowlerCredit: false },
  { id: 'obstructing', label: 'Obstructing the Field', needsFielder: false, needsBowlerCredit: false },
  { id: 'hit_twice', label: 'Hit Ball Twice', needsFielder: false, needsBowlerCredit: false },
  { id: 'handled_ball', label: 'Handled Ball (Legacy)', needsFielder: false, needsBowlerCredit: false },
];

export const EXTRA_TYPES = {
  WIDE: 'wide',
  NO_BALL: 'no_ball',
  BYE: 'bye',
  LEG_BYE: 'leg_bye',
  PENALTY: 'penalty',
};

export const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  ballsPerOver: 6,
};

export const MATCH_RESULT_TYPES = {
  WIN_RUNS: 'win_runs',
  WIN_WICKETS: 'win_wickets',
  TIE: 'tie',
  SUPER_OVER: 'super_over',
  NO_RESULT: 'no_result',
};