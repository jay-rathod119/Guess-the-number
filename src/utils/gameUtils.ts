export type GuessResult = 'too_high' | 'too_low' | 'correct';

export const MIN_NUMBER = 0;
export const MAX_NUMBER = 100;
export const MAX_ATTEMPTS = 6;

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
