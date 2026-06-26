import { useEffect, useState } from "react";
import { Button } from "../ui";
import {
  formatShortcutKeys,
  shortcutFromKeyboardEvent,
  shortcutGroups,
  useShortcutPreferences,
} from "../../features/shortcuts";

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
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] px-3 py-2">
        <p className="text-sm text-[var(--oc-body)]">
          {statusMessage || "Select Change, then press a new shortcut."}
        </p>
        <Button type="button" variant="soft" className="min-h-8 px-3 py-1 text-xs" onClick={resetAll}>
          Reset all
        </Button>
      </div>

      {shortcutGroups.map((group) => (
        <section key={group.title} className="border border-[var(--oc-hairline)] bg-[var(--oc-surface)]">
          <h3 className="border-b border-[var(--oc-hairline)] px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--oc-muted)]">
            {group.title}
          </h3>
          <div className="divide-y divide-[var(--oc-hairline)]">
            {group.shortcuts.map((shortcut) => {
              const isEditing = editingShortcutId === shortcut.id;

              return (
                <div key={`${group.title}-${shortcut.id}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2 text-sm max-[620px]:grid-cols-1 max-[620px]:gap-2">
                  <span className="text-[var(--oc-body)]">{shortcut.label}</span>
                  <kbd className="inline-flex min-h-7 min-w-[92px] items-center justify-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-surface-soft)] px-2 text-xs font-bold text-[var(--oc-ink)] max-[620px]:justify-start">
                    {isEditing ? "Press keys" : formatShortcutKeys(bindings[shortcut.id])}
                  </kbd>
                  <span className="flex justify-end gap-2 max-[620px]:justify-start">
                    <Button
                      type="button"
                      variant={isEditing ? "primary" : "soft"}
                      className="min-h-8 px-3 py-1 text-xs"
                      onClick={() => startEditing(shortcut.id)}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="soft"
                      className="min-h-8 px-3 py-1 text-xs"
                      onClick={() => resetShortcut(shortcut.id)}
                    >
                      Reset
                    </Button>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
