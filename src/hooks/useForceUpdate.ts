import { useState, useEffect } from 'react';
import { fetchAppConfig } from '../services/configService';
import { compareVersions } from '../utils/gameUtils';
import Constants from 'expo-constants';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

export function useForceUpdate() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const config = await fetchAppConfig();
        if (cancelled) return;

        if (config.forceUpdate && compareVersions(APP_VERSION, config.latestVersion) < 0) {
          setNeedsUpdate(true);
        }
      } catch {
        // Silently fail - don't block the user
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return { needsUpdate, isChecking };
}
