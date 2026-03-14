# Guess the Number

A sleek, modern number guessing game built with React Native and Expo. Try to guess the secret number between 0 and 100 in just 6 attempts!

## Screenshots

The app features a deep indigo gradient background, glassmorphic keypad buttons, an animated range indicator, and smooth animations throughout.

## Features

- Custom numeric keypad with spring press animations
- Animated range indicator that narrows with each guess
- Heart-based attempts counter with pulse animation
- Animated splash screen on launch
- Success and game-over screens with entrance animations
- 3-dot menu with: New Game, How to Play, Rate Us, Feedback, About
- Star-rating modal (opens Play Store / App Store)
- Feedback form with character counter
- Force update mechanism via remote config
- Fully responsive across phones and tablets
- Production-quality TypeScript codebase with unit tests

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | React Native 0.83 via Expo SDK 55 |
| Language      | TypeScript (strict mode)          |
| State         | Zustand                           |
| Animations    | React Native Reanimated           |
| Responsive    | react-native-responsive-screen    |
| Icons         | @expo/vector-icons                |
| Testing       | Jest + ts-jest                    |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for development)

### Install and Run

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run unit tests
npm test
```

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build --platform android --profile preview

# Build Android AAB (for Play Store)
eas build --platform android --profile production
```

## Project Structure

```
src/
  components/       UI components
    AnimatedSplash    Animated launch screen
    Header            Top bar with menu
    RangeIndicator    Animated range slider
    AttemptsIndicator Heart counter with dot indicators
    GuessInput        Number display + backspace
    NumericKeypad     3x4 keypad grid
    KeypadButton      Individual animated button
    SuccessOverlay    Win/lose result screen
    ForceUpdateModal  Blocking update prompt
  screens/
    GameScreen        Main game screen
  store/
    gameStore         Zustand state management
  hooks/
    useForceUpdate    Version check hook
  utils/
    gameUtils         Pure game logic functions
  services/
    configService     Remote config fetcher
  constants/
    colors            Theme color palette
    layout            Responsive sizing helpers
  __tests__/
    gameUtils.test    Game logic tests
    gameStore.test    Store action tests
```

## Game Rules

1. A random secret number between 0-100 is generated
2. Enter your guess using the custom keypad and press Enter
3. If your guess is too high, the max range narrows
4. If your guess is too low, the min range narrows
5. You have 6 attempts to find the correct number
6. The range indicator visually shows the narrowing search space

## License

MIT
