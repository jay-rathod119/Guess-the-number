import { useGameStore } from '../store/gameStore';
import { MAX_ATTEMPTS, MIN_NUMBER, MAX_NUMBER } from '../utils/gameUtils';

function resetStore() {
  useGameStore.getState().resetGame();
}

function setSecret(n: number) {
  useGameStore.setState({ secretNumber: n });
}

describe('gameStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('initial state', () => {
    it('starts with correct defaults', () => {
      const state = useGameStore.getState();
      expect(state.minRange).toBe(MIN_NUMBER);
      expect(state.maxRange).toBe(MAX_NUMBER);
      expect(state.attempts).toBe(MAX_ATTEMPTS);
      expect(state.maxAttempts).toBe(MAX_ATTEMPTS);
      expect(state.currentInput).toBe('');
      expect(state.gameStatus).toBe('playing');
      expect(state.lastGuess).toBeNull();
      expect(state.secretNumber).toBeGreaterThanOrEqual(MIN_NUMBER);
      expect(state.secretNumber).toBeLessThanOrEqual(MAX_NUMBER);
    });
  });

  describe('pressDigit', () => {
    it('appends a digit to currentInput', () => {
      const { pressDigit } = useGameStore.getState();
      pressDigit('5');
      expect(useGameStore.getState().currentInput).toBe('5');
    });

    it('builds multi-digit input', () => {
      const { pressDigit } = useGameStore.getState();
      pressDigit('4');
      pressDigit('7');
      expect(useGameStore.getState().currentInput).toBe('47');
    });

    it('limits input to 3 characters', () => {
      const { pressDigit } = useGameStore.getState();
      pressDigit('1');
      pressDigit('0');
      pressDigit('0');
      pressDigit('5');
      expect(useGameStore.getState().currentInput).toBe('100');
    });

    it('prevents input exceeding MAX_NUMBER', () => {
      const { pressDigit } = useGameStore.getState();
      pressDigit('9');
      pressDigit('9');
      pressDigit('9');
      expect(useGameStore.getState().currentInput).toBe('99');
    });

    it('does nothing when game is over', () => {
      useGameStore.setState({ gameStatus: 'won' });
      useGameStore.getState().pressDigit('5');
      expect(useGameStore.getState().currentInput).toBe('');
    });
  });

  describe('pressBackspace', () => {
    it('removes the last digit', () => {
      const store = useGameStore.getState();
      store.pressDigit('4');
      store.pressDigit('7');
      useGameStore.getState().pressBackspace();
      expect(useGameStore.getState().currentInput).toBe('4');
    });

    it('does nothing on empty input', () => {
      useGameStore.getState().pressBackspace();
      expect(useGameStore.getState().currentInput).toBe('');
    });

    it('does nothing when game is over', () => {
      useGameStore.setState({ currentInput: '5', gameStatus: 'lost' });
      useGameStore.getState().pressBackspace();
      expect(useGameStore.getState().currentInput).toBe('5');
    });
  });

  describe('submitGuess', () => {
    it('does nothing with empty input', () => {
      setSecret(50);
      useGameStore.getState().submitGuess();
      expect(useGameStore.getState().attempts).toBe(MAX_ATTEMPTS);
    });

    it('narrows maxRange when guess is too high', () => {
      setSecret(33);
      useGameStore.setState({ currentInput: '47' });
      useGameStore.getState().submitGuess();

      const state = useGameStore.getState();
      expect(state.maxRange).toBe(47);
      expect(state.minRange).toBe(MIN_NUMBER);
      expect(state.attempts).toBe(MAX_ATTEMPTS - 1);
      expect(state.currentInput).toBe('');
      expect(state.lastGuess).toBe(47);
    });

    it('narrows minRange when guess is too low', () => {
      setSecret(33);
      useGameStore.setState({ currentInput: '20' });
      useGameStore.getState().submitGuess();

      const state = useGameStore.getState();
      expect(state.minRange).toBe(20);
      expect(state.maxRange).toBe(MAX_NUMBER);
      expect(state.attempts).toBe(MAX_ATTEMPTS - 1);
    });

    it('sets gameStatus to "won" on correct guess', () => {
      setSecret(33);
      useGameStore.setState({ currentInput: '33' });
      useGameStore.getState().submitGuess();

      const state = useGameStore.getState();
      expect(state.gameStatus).toBe('won');
      expect(state.attempts).toBe(MAX_ATTEMPTS - 1);
    });

    it('sets gameStatus to "lost" when attempts run out', () => {
      setSecret(33);
      useGameStore.setState({ currentInput: '50', attempts: 1 });
      useGameStore.getState().submitGuess();

      const state = useGameStore.getState();
      expect(state.gameStatus).toBe('lost');
      expect(state.attempts).toBe(0);
    });

    it('plays through a full game sequence', () => {
      setSecret(33);

      useGameStore.setState({ currentInput: '47' });
      useGameStore.getState().submitGuess();
      expect(useGameStore.getState().maxRange).toBe(47);

      useGameStore.setState({ currentInput: '20' });
      useGameStore.getState().submitGuess();
      expect(useGameStore.getState().minRange).toBe(20);

      useGameStore.setState({ currentInput: '33' });
      useGameStore.getState().submitGuess();
      expect(useGameStore.getState().gameStatus).toBe('won');
      expect(useGameStore.getState().attempts).toBe(MAX_ATTEMPTS - 3);
    });
  });

  describe('resetGame', () => {
    it('resets all state to initial values', () => {
      setSecret(33);
      useGameStore.setState({
        currentInput: '47',
        minRange: 20,
        maxRange: 47,
        attempts: 2,
        gameStatus: 'won',
        lastGuess: 33,
      });

      useGameStore.getState().resetGame();

      const state = useGameStore.getState();
      expect(state.minRange).toBe(MIN_NUMBER);
      expect(state.maxRange).toBe(MAX_NUMBER);
      expect(state.attempts).toBe(MAX_ATTEMPTS);
      expect(state.currentInput).toBe('');
      expect(state.gameStatus).toBe('playing');
      expect(state.lastGuess).toBeNull();
    });

    it('generates a new secret number', () => {
      const firstSecret = useGameStore.getState().secretNumber;
      const secrets = new Set<number>();
      secrets.add(firstSecret);

      for (let i = 0; i < 20; i++) {
        useGameStore.getState().resetGame();
        secrets.add(useGameStore.getState().secretNumber);
      }

      expect(secrets.size).toBeGreaterThan(1);
    });
  });
});
