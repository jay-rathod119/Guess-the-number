import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';

interface SuccessOverlayProps {
  secretNumber: number;
  attemptsUsed: number;
  isLoss?: boolean;
}

function SuccessOverlayComponent({
  secretNumber,
  isLoss = false,
}: SuccessOverlayProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const emojiScale = useSharedValue(0);
  const numberScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });

    emojiScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 120 }),
        withSpring(1, { damping: 12 })
      )
    );

    scale.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 100 }));

    numberScale.value = withDelay(
      700,
      withSequence(
        withSpring(1.15, { damping: 8, stiffness: 150 }),
        withSpring(1, { damping: 12 })
      )
    );

    glowOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 600 })
    );
  }, [opacity, scale, emojiScale, numberScale, glowOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={emojiStyle}>
        <Text style={styles.emoji}>{isLoss ? '😔' : '🎉'}</Text>
      </Animated.View>

      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.subtitle}>
          {isLoss ? 'Game Over!' : 'Brilliant!'}
        </Text>
        <Text style={styles.title}>
          {isLoss ? 'The number was' : 'You got it!'}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.numberCard, numberStyle]}>
        <Animated.View style={[styles.numberGlow, glowStyle]} />
        <View style={styles.numberInner}>
          <Text style={styles.numberText}>{secretNumber}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.iconRow, { opacity: glowOpacity }]}>
        <MaterialCommunityIcons
          name={isLoss ? 'emoticon-sad-outline' : 'star-four-points'}
          size={wp('4%')}
          color={isLoss ? Colors.accent.coral : Colors.accent.gold}
        />
        <MaterialCommunityIcons
          name={isLoss ? 'emoticon-sad-outline' : 'star-four-points'}
          size={wp('5%')}
          color={isLoss ? Colors.accent.coral : Colors.accent.gold}
        />
        <MaterialCommunityIcons
          name={isLoss ? 'emoticon-sad-outline' : 'star-four-points'}
          size={wp('4%')}
          color={isLoss ? Colors.accent.coral : Colors.accent.gold}
        />
      </Animated.View>
    </Animated.View>
  );
}

export const SuccessOverlay = memo(SuccessOverlayComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
  },
  emoji: {
    fontSize: wp('12%'),
    marginBottom: hp('0.5%'),
  },
  content: {
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: hp('0.3%'),
  },
  title: {
    fontSize: wp('6.5%'),
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  numberCard: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1%'),
  },
  numberGlow: {
    position: 'absolute',
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('14%'),
    backgroundColor: Colors.accent.glow,
  },
  numberInner: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: 'rgba(124, 92, 252, 0.2)',
    borderWidth: 2,
    borderColor: Colors.accent.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: wp('10%'),
    fontWeight: '900',
    color: Colors.text.primary,
    textShadowColor: Colors.accent.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  iconRow: {
    flexDirection: 'row',
    gap: wp('3%'),
    alignItems: 'center',
  },
});
