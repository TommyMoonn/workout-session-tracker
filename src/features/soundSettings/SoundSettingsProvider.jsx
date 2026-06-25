import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { playChillAlarm } from "../timer/utils/restAlarm";
import { defaultSoundSettings, normalizeSoundSettings } from "./soundSettingsRegistry";

const soundSettingsStorageKey = "liftlog-lite.sound-settings.v1";
const SoundSettingsContext = createContext(null);

export function SoundSettingsProvider({ children }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [settings, setSettings] = useState(defaultSoundSettings);

  useEffect(() => {
    setSettings(loadSoundSettings());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveSoundSettings(settings);
  }, [hasLoaded, settings]);

  const value = useMemo(() => ({
    settings,
    resetSoundSettings: () => setSettings(defaultSoundSettings),
    setRestAlertRepeatEnabled: (nextValue) => {
      setSettings((current) => ({
        ...current,
        restAlertRepeatEnabled: Boolean(nextValue),
      }));
    },
    setRestAlertSoundEnabled: (nextValue) => {
      setSettings((current) => ({
        ...current,
        restAlertSoundEnabled: Boolean(nextValue),
      }));
    },
    setRestAlertVolume: (nextVolume) => {
      setSettings((current) => normalizeSoundSettings({
        ...current,
        restAlertVolume: nextVolume,
      }));
    },
    playPreview: () => {
      const alarmContextsRef = { current: [] };
      playChillAlarm(alarmContextsRef, settings.restAlertVolume);
    },
  }), [settings]);

  return (
    <SoundSettingsContext.Provider value={value}>
      {children}
    </SoundSettingsContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error("useSoundSettings must be used inside SoundSettingsProvider.");
  }
  return context;
}

function loadSoundSettings() {
  if (typeof window === "undefined") return defaultSoundSettings;

  try {
    const raw = window.localStorage.getItem(soundSettingsStorageKey);
    return normalizeSoundSettings(raw ? JSON.parse(raw) : defaultSoundSettings);
  } catch (error) {
    console.error(error);
    return defaultSoundSettings;
  }
}

function saveSoundSettings(settings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(soundSettingsStorageKey, JSON.stringify(normalizeSoundSettings(settings)));
  } catch (error) {
    console.error(error);
  }
}
