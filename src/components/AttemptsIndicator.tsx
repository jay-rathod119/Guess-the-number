import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';

interface AttemptsIndicatorProps {
  attempts: number;
  maxAttempts: number;
}

function AttemptsIndicatorComponent({ attempts, maxAttempts }: AttemptsIndicatorProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.25, { duration: 120 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, [attempts, scale]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dots = Array.from({ length: maxAttempts }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Attempts</Text>
      </View>
      <View style={styles.indicatorRow}>
        <Animated.View style={[styles.heartContainer, heartStyle]}>
          <MaterialCommunityIcons
            name="heart"
            size={wp('10%')}
            color={Colors.accent.coral}
          />
          <View style={styles.numberOverlay}>
            <Text style={styles.number}>{attempts}</Text>
          </View>
        </Animated.View>
        <View style={styles.dotsRow}>
          {dots.map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < attempts ? styles.dotFilled : styles.dotEmpty,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export const AttemptsIndicator = memo(AttemptsIndicatorComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: hp('1.2%'),
  },
  labelRow: {
    marginBottom: hp('0.6%'),
  },
  label: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  heartContainer: {
    width: wp('12%'),
    height: wp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: wp('4.2%'),
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginTop: wp('0.3%'),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: wp('1.5%'),
    alignItems: 'center',
  },
  dot: {
    width: wp('2.2%'),
    height: wp('2.2%'),
    borderRadius: wp('1.1%'),
  },
  dotFilled: {
    backgroundColor: Colors.accent.coral,
    shadowColor: Colors.accent.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  dotEmpty: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
});
