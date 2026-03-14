import { useState, useEffect } from 'react';
import { fetchAppConfig } from '../services/configService';
import { compareVersions } from '../utils/gameUtils';
import Constants from 'expo-constants';

const APP_VERSION =
  Constants.expoConfig?.version ??
  (Constants.manifest as Record<string, unknown> | null)?.version as string ??
  '1.0.0';

export interface ForceUpdateState {
  needsUpdate: boolean;
  isChecking: boolean;
  updateMessage: string;
  isMaintenance: boolean;
}

export function useForceUpdate(): ForceUpdateState {
  const [state, setState] = useState<ForceUpdateState>({
    needsUpdate: false,
    isChecking: true,
    updateMessage: '',
    isMaintenance: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const config = await fetchAppConfig();
        if (cancelled) return;

        if (config.maintenanceMode) {
          setState({
            needsUpdate: false,
            isChecking: false,
            updateMessage: config.updateMessage,
            isMaintenance: true,
          });
          return;
        }

        const belowMinimum = compareVersions(APP_VERSION, config.minimumVersion) < 0;
        const belowLatest = compareVersions(APP_VERSION, config.latestVersion) < 0;
        const shouldForce = config.forceUpdate && belowLatest;

        if (belowMinimum || shouldForce) {
          setState({
            needsUpdate: true,
            isChecking: false,
            updateMessage: config.updateMessage,
            isMaintenance: false,
          });
          return;
        }

        setState({
          needsUpdate: false,
          isChecking: false,
          updateMessage: '',
          isMaintenance: false,
        });
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, isChecking: false }));
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
