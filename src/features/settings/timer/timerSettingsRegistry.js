import { defaultRestSeconds } from "@features/timer/constants";
import { clampSeconds } from "@domain/workout";

export const timerSettingsStorageKey = "liftlog-lite.timer-settings.v1";

export const defaultTimerSettings = {
  defaultRestSeconds,
  autoStartRestAfterSet: true,
  confirmResetSession: true,
};

export function normalizeTimerRestSeconds(value) {
  return clampSeconds(value, defaultTimerSettings.defaultRestSeconds);
}

export function normalizeTimerSettings(value) {
  if (!value || typeof value !== "object") return defaultTimerSettings;

  return {
    defaultRestSeconds: normalizeTimerRestSeconds(value.defaultRestSeconds),
    autoStartRestAfterSet: typeof value.autoStartRestAfterSet === "boolean"
      ? value.autoStartRestAfterSet
      : defaultTimerSettings.autoStartRestAfterSet,
    confirmResetSession: typeof value.confirmResetSession === "boolean"
      ? value.confirmResetSession
      : defaultTimerSettings.confirmResetSession,
  };
}
