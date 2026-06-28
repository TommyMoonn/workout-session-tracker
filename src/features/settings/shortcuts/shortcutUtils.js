const editableSelector = "input, textarea, select, [contenteditable='true'], [contenteditable='']";
const modifierKeys = new Set(["Alt", "Control", "Meta", "Shift"]);

export function isEditableShortcutTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(editableSelector));
}

export function hasBlockingShortcutLayer() {
  return Boolean(document.querySelector("[data-shortcut-blocking='true']"));
}

export function matchesShortcut(event, shortcut) {
  const binding = normalizeShortcutBinding(shortcut);
  if (!binding) return false;

  if (binding.code && event.code !== binding.code) return false;
  if (binding.key && normalizeKey(event.key) !== normalizeKey(binding.key)) return false;

  if (Boolean(binding.shiftKey) !== event.shiftKey) return false;
  if (Boolean(binding.altKey) !== event.altKey) return false;
  if (Boolean(binding.ctrlKey) !== event.ctrlKey) return false;
  if (Boolean(binding.metaKey) !== event.metaKey) return false;

  return true;
}

export function normalizeShortcutBinding(shortcut) {
  if (!shortcut || typeof shortcut !== "object") return null;

  const key = typeof shortcut.key === "string" ? shortcut.key.trim() : "";
  const code = typeof shortcut.code === "string" ? shortcut.code.trim() : "";
  if (!key && !code) return null;

  return {
    ...(key ? { key } : {}),
    ...(code ? { code } : {}),
    ...(shortcut.shiftKey ? { shiftKey: true } : {}),
    ...(shortcut.altKey ? { altKey: true } : {}),
    ...(shortcut.ctrlKey ? { ctrlKey: true } : {}),
    ...(shortcut.metaKey ? { metaKey: true } : {}),
  };
}

export function shortcutFromKeyboardEvent(event) {
  if (!event || modifierKeys.has(event.key)) return null;

  return normalizeShortcutBinding({
    key: event.key,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  });
}

export function areShortcutBindingsEqual(left, right) {
  const normalizedLeft = normalizeShortcutBinding(left);
  const normalizedRight = normalizeShortcutBinding(right);
  if (!normalizedLeft || !normalizedRight) return false;

  return normalizeKey(normalizedLeft.key) === normalizeKey(normalizedRight.key)
    && normalizeKey(normalizedLeft.code) === normalizeKey(normalizedRight.code)
    && Boolean(normalizedLeft.shiftKey) === Boolean(normalizedRight.shiftKey)
    && Boolean(normalizedLeft.altKey) === Boolean(normalizedRight.altKey)
    && Boolean(normalizedLeft.ctrlKey) === Boolean(normalizedRight.ctrlKey)
    && Boolean(normalizedLeft.metaKey) === Boolean(normalizedRight.metaKey);
}

export function formatShortcutKeys(shortcut) {
  const binding = normalizeShortcutBinding(shortcut);
  if (!binding) return "Unassigned";

  const parts = [];
  if (binding.ctrlKey) parts.push("Ctrl");
  if (binding.metaKey) parts.push("Meta");
  if (binding.altKey) parts.push("Alt");
  if (binding.shiftKey) parts.push("Shift");
  parts.push(formatKey(binding.key || binding.code));

  return parts.join(" + ");
}

function formatKey(key) {
  const keyMap = {
    " ": "Space",
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    ArrowDown: "↓",
    Escape: "Esc",
  };

  if (keyMap[key]) return keyMap[key];
  if (typeof key === "string" && key.length === 1) return key.toUpperCase();
  return key;
}

function normalizeKey(key = "") {
  return String(key).trim().toLowerCase();
}
