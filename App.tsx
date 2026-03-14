import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GameScreen } from './src/screens/GameScreen';
import { ForceUpdateModal } from './src/components/ForceUpdateModal';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { useForceUpdate } from './src/hooks/useForceUpdate';
import { Colors } from './src/constants/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { needsUpdate, isChecking } = useForceUpdate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ForceUpdateModal visible={!isChecking && needsUpdate} />
        <GameScreen />
      </SafeAreaView>

      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.gradientStart,
  },
});
