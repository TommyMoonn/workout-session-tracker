import { useContext } from "react";
import { ShortcutContext } from "./ShortcutContext";

export function useShortcutPreferences() {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error("useShortcutPreferences must be used inside ShortcutProvider.");
  }
  return context;
}
