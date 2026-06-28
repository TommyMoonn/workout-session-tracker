import { useContext } from "react";
import { SoundSettingsContext } from "./SoundSettingsContext";

export function useSoundSettings() {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error("useSoundSettings must be used inside SoundSettingsProvider.");
  }
  return context;
}
