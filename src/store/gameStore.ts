import { create } from 'zustand';
import {
  generateSecretNumber,
  evaluateGuess,
  MIN_NUMBER,
  DIFFICULTY_CONFIGS,
  type Difficulty,
} from '../utils/gameUtils';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  secretNumber: number;
  minRange: number;
  maxRange: number;
  attempts: number;
  maxAttempts: number;
  currentInput: string;
  gameStatus: GameStatus;
  lastGuess: number | null;
  difficulty: Difficulty;
}

export interface GameActions {
  pressDigit: (digit: string) => void;
  pressBackspace: () => void;
  submitGuess: () => void;
  resetGame: () => void;
  setDifficulty: (d: Difficulty) => void;
}

export type GameStore = GameState & GameActions;

function createInitialState(difficulty: Difficulty = 'medium'): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  return {
    secretNumber: generateSecretNumber(MIN_NUMBER, config.maxNumber),
    minRange: MIN_NUMBER,
    maxRange: config.maxNumber,
    attempts: config.attempts,
    maxAttempts: config.attempts,
    currentInput: '',
    gameStatus: 'playing',
    lastGuess: null,
    difficulty,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  pressDigit: (digit: string) => {
    const { currentInput, gameStatus, difficulty } = get();
    if (gameStatus !== 'playing') return;
    if (currentInput.length >= 3) return;

    const maxNum = DIFFICULTY_CONFIGS[difficulty].maxNumber;
    const newInput = currentInput + digit;
    const num = parseInt(newInput, 10);
    if (num > maxNum) return;

    set({ currentInput: newInput });
  },

  pressBackspace: () => {
    const { currentInput, gameStatus } = get();
    if (gameStatus !== 'playing') return;
    set({ currentInput: currentInput.slice(0, -1) });
  },

  submitGuess: () => {
    const { currentInput, secretNumber, attempts, gameStatus, minRange, maxRange } = get();
    if (gameStatus !== 'playing') return;
    if (currentInput === '') return;

    const guess = parseInt(currentInput, 10);
    if (isNaN(guess)) return;

    const result = evaluateGuess(guess, secretNumber);
    const newAttempts = attempts - 1;

    if (result === 'correct') {
      set({
        currentInput: '',
        attempts: newAttempts,
        gameStatus: 'won',
        lastGuess: guess,
      });
      return;
    }

    if (newAttempts <= 0) {
      set({
        currentInput: '',
        attempts: 0,
        gameStatus: 'lost',
        lastGuess: guess,
        minRange: result === 'too_low' ? Math.max(minRange, guess) : minRange,
        maxRange: result === 'too_high' ? Math.min(maxRange, guess) : maxRange,
      });
      return;
    }

    set({
      currentInput: '',
      attempts: newAttempts,
      lastGuess: guess,
      minRange: result === 'too_low' ? Math.max(minRange, guess) : minRange,
      maxRange: result === 'too_high' ? Math.min(maxRange, guess) : maxRange,
    });
  },

  resetGame: () => {
    const { difficulty } = get();
    set(createInitialState(difficulty));
  },

  setDifficulty: (d: Difficulty) => {
    set(createInitialState(d));
  },
}));
