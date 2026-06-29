export const shortcutStorageKey = "liftlog-lite.shortcut-bindings.v1";

export const defaultShortcutBindings = {
  "nav.timer": { key: "1" },
  "nav.history": { key: "2" },
  "nav.exercises": { key: "3" },
  "nav.calendar": { key: "4" },
  "nav.settings": { key: ",", ctrlKey: true },
  "timer.startPause": { key: "s" },
  "timer.completeSetRest": { key: "r" },
  "timer.openSetLog": { key: "l" },
  "timer.finishSession": { key: "f" },
  "history.listView": { key: "l" },
  "history.cardView": { key: "c" },
  "history.previousPage": { key: "ArrowLeft" },
  "history.nextPage": { key: "ArrowRight" },
  "exercises.search": { key: "/" },
  "global.close": { key: "Escape" },
};

export const shortcutGroups = [
  {
    title: "Navigation",
    shortcuts: [
      { id: "nav.timer", label: "Timer Tab" },
      { id: "nav.history", label: "History Tab" },
      { id: "nav.exercises", label: "Exercises Tab" },
      { id: "nav.calendar", label: "Calendar Tab" },
      { id: "nav.settings", label: "Settings Tab" },
    ],
  },
  {
    title: "Timer",
    shortcuts: [
      { id: "timer.startPause", label: "Start / Pause workout session" },
      { id: "timer.completeSetRest", label: "Complete set and start rest" },
      { id: "timer.openSetLog", label: "Open set log panel" },
      { id: "timer.finishSession", label: "Finish and log session" },
    ],
  },
  {
    title: "History",
    shortcuts: [
      { id: "history.listView", label: "List view" },
      { id: "history.cardView", label: "Card view" },
      { id: "history.previousPage", label: "Previous page" },
      { id: "history.nextPage", label: "Next page" },
    ],
  },
  {
    title: "Exercises",
    shortcuts: [
      { id: "exercises.search", label: "Search workouts" },
    ],
  },
  {
    title: "Global",
    shortcuts: [
      { id: "global.close", label: "Close panel" },
    ],
  },
];

export const shortcutDefinitions = shortcutGroups.flatMap((group) => (
  group.shortcuts.map((shortcut) => ({ ...shortcut, groupTitle: group.title }))
));

export function getShortcutDefinition(shortcutId) {
  return shortcutDefinitions.find((shortcut) => shortcut.id === shortcutId) ?? null;
}
