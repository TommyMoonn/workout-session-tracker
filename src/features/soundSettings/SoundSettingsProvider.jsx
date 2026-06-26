import { useEffect, useMemo, useState } from "react";
import { playChillAlarm } from "../timer/utils/restAlarm";
import { SoundSettingsContext } from "./SoundSettingsContext";
import { defaultSoundSettings, normalizeSoundSettings } from "./soundSettingsRegistry";

const soundSettingsStorageKey = "liftlog-lite.sound-settings.v1";

export function SoundSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSoundSettings);

  useEffect(() => {
    saveSoundSettings(settings);
  }, [settings]);

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
