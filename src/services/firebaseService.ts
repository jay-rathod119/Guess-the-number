import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export async function logScreenView(screenName: string) {
  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
}

export async function logGameEvent(
  event: string,
  params?: Record<string, string | number>
) {
  await analytics().logEvent(event, params);
}

export async function logCrashlyticsInfo(message: string) {
  crashlytics().log(message);
}

export async function setAnalyticsUserId(userId: string) {
  await analytics().setUserId(userId);
}
