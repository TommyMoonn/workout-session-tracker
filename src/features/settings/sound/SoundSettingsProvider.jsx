import { useEffect, useMemo, useState } from "react";
import { createSettingsStorage } from "../persistence/createSettingsStorage";
import { SoundSettingsContext } from "./SoundSettingsContext";
import {
  defaultSoundSettings,
  normalizeSoundSettings,
  soundSettingsStorageKey,
} from "./soundSettingsRegistry";
import { playChillAlarm } from "./restAlarm";

const soundSettingsStorage = createSettingsStorage({
  key: soundSettingsStorageKey,
  fallback: defaultSoundSettings,
  normalize: normalizeSoundSettings,
});

export function SoundSettingsProvider({ children }) {
  const [settings, setSettings] = useState(soundSettingsStorage.load);

  useEffect(() => {
    soundSettingsStorage.save(settings);
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
