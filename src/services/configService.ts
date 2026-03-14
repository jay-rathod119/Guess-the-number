import { Platform } from 'react-native';

export interface AppConfig {
  latestVersion: string;
  minimumVersion: string;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  updateMessage: string;
}

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.serenitystudio.guessmynumber';
const APP_STORE_URL = 'https://apps.apple.com';

const CONFIG_URL =
  'https://raw.githubusercontent.com/jay-rathod119/Guess-the-number/main/app-config.json';

const DEFAULT_CONFIG: AppConfig = {
  latestVersion: '1.0.0',
  minimumVersion: '1.0.0',
  forceUpdate: false,
  maintenanceMode: false,
  updateMessage: 'A new version is available. Please update to continue.',
};

export function getStoreUrl(): string {
  return Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  try {
    const response = await fetch(CONFIG_URL, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return {
      ...DEFAULT_CONFIG,
      ...data,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}
