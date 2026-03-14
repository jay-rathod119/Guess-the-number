import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import { GameScreen } from './src/screens/GameScreen';
import { ForceUpdateModal } from './src/components/ForceUpdateModal';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { useForceUpdate } from './src/hooks/useForceUpdate';
import { Colors } from './src/constants/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

// ─── TEMPORARY: Remove this after verifying Firebase works ───
const SHOW_FIREBASE_TEST = true;

function FirebaseTestBanner() {
  const handleTestCrash = useCallback(() => {
    Alert.alert(
      'Test Crash',
      'This will crash the app to test Firebase Crashlytics. The crash will appear in your Firebase Console within a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Crash Now',
          style: 'destructive',
          onPress: () => {
            crashlytics().log('Test crash triggered by user');
            crashlytics().crash();
          },
        },
      ]
    );
  }, []);

  const handleTestLog = useCallback(async () => {
    try {
      await crashlytics().log('Firebase test log from Guess My Number');
      await crashlytics().setAttributes({
        app: 'GuessMyNumber',
        test: 'true',
      });
      await analytics().logEvent('firebase_test', { status: 'success' });
      Alert.alert(
        'Firebase Working',
        'Crashlytics log + Analytics event sent successfully. Check your Firebase Console.',
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      Alert.alert('Firebase Error', msg);
    }
  }, []);

  return (
    <View style={testStyles.banner}>
      <Text style={testStyles.bannerTitle}>Firebase Test Mode</Text>
      <View style={testStyles.row}>
        <Pressable style={testStyles.logBtn} onPress={handleTestLog}>
          <Text style={testStyles.btnText}>Test Log</Text>
        </Pressable>
        <Pressable style={testStyles.crashBtn} onPress={handleTestCrash}>
          <Text style={testStyles.btnText}>Test Crash</Text>
        </Pressable>
      </View>
    </View>
  );
}

const testStyles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', gap: 10 },
  logBtn: {
    backgroundColor: '#7c5cfc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  crashBtn: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
// ─── END TEMPORARY ───

function AppContent() {
  const { needsUpdate, isChecking, updateMessage, isMaintenance } = useForceUpdate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const showBlocker = !isChecking && (needsUpdate || isMaintenance);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ForceUpdateModal
          visible={showBlocker}
          message={updateMessage}
          isMaintenance={isMaintenance}
        />
        {SHOW_FIREBASE_TEST && <FirebaseTestBanner />}
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
