import React, { useMemo, useEffect, useRef } from 'react';
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
import { DIFFICULTY_CONFIGS } from '../utils/gameUtils';
import { logScreenView, logGameEvent } from '../services/firebaseService';

export function GameScreen() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const secretNumber = useGameStore((s) => s.secretNumber);
  const minRange = useGameStore((s) => s.minRange);
  const maxRange = useGameStore((s) => s.maxRange);
  const attempts = useGameStore((s) => s.attempts);
  const maxAttempts = useGameStore((s) => s.maxAttempts);
  const difficulty = useGameStore((s) => s.difficulty);

  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';
  const diffConfig = DIFFICULTY_CONFIGS[difficulty];
  const prevStatus = useRef(gameStatus);

  useEffect(() => {
    logScreenView('GameScreen').catch(() => {});
  }, []);

  useEffect(() => {
    if (prevStatus.current === 'playing' && gameStatus === 'won') {
      logGameEvent('game_won', { difficulty, attempts_used: maxAttempts - attempts }).catch(() => {});
    } else if (prevStatus.current === 'playing' && gameStatus === 'lost') {
      logGameEvent('game_lost', { difficulty }).catch(() => {});
    }
    prevStatus.current = gameStatus;
  }, [gameStatus, difficulty, maxAttempts, attempts]);

  const diffColor =
    difficulty === 'easy' ? Colors.accent.teal
    : difficulty === 'hard' ? Colors.accent.coral
    : Colors.accent.gold;

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
          <RangeIndicator minRange={minRange} maxRange={maxRange} difficulty={difficulty} />
        )}

        <AttemptsIndicator attempts={attempts} maxAttempts={maxAttempts} />

        <GuessInput />

        <NumericKeypad showRestart={isGameOver} />
      </View>

      <View style={styles.footer}>
        <View style={[styles.diffBadge, { borderColor: `${diffColor}40` }]}>
          <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
          <Text style={[styles.diffBadgeText, { color: diffColor }]}>
            {diffConfig.label}
          </Text>
        </View>
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
    paddingBottom: hp('2.5%'),
    alignItems: 'center',
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  diffDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
  },
  diffBadgeText: {
    fontSize: wp('3%'),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
