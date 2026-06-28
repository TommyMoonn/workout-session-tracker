import { useEffect, useMemo, useState } from "react";
import { createSettingsStorage } from "../persistence/createSettingsStorage";
import { TimerSettingsContext } from "./TimerSettingsContext";
import {
  defaultTimerSettings,
  normalizeTimerSettings,
  timerSettingsStorageKey,
} from "./timerSettingsRegistry";

const timerSettingsStorage = createSettingsStorage({
  key: timerSettingsStorageKey,
  fallback: defaultTimerSettings,
  normalize: normalizeTimerSettings,
});

export function TimerSettingsProvider({ children }) {
  const [settings, setSettings] = useState(timerSettingsStorage.load);

  useEffect(() => {
    timerSettingsStorage.save(settings);
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    resetTimerSettings: () => setSettings(defaultTimerSettings),
    setAutoStartRestAfterSet: (nextValue) => {
      setSettings((current) => ({
        ...current,
        autoStartRestAfterSet: Boolean(nextValue),
      }));
    },
    setConfirmResetSession: (nextValue) => {
      setSettings((current) => ({
        ...current,
        confirmResetSession: Boolean(nextValue),
      }));
    },
    setDefaultRestSeconds: (nextSeconds) => {
      setSettings((current) => normalizeTimerSettings({
        ...current,
        defaultRestSeconds: nextSeconds,
      }));
    },
  }), [settings]);

  return (
    <TimerSettingsContext.Provider value={value}>
      {children}
    </TimerSettingsContext.Provider>
  );
}
