import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../components/Header';
import { RangeIndicator } from '../components/RangeIndicator';
import { AttemptsIndicator } from '../components/AttemptsIndicator';
import { GuessInput } from '../components/GuessInput';
import { NumericKeypad } from '../components/NumericKeypad';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';

export function GameScreen() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const secretNumber = useGameStore((s) => s.secretNumber);
  const minRange = useGameStore((s) => s.minRange);
  const maxRange = useGameStore((s) => s.maxRange);
  const attempts = useGameStore((s) => s.attempts);
  const maxAttempts = useGameStore((s) => s.maxAttempts);

  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

  const attemptsUsed = useMemo(
    () => maxAttempts - attempts,
    [maxAttempts, attempts]
  );

  return (
    <LinearGradient
      colors={[
        Colors.background.gradientStart,
        Colors.background.gradientMid,
        Colors.background.gradientEnd,
      ]}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Decorative background orbs */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />

      <Header />

      <View style={styles.content}>
        {isGameOver ? (
          <SuccessOverlay
            secretNumber={secretNumber}
            attemptsUsed={attemptsUsed}
            isLoss={gameStatus === 'lost'}
          />
        ) : (
          <RangeIndicator minRange={minRange} maxRange={maxRange} />
        )}

        <AttemptsIndicator attempts={attempts} maxAttempts={maxAttempts} />

        <GuessInput />

        <NumericKeypad showRestart={isGameOver} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap a number, press enter to guess</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp('2%'),
  },
  orbTopRight: {
    position: 'absolute',
    top: -hp('8%'),
    right: -wp('15%'),
    width: wp('60%'),
    height: wp('60%'),
    borderRadius: wp('30%'),
    backgroundColor: 'rgba(124, 92, 252, 0.08)',
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -hp('10%'),
    left: -wp('20%'),
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: wp('25%'),
    backgroundColor: 'rgba(45, 212, 191, 0.06)',
  },
  footer: {
    paddingBottom: hp('2%'),
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('2.8%'),
    color: Colors.text.muted,
    letterSpacing: 0.5,
  },
});
