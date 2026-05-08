import type { QuizResult } from './scoring';

const KEYS = {
  NICKNAME: 'kgti_nickname',
  MAIN_ANSWERS: 'kgti_main_answers',
  HIDDEN_ANSWERS: 'kgti_hidden_answers',
  LATEST_RESULT: 'kgti_latest_result',
  HISTORY: 'kgti_history',
} as const;

export function saveNickname(name: string): void {
  localStorage.setItem(KEYS.NICKNAME, name);
}

export function getNickname(): string | null {
  return localStorage.getItem(KEYS.NICKNAME);
}

export function saveAnswers(main: Record<string, number>, hidden: Record<string, number>): void {
  localStorage.setItem(KEYS.MAIN_ANSWERS, JSON.stringify(main));
  localStorage.setItem(KEYS.HIDDEN_ANSWERS, JSON.stringify(hidden));
}

export function getAnswers(): {
  main: Record<string, number>;
  hidden: Record<string, number>;
} | null {
  const main = localStorage.getItem(KEYS.MAIN_ANSWERS);
  const hidden = localStorage.getItem(KEYS.HIDDEN_ANSWERS);
  if (!main) return null;
  return {
    main: JSON.parse(main),
    hidden: hidden ? JSON.parse(hidden) : {},
  };
}

export function saveResult(result: QuizResult): void {
  localStorage.setItem(KEYS.LATEST_RESULT, JSON.stringify(result));
  // Add to history
  const history = getHistory();
  history.unshift({
    ...result,
    timestamp: Date.now(),
  });
  // Keep last 20
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 20)));
}

export function getLatestResult(): QuizResult | null {
  const raw = localStorage.getItem(KEYS.LATEST_RESULT);
  if (!raw) return null;
  return JSON.parse(raw);
}

export interface HistoryEntry extends QuizResult {
  timestamp: number;
}

export function getHistory(): HistoryEntry[] {
  const raw = localStorage.getItem(KEYS.HISTORY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function clearAnswers(): void {
  localStorage.removeItem(KEYS.MAIN_ANSWERS);
  localStorage.removeItem(KEYS.HIDDEN_ANSWERS);
}
