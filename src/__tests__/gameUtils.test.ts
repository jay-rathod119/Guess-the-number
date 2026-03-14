import {
  generateSecretNumber,
  evaluateGuess,
  isValidGuess,
  compareVersions,
  MIN_NUMBER,
  MAX_NUMBER,
} from '../utils/gameUtils';

describe('generateSecretNumber', () => {
  it('returns a number between MIN and MAX inclusive', () => {
    for (let i = 0; i < 100; i++) {
      const num = generateSecretNumber();
      expect(num).toBeGreaterThanOrEqual(MIN_NUMBER);
      expect(num).toBeLessThanOrEqual(MAX_NUMBER);
    }
  });

  it('returns an integer', () => {
    for (let i = 0; i < 50; i++) {
      const num = generateSecretNumber();
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it('respects custom min/max parameters', () => {
    for (let i = 0; i < 50; i++) {
      const num = generateSecretNumber(10, 20);
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(20);
    }
  });
});

describe('evaluateGuess', () => {
  it('returns "correct" when guess equals secret', () => {
    expect(evaluateGuess(42, 42)).toBe('correct');
  });

  it('returns "too_high" when guess is above secret', () => {
    expect(evaluateGuess(50, 30)).toBe('too_high');
  });

  it('returns "too_low" when guess is below secret', () => {
    expect(evaluateGuess(10, 30)).toBe('too_low');
  });

  it('handles boundary: guess is 0, secret is 0', () => {
    expect(evaluateGuess(0, 0)).toBe('correct');
  });

  it('handles boundary: guess is 100, secret is 100', () => {
    expect(evaluateGuess(100, 100)).toBe('correct');
  });
});

describe('isValidGuess', () => {
  it('returns true for a valid numeric string within range', () => {
    expect(isValidGuess('50', 0, 100)).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidGuess('', 0, 100)).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    expect(isValidGuess('abc', 0, 100)).toBe(false);
  });

  it('returns false for number below min', () => {
    expect(isValidGuess('5', 10, 100)).toBe(false);
  });

  it('returns false for number above max', () => {
    expect(isValidGuess('150', 0, 100)).toBe(false);
  });

  it('returns true for boundary values', () => {
    expect(isValidGuess('0', 0, 100)).toBe(true);
    expect(isValidGuess('100', 0, 100)).toBe(true);
  });
});

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('returns -1 when current is lower', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
    expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
  });

  it('returns 1 when current is higher', () => {
    expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
    expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
  });

  it('handles different version lengths', () => {
    expect(compareVersions('1.0', '1.0.1')).toBe(-1);
    expect(compareVersions('1.0.1', '1.0')).toBe(1);
  });
});
