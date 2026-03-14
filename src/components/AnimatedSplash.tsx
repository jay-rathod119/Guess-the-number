import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const numbersOpacity = useSharedValue(0);
  const numbersTranslateY = useSharedValue(15);
  const containerOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const lineWidth = useSharedValue(0);

  const triggerFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    iconScale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 120, mass: 0.8 })
    );
    iconRotation.value = withDelay(
      200,
      withTiming(360, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    titleOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    titleTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    lineWidth.value = withDelay(
      800,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    subtitleOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    numbersOpacity.value = withDelay(
      1100,
      withTiming(0.3, { duration: 500 })
    );
    numbersTranslateY.value = withDelay(
      1100,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    pulseScale.value = withDelay(
      1400,
      withSequence(
        withTiming(1.15, { duration: 200 }),
        withSpring(1, { damping: 8 })
      )
    );

    containerOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(triggerFinish)();
      })
    );
  }, [
    iconScale, iconRotation, titleOpacity, titleTranslateY,
    subtitleOpacity, numbersOpacity, numbersTranslateY,
    containerOpacity, pulseScale, lineWidth, triggerFinish,
  ]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value * pulseScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: lineWidth.value }],
    opacity: lineWidth.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const numbersStyle = useAnimatedStyle(() => ({
    opacity: numbersOpacity.value,
    transform: [{ translateY: numbersTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <LinearGradient
        colors={[
          Colors.background.gradientStart,
          Colors.background.gradientMid,
          Colors.background.gradientEnd,
        ]}
        style={styles.gradient}
      >
        {/* Decorative orbs */}
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />

        {/* Floating numbers */}
        <Animated.View style={[styles.floatingNumbers, numbersStyle]}>
          <Text style={[styles.floatNum, styles.floatNum1]}>7</Text>
          <Text style={[styles.floatNum, styles.floatNum2]}>3</Text>
          <Text style={[styles.floatNum, styles.floatNum3]}>9</Text>
          <Text style={[styles.floatNum, styles.floatNum4]}>1</Text>
          <Text style={[styles.floatNum, styles.floatNum5]}>5</Text>
          <Text style={[styles.floatNum, styles.floatNum6]}>0</Text>
          <Text style={[styles.floatNum, styles.floatNum7]}>8</Text>
          <Text style={[styles.floatNum, styles.floatNum8]}>2</Text>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="help"
                size={wp('14%')}
                color={Colors.accent.primaryLight}
              />
            </View>
          </Animated.View>

          <Animated.View style={titleStyle}>
            <Text style={styles.title}>Guess the</Text>
            <Text style={styles.titleBold}>Number</Text>
          </Animated.View>

          <Animated.View style={[styles.line, lineStyle]} />

          <Animated.View style={subtitleStyle}>
            <Text style={styles.subtitle}>Can you find it in 6 tries?</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.versionContainer, subtitleStyle]}>
          <Text style={styles.version}>v1.0.0</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbTop: {
    position: 'absolute',
    top: -hp('5%'),
    right: -wp('10%'),
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: wp('25%'),
    backgroundColor: 'rgba(124, 92, 252, 0.1)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: -hp('8%'),
    left: -wp('15%'),
    width: wp('45%'),
    height: wp('45%'),
    borderRadius: wp('22.5%'),
    backgroundColor: 'rgba(45, 212, 191, 0.07)',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    marginBottom: hp('3%'),
  },
  iconCircle: {
    width: wp('26%'),
    height: wp('26%'),
    borderRadius: wp('13%'),
    backgroundColor: 'rgba(124, 92, 252, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: '300',
    color: Colors.text.secondary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  titleBold: {
    fontSize: wp('12%'),
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: -hp('0.3%'),
  },
  line: {
    width: wp('20%'),
    height: 2,
    backgroundColor: Colors.accent.primary,
    borderRadius: 1,
    marginVertical: hp('1.5%'),
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: wp('3.8%'),
    color: Colors.text.muted,
    letterSpacing: 0.5,
  },
  floatingNumbers: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  floatNum: {
    position: 'absolute',
    fontSize: wp('12%'),
    fontWeight: '800',
    color: 'rgba(124, 92, 252, 0.06)',
  },
  floatNum1: { top: hp('8%'), left: wp('10%'), fontSize: wp('18%') },
  floatNum2: { top: hp('15%'), right: wp('8%'), fontSize: wp('14%') },
  floatNum3: { top: hp('30%'), left: wp('5%'), fontSize: wp('10%') },
  floatNum4: { bottom: hp('25%'), right: wp('12%'), fontSize: wp('16%') },
  floatNum5: { bottom: hp('10%'), left: wp('15%'), fontSize: wp('12%') },
  floatNum6: { top: hp('45%'), right: wp('5%'), fontSize: wp('8%') },
  floatNum7: { bottom: hp('35%'), left: wp('25%'), fontSize: wp('10%') },
  floatNum8: { bottom: hp('18%'), right: wp('25%'), fontSize: wp('14%') },
  versionContainer: {
    position: 'absolute',
    bottom: hp('4%'),
  },
  version: {
    fontSize: wp('3%'),
    color: Colors.text.muted,
    letterSpacing: 1,
  },
});
