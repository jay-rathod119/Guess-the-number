import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';
import { useGameStore } from '../store/gameStore';

function GuessInputComponent() {
  const currentInput = useGameStore((s) => s.currentInput);
  const pressBackspace = useGameStore((s) => s.pressBackspace);

  const handleBackspace = useCallback(() => {
    pressBackspace();
  }, [pressBackspace]);

  return (
    <View style={styles.container}>
      <View style={styles.inputField}>
        {currentInput ? (
          <Text style={styles.inputText}>{currentInput}</Text>
        ) : (
          <Text style={styles.placeholder}>???</Text>
        )}
        <View style={styles.inputGlow} />
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.backspaceButton,
          pressed && styles.backspacePressed,
        ]}
        onPress={handleBackspace}
      >
        <MaterialCommunityIcons
          name="backspace-outline"
          size={wp('6%')}
          color={Colors.text.primary}
        />
      </Pressable>
    </View>
  );
}

export const GuessInput = memo(GuessInputComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2.5%'),
    marginVertical: hp('1.5%'),
  },
  inputField: {
    width: wp('46%'),
    height: hp('7.5%'),
    backgroundColor: Colors.surface.input,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.surface.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
    overflow: 'hidden',
  },
  inputGlow: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.accent.primary,
    borderRadius: 1,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  inputText: {
    fontSize: wp('8%'),
    fontWeight: '800',
    color: Colors.surface.inputText,
    letterSpacing: 4,
  },
  placeholder: {
    fontSize: wp('6%'),
    fontWeight: '400',
    color: Colors.text.muted,
    letterSpacing: 6,
  },
  backspaceButton: {
    width: wp('14%'),
    height: hp('7.5%'),
    backgroundColor: Colors.accent.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  backspacePressed: {
    backgroundColor: Colors.accent.primaryDark,
    transform: [{ scale: 0.94 }],
  },
});
