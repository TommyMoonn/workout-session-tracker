export function createSettingsStorage({
  key,
  fallback,
  normalize = (value) => value,
  parse = JSON.parse,
  serialize = JSON.stringify,
}) {
  function getFallback() {
    const fallbackValue = typeof fallback === "function" ? fallback() : fallback;
    return normalize(fallbackValue);
  }

  return {
    load() {
      if (typeof window === "undefined") return getFallback();

      try {
        const raw = window.localStorage.getItem(key);
        return raw == null ? getFallback() : normalize(parse(raw));
      } catch (error) {
        console.error(error);
        return getFallback();
      }
    },

    save(value) {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(key, serialize(normalize(value)));
      } catch (error) {
        console.error(error);
      }
    },
  };
}
