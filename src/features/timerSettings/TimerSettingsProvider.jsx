import { useEffect, useMemo, useState } from "react";
import { TimerSettingsContext } from "./TimerSettingsContext";
import { defaultTimerSettings, normalizeTimerSettings } from "./timerSettingsRegistry";

const timerSettingsStorageKey = "liftlog-lite.timer-settings.v1";

export function TimerSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadTimerSettings);

  useEffect(() => {
    saveTimerSettings(settings);
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

function loadTimerSettings() {
  if (typeof window === "undefined") return defaultTimerSettings;

  try {
    const raw = window.localStorage.getItem(timerSettingsStorageKey);
    return normalizeTimerSettings(raw ? JSON.parse(raw) : defaultTimerSettings);
  } catch (error) {
    console.error(error);
    return defaultTimerSettings;
  }
}

function saveTimerSettings(settings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(timerSettingsStorageKey, JSON.stringify(normalizeTimerSettings(settings)));
  } catch (error) {
    console.error(error);
  }
}
