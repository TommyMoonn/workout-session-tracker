import { useEffect, useState } from "react";
import { Button } from "@shared/ui";
import {
  formatShortcutKeys,
  shortcutFromKeyboardEvent,
  shortcutGroups,
  useShortcutPreferences,
} from "../../features/shortcuts";
import { ui } from "@shared/styles";
import {
  SettingsActions,
  SettingsSection,
  SettingsStatus,
  SettingsTab,
} from "./SettingsPrimitives";

export function ShortcutSettingsTab() {
  const {
    bindings,
    findShortcutConflict,
    getShortcutDefinition,
    resetAllShortcuts,
    resetShortcut,
    setShortcutBinding,
  } = useShortcutPreferences();
  const [editingShortcutId, setEditingShortcutId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!editingShortcutId) return undefined;

    function handleCaptureKeyDown(event) {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        setEditingShortcutId(null);
        setStatusMessage("Shortcut update cancelled.");
        return;
      }

      const nextBinding = shortcutFromKeyboardEvent(event);
      if (!nextBinding) return;

      const conflict = findShortcutConflict(nextBinding, editingShortcutId);
      if (conflict) {
        setStatusMessage(`${formatShortcutKeys(nextBinding)} is already assigned to ${conflict.label}.`);
        return;
      }

      setShortcutBinding(editingShortcutId, nextBinding);
      setStatusMessage(`${getShortcutDefinition(editingShortcutId)?.label ?? "Shortcut"} updated.`);
      setEditingShortcutId(null);
    }

    window.addEventListener("keydown", handleCaptureKeyDown, true);
    return () => window.removeEventListener("keydown", handleCaptureKeyDown, true);
  }, [editingShortcutId, findShortcutConflict, getShortcutDefinition, setShortcutBinding]);

  function startEditing(shortcutId) {
    setEditingShortcutId(shortcutId);
    setStatusMessage("Press the new shortcut keys.");
  }

  function resetAll() {
    resetAllShortcuts();
    setEditingShortcutId(null);
    setStatusMessage("Shortcuts reset to defaults.");
  }

  return (
    <SettingsTab>
      <SettingsStatus>
        {statusMessage || "Select Change, then press a new shortcut."}
      </SettingsStatus>

      {shortcutGroups.map((group) => (
        <SettingsSection key={group.title} title={group.title}>
          {group.shortcuts.map((shortcut) => {
            const isEditing = editingShortcutId === shortcut.id;

            return (
              <div key={`${group.title}-${shortcut.id}`} className={ui.settingsShortcutRow}>
                <span className={ui.settingsShortcutLabel}>{shortcut.label}</span>
                <kbd className={ui.settingsShortcutKeys}>
                  {isEditing ? "Press keys" : formatShortcutKeys(bindings[shortcut.id])}
                </kbd>
                <span className={ui.settingsShortcutActions}>
                  <Button
                    type="button"
                    variant={isEditing ? "primary" : "soft"}
                    className={ui.settingsActionButton}
                    onClick={() => startEditing(shortcut.id)}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="soft"
                    className={ui.settingsActionButton}
                    onClick={() => resetShortcut(shortcut.id)}
                  >
                    Reset
                  </Button>
                </span>
              </div>
            );
          })}
        </SettingsSection>
      ))}

      <SettingsActions>
        <Button type="button" variant="soft" className={ui.settingsActionButton} onClick={resetAll}>
          Reset all
        </Button>
      </SettingsActions>
    </SettingsTab>
  );
}
