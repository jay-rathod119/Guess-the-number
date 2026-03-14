export interface AppConfig {
  latestVersion: string;
  forceUpdate: boolean;
}

const MOCK_CONFIG_URL = 'https://raw.githubusercontent.com/example/config/main/app-config.json';

export async function fetchAppConfig(): Promise<AppConfig> {
  try {
    const response = await fetch(MOCK_CONFIG_URL);
    if (!response.ok) throw new Error('Config fetch failed');
    return (await response.json()) as AppConfig;
  } catch {
    return {
      latestVersion: '1.0.0',
      forceUpdate: false,
    };
  }
}
