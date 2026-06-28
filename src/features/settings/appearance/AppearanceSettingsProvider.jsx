import { useEffect, useMemo, useState } from "react";
import { createSettingsStorage } from "../persistence/createSettingsStorage";
import { AppearanceSettingsContext } from "./AppearanceSettingsContext";
import {
  appearanceOptions,
  appearanceStorageKey,
  defaultAppearance,
  normalizeAppearance,
  resolveTheme,
  themeColorByMode,
} from "./appearanceSettingsRegistry";

const systemThemeQuery = "(prefers-color-scheme: dark)";
const appearanceStorage = createSettingsStorage({
  key: appearanceStorageKey,
  fallback: defaultAppearance,
  normalize: normalizeAppearance,
  parse: (raw) => raw,
  serialize: (value) => value,
});

export function AppearanceSettingsProvider({ children }) {
  const [appearance, setAppearanceState] = useState(appearanceStorage.load);
  const [resolvedTheme, setResolvedTheme] = useState(() => (
    resolveTheme(appearance, getSystemPrefersDark())
  ));

  useEffect(() => {
    appearanceStorage.save(appearance);
    const mediaQuery = window.matchMedia(systemThemeQuery);

    function syncTheme() {
      const nextTheme = applyAppearance(appearance, mediaQuery.matches);
      setResolvedTheme(nextTheme);
    }

    syncTheme();
    if (appearance !== "system") return undefined;

    mediaQuery.addEventListener("change", syncTheme);
    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, [appearance]);

  const value = useMemo(() => ({
    appearance,
    appearanceOptions,
    resolvedTheme,
    setAppearance: (nextAppearance) => {
      const normalizedAppearance = normalizeAppearance(nextAppearance);
      const nextTheme = applyAppearance(normalizedAppearance, getSystemPrefersDark());
      setResolvedTheme(nextTheme);
      setAppearanceState(normalizedAppearance);
    },
  }), [appearance, resolvedTheme]);

  return (
    <AppearanceSettingsContext.Provider value={value}>
      {children}
    </AppearanceSettingsContext.Provider>
  );
}

function getSystemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia(systemThemeQuery).matches;
}

function applyAppearance(appearance, prefersDark) {
  const nextTheme = resolveTheme(appearance, prefersDark);
  const root = document.documentElement;
  root.dataset.appearance = normalizeAppearance(appearance);
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", themeColorByMode[nextTheme]);

  return nextTheme;
}
