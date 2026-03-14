import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeypadButton } from './KeypadButton';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';
import { useGameStore } from '../store/gameStore';

interface NumericKeypadProps {
  showRestart?: boolean;
}

function NumericKeypadComponent({ showRestart = false }: NumericKeypadProps) {
  const pressDigit = useGameStore((s) => s.pressDigit);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleDigitPress = useCallback(
    (digit: string) => {
      pressDigit(digit);
    },
    [pressDigit]
  );

  const handleSubmit = useCallback(() => {
    submitGuess();
  }, [submitGuess]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <KeypadButton label="7" onPress={handleDigitPress} />
        <KeypadButton label="8" onPress={handleDigitPress} />
        <KeypadButton label="9" onPress={handleDigitPress} />
      </View>
      <View style={styles.row}>
        <KeypadButton label="4" onPress={handleDigitPress} />
        <KeypadButton label="5" onPress={handleDigitPress} />
        <KeypadButton label="6" onPress={handleDigitPress} />
      </View>
      <View style={styles.row}>
        <KeypadButton label="1" onPress={handleDigitPress} />
        <KeypadButton label="2" onPress={handleDigitPress} />
        <KeypadButton label="3" onPress={handleDigitPress} />
      </View>
      <View style={styles.row}>
        <KeypadButton label="0" onPress={handleDigitPress} />
        {showRestart ? (
          <KeypadButton
            label="restart"
            onPress={handleRestart}
            isAccent
            wide
            icon={
              <MaterialCommunityIcons
                name="restart"
                size={wp('6.5%')}
                color={Colors.text.primary}
              />
            }
          />
        ) : (
          <KeypadButton
            label="enter"
            onPress={handleSubmit}
            isAccent
            wide
            icon={
              <MaterialCommunityIcons
                name="keyboard-return"
                size={wp('6.5%')}
                color={Colors.text.primary}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

export const NumericKeypad = memo(NumericKeypadComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: hp('1.2%'),
  },
  row: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
});
