export type GuessResult = 'too_high' | 'too_low' | 'correct';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const MIN_NUMBER = 0;
export const MAX_NUMBER = 100;
export const MAX_ATTEMPTS = 6;

export interface DifficultyConfig {
  label: string;
  maxNumber: number;
  attempts: number;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    maxNumber: 50,
    attempts: 8,
    description: 'Range 0-50, 8 attempts',
  },
  medium: {
    label: 'Medium',
    maxNumber: 100,
    attempts: 6,
    description: 'Range 0-100, 6 attempts',
  },
  hard: {
    label: 'Hard',
    maxNumber: 200,
    attempts: 5,
    description: 'Range 0-200, 5 attempts',
  },
};

export function generateSecretNumber(
  min: number = MIN_NUMBER,
  max: number = MAX_NUMBER
): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function evaluateGuess(guess: number, secret: number): GuessResult {
  if (guess > secret) return 'too_high';
  if (guess < secret) return 'too_low';
  return 'correct';
}

export function isValidGuess(
  input: string,
  min: number,
  max: number
): boolean {
  const num = parseInt(input, 10);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

export function compareVersions(current: string, latest: string): number {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const a = currentParts[i] || 0;
    const b = latestParts[i] || 0;
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}
