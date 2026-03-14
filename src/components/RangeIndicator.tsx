import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';
import { MIN_NUMBER, MAX_NUMBER } from '../utils/gameUtils';

interface RangeIndicatorProps {
  minRange: number;
  maxRange: number;
}

function RangeIndicatorComponent({ minRange, maxRange }: RangeIndicatorProps) {
  const totalRange = MAX_NUMBER - MIN_NUMBER;
  const leftPercent = ((minRange - MIN_NUMBER) / totalRange) * 100;
  const rightPercent = ((maxRange - MIN_NUMBER) / totalRange) * 100;

  const questionOffset = -wp('3.5%');
  const markerOffset = -wp('1.8%');

  const animatedLeft = useSharedValue(leftPercent);
  const animatedRight = useSharedValue(rightPercent);

  useEffect(() => {
    animatedLeft.value = withTiming(leftPercent, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    animatedRight.value = withTiming(rightPercent, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [leftPercent, rightPercent, animatedLeft, animatedRight]);

  const filledStyle = useAnimatedStyle(() => ({
    left: `${animatedLeft.value}%` as `${number}%`,
    width: `${animatedRight.value - animatedLeft.value}%` as `${number}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    left: `${animatedLeft.value}%` as `${number}%`,
    width: `${animatedRight.value - animatedLeft.value}%` as `${number}%`,
  }));

  const questionMarkStyle = useAnimatedStyle(() => {
    const center = (animatedLeft.value + animatedRight.value) / 2;
    return {
      left: `${center}%` as `${number}%`,
      transform: [{ translateX: questionOffset }],
    };
  });

  const leftMarkerStyle = useAnimatedStyle(() => ({
    left: `${animatedLeft.value}%` as `${number}%`,
    transform: [{ translateX: markerOffset }],
  }));

  const rightMarkerStyle = useAnimatedStyle(() => ({
    left: `${animatedRight.value}%` as `${number}%`,
    transform: [{ translateX: markerOffset }],
  }));

  return (
    <View style={styles.card}>
      <View style={styles.labelsRow}>
        <View style={styles.rangeBadge}>
          <Text style={styles.rangeLabel}>{minRange}</Text>
        </View>
        <Animated.View style={[styles.questionContainer, questionMarkStyle]}>
          <View style={styles.questionBubble}>
            <MaterialCommunityIcons
              name="help"
              size={wp('4.5%')}
              color={Colors.accent.primaryLight}
            />
          </View>
        </Animated.View>
        <View style={styles.rangeBadge}>
          <Text style={styles.rangeLabel}>{maxRange}</Text>
        </View>
      </View>

      <View style={styles.trackContainer}>
        <View style={styles.track} />
        <Animated.View style={[styles.glowTrack, glowStyle]} />
        <Animated.View style={[styles.filledTrack, filledStyle]} />

        <Animated.View style={[styles.marker, leftMarkerStyle]}>
          <View style={styles.markerDot} />
        </Animated.View>
        <Animated.View style={[styles.marker, rightMarkerStyle]}>
          <View style={styles.markerDot} />
        </Animated.View>
      </View>
    </View>
  );
}

export const RangeIndicator = memo(RangeIndicatorComponent);

const styles = StyleSheet.create({
  card: {
    width: '88%',
    backgroundColor: Colors.surface.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surface.cardBorder,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    position: 'relative',
    height: hp('4%'),
  },
  rangeBadge: {
    backgroundColor: 'rgba(124, 92, 252, 0.15)',
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.25)',
  },
  rangeLabel: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: Colors.text.primary,
  },
  questionContainer: {
    position: 'absolute',
    width: wp('7%'),
    alignItems: 'center',
    top: -hp('0.2%'),
  },
  questionBubble: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    backgroundColor: 'rgba(124, 92, 252, 0.2)',
    borderWidth: 1.5,
    borderColor: Colors.accent.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackContainer: {
    height: hp('1.5%'),
    position: 'relative',
    justifyContent: 'center',
  },
  track: {
    height: hp('0.5%'),
    backgroundColor: Colors.range.track,
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  glowTrack: {
    height: hp('1.2%'),
    backgroundColor: Colors.range.filledGlow,
    borderRadius: 8,
    position: 'absolute',
    top: hp('0.15%'),
  },
  filledTrack: {
    height: hp('0.5%'),
    backgroundColor: Colors.range.filled,
    borderRadius: 6,
    position: 'absolute',
  },
  marker: {
    position: 'absolute',
    width: wp('3.6%'),
    alignItems: 'center',
    top: -hp('0.15%'),
  },
  markerDot: {
    width: wp('2.8%'),
    height: wp('2.8%'),
    borderRadius: wp('1.4%'),
    backgroundColor: Colors.accent.primary,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
});
