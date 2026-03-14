let analytics: (() => any) | null = null;
let crashlytics: (() => any) | null = null;

try {
  analytics = require('@react-native-firebase/analytics').default;
} catch {
  // Firebase Analytics not available
}

try {
  crashlytics = require('@react-native-firebase/crashlytics').default;
} catch {
  // Firebase Crashlytics not available
}

export async function logScreenView(screenName: string) {
  try {
    await analytics?.().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch {
    // silently fail
  }
}

export async function logGameEvent(
  event: string,
  params?: Record<string, string | number>
) {
  try {
    await analytics?.().logEvent(event, params);
  } catch {
    // silently fail
  }
}

export async function logCrashlyticsInfo(message: string) {
  try {
    crashlytics?.().log(message);
  } catch {
    // silently fail
  }
}

export async function setAnalyticsUserId(userId: string) {
  try {
    await analytics?.().setUserId(userId);
  } catch {
    // silently fail
  }
}
