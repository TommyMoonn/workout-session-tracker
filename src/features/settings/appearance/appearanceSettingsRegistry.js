export const appearanceStorageKey = "liftlog-lite.appearance.v1";

export const appearanceOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const defaultAppearance = "system";

export const themeColorByMode = {
  dark: "#151313",
  light: "#fdfcfc",
};

export function normalizeAppearance(value) {
  return appearanceOptions.some((option) => option.value === value)
    ? value
    : defaultAppearance;
}

export function resolveTheme(appearance, prefersDark) {
  const normalizedAppearance = normalizeAppearance(appearance);
  if (normalizedAppearance === "system") return prefersDark ? "dark" : "light";
  return normalizedAppearance;
}
