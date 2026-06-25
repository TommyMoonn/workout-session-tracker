export const restAlertVolumeOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const defaultSoundSettings = {
  restAlertSoundEnabled: true,
  restAlertRepeatEnabled: true,
  restAlertVolume: "medium",
};

export function normalizeSoundSettings(value) {
  if (!value || typeof value !== "object") return defaultSoundSettings;

  const safeVolume = restAlertVolumeOptions.some((option) => option.value === value.restAlertVolume)
    ? value.restAlertVolume
    : defaultSoundSettings.restAlertVolume;

  return {
    restAlertSoundEnabled: typeof value.restAlertSoundEnabled === "boolean"
      ? value.restAlertSoundEnabled
      : defaultSoundSettings.restAlertSoundEnabled,
    restAlertRepeatEnabled: typeof value.restAlertRepeatEnabled === "boolean"
      ? value.restAlertRepeatEnabled
      : defaultSoundSettings.restAlertRepeatEnabled,
    restAlertVolume: safeVolume,
  };
}
