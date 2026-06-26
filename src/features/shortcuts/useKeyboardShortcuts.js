import { useEffect } from "react";
import { useShortcutPreferences } from "./useShortcutPreferences";
import { hasBlockingShortcutLayer, isEditableShortcutTarget, matchesShortcut } from "./shortcutUtils";

export function useKeyboardShortcuts(shortcuts, options = {}) {
  const {
    enabled = true,
    ignoreWhenBlockingLayerOpen = true,
    skipEditableTargets = true,
  } = options;
  const { getShortcutBinding } = useShortcutPreferences();

  useEffect(() => {
    if (!enabled) return undefined;

    function handleKeyDown(event) {
      if (event.defaultPrevented) return;
      if (ignoreWhenBlockingLayerOpen && hasBlockingShortcutLayer()) return;

      const isEditableTarget = isEditableShortcutTarget(event.target);

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;
        if (skipEditableTargets && isEditableTarget && !shortcut.allowInEditable) continue;

        const binding = shortcut.id ? getShortcutBinding(shortcut.id) : shortcut;
        if (!matchesShortcut(event, binding)) continue;

        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }

        shortcut.handler(event);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, getShortcutBinding, ignoreWhenBlockingLayerOpen, shortcuts, skipEditableTargets]);
}
