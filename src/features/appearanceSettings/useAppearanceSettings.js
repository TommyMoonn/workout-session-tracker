import { useContext } from "react";
import { AppearanceSettingsContext } from "./AppearanceSettingsContext";

export function useAppearanceSettings() {
  const context = useContext(AppearanceSettingsContext);
  if (!context) {
    throw new Error("useAppearanceSettings must be used inside AppearanceSettingsProvider.");
  }
  return context;
}
