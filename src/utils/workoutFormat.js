export function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

export function formatClock(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export function formatFileTimestamp(timestamp) {
  const date = new Date(timestamp || Date.now());
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join("-");
}

export function clampSeconds(value, fallbackSeconds = 90) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallbackSeconds;
  return Math.max(1, Math.min(1800, Math.floor(number)));
}

function pad(value) {
  return String(value).padStart(2, "0");
}
