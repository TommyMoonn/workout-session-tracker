import { useEffect, useMemo, useState } from "react";
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

export function AppearanceSettingsProvider({ children }) {
  const [appearance, setAppearanceState] = useState(loadAppearance);
  const [resolvedTheme, setResolvedTheme] = useState(() => (
    resolveTheme(appearance, getSystemPrefersDark())
  ));

  useEffect(() => {
    saveAppearance(appearance);
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

function loadAppearance() {
  if (typeof window === "undefined") return defaultAppearance;

  try {
    return normalizeAppearance(window.localStorage.getItem(appearanceStorageKey));
  } catch (error) {
    console.error(error);
    return defaultAppearance;
  }
}

function saveAppearance(appearance) {
  try {
    window.localStorage.setItem(appearanceStorageKey, normalizeAppearance(appearance));
  } catch (error) {
    console.error(error);
  }
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
