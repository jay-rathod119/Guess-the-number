import React, { memo, useCallback } from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KeypadButtonProps {
  label: string;
  onPress: (label: string) => void;
  isAccent?: boolean;
  wide?: boolean;
  icon?: React.ReactNode;
}

function KeypadButtonComponent({
  label,
  onPress,
  isAccent = false,
  wide = false,
  icon,
}: KeypadButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.91, { damping: 15, stiffness: 350 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress(label);
  }, [onPress, label]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const buttonStyle: ViewStyle[] = [
    styles.button,
    isAccent && styles.accentButton,
    wide && styles.wideButton,
  ].filter(Boolean) as ViewStyle[];

  return (
    <AnimatedPressable
      style={[buttonStyle, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {icon || (
        <Text style={[styles.label, isAccent && styles.accentLabel]}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export const KeypadButton = memo(KeypadButtonComponent);

const styles = StyleSheet.create({
  button: {
    width: wp('21%'),
    height: hp('7.5%'),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface.keypad,
    borderWidth: 1,
    borderColor: Colors.surface.keypadBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accentButton: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primaryLight,
    shadowColor: Colors.accent.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  wideButton: {
    width: wp('44.5%'),
  },
  label: {
    fontSize: wp('6%'),
    fontWeight: '600',
    color: Colors.surface.keypadText,
  },
  accentLabel: {
    color: Colors.text.primary,
    fontWeight: '700',
  },
});
