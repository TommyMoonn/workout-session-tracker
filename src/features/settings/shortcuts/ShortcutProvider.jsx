import { useEffect, useMemo, useState } from "react";
import { createSettingsStorage } from "../persistence/createSettingsStorage";
import { ShortcutContext } from "./ShortcutContext";
import {
  defaultShortcutBindings,
  getShortcutDefinition,
  shortcutDefinitions,
  shortcutStorageKey,
} from "./shortcutRegistry";
import { areShortcutBindingsEqual, normalizeShortcutBinding } from "./shortcutUtils";

const shortcutStorage = createSettingsStorage({
  key: shortcutStorageKey,
  fallback: defaultShortcutBindings,
  normalize: normalizeShortcutBindings,
});

export function ShortcutProvider({ children }) {
  const [bindings, setBindings] = useState(shortcutStorage.load);

  useEffect(() => {
    shortcutStorage.save(bindings);
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

function normalizeShortcutBindings(value) {
  return Object.fromEntries(
    shortcutDefinitions.map((shortcut) => {
      const savedBinding = normalizeShortcutBinding(value?.[shortcut.id]);
      return [shortcut.id, savedBinding ?? defaultShortcutBindings[shortcut.id]];
    })
  );
}
