import { useEffect, useMemo, useState } from "react";
import { ShortcutContext } from "./ShortcutContext";
import { defaultShortcutBindings, getShortcutDefinition, shortcutDefinitions } from "./shortcutRegistry";
import { areShortcutBindingsEqual, normalizeShortcutBinding } from "./shortcutUtils";

const shortcutStorageKey = "liftlog-lite.shortcut-bindings.v1";

export function ShortcutProvider({ children }) {
  const [bindings, setBindings] = useState(loadShortcutBindings);

  useEffect(() => {
    saveShortcutBindings(bindings);
  }, [bindings]);

  const value = useMemo(() => ({
    bindings,
    getShortcutBinding: (shortcutId) => bindings[shortcutId] ?? defaultShortcutBindings[shortcutId] ?? null,
    getShortcutDefinition,
    findShortcutConflict: (nextBinding, currentShortcutId) => {
      const currentShortcut = getShortcutDefinition(currentShortcutId);
      return shortcutDefinitions.find((shortcut) => (
        shortcut.id !== currentShortcutId
        && shortcut.groupTitle === currentShortcut?.groupTitle
        && areShortcutBindingsEqual(bindings[shortcut.id], nextBinding)
      )) ?? null;
    },
    resetAllShortcuts: () => setBindings(defaultShortcutBindings),
    resetShortcut: (shortcutId) => {
      setBindings((current) => ({
        ...current,
        [shortcutId]: defaultShortcutBindings[shortcutId],
      }));
    },
    setShortcutBinding: (shortcutId, nextBinding) => {
      const normalizedBinding = normalizeShortcutBinding(nextBinding);
      if (!normalizedBinding || !defaultShortcutBindings[shortcutId]) return;

      setBindings((current) => ({
        ...current,
        [shortcutId]: normalizedBinding,
      }));
    },
  }), [bindings]);

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
}

function loadShortcutBindings() {
  if (typeof window === "undefined") return defaultShortcutBindings;

  try {
    const raw = window.localStorage.getItem(shortcutStorageKey);
    const savedBindings = raw ? JSON.parse(raw) : {};

    return Object.fromEntries(
      shortcutDefinitions.map((shortcut) => {
        const savedBinding = normalizeShortcutBinding(savedBindings?.[shortcut.id]);
        return [shortcut.id, savedBinding ?? defaultShortcutBindings[shortcut.id]];
      })
    );
  } catch (error) {
    console.error(error);
    return defaultShortcutBindings;
  }
}

function saveShortcutBindings(bindings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(shortcutStorageKey, JSON.stringify(bindings));
  } catch (error) {
    console.error(error);
  }
}
