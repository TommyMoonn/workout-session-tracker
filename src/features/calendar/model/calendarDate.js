export function toLocalDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
}

export function groupSessionsByLocalDate(sessions) {
  const groups = new Map();

  for (const session of Array.isArray(sessions) ? sessions : []) {
    const dateKey = toLocalDateKey(session?.startedAt);
    if (!dateKey) continue;

    const savedSessions = groups.get(dateKey) ?? [];
    groups.set(dateKey, [...savedSessions, session]);
  }

  return groups;
}

export function createMonthDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return new Date(safeDate.getFullYear(), safeDate.getMonth(), 1);
}

export function shiftMonth(monthDate, offset) {
  const month = createMonthDate(monthDate);
  return new Date(month.getFullYear(), month.getMonth() + offset, 1);
}

export function buildCalendarMonth(monthDate, sessionsByDate = new Map()) {
  const month = createMonthDate(monthDate);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingDays = month.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const occupiedCells = leadingDays + daysInMonth;
  const cellCount = Math.max(35, Math.ceil(occupiedCells / 7) * 7);

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - leadingDays + 1;
    if (day < 1 || day > daysInMonth) return null;

    const date = new Date(year, monthIndex, day);
    const dateKey = toLocalDateKey(date);

    return {
      date,
      dateKey,
      day,
      sessions: sessionsByDate.get(dateKey) ?? [],
    };
  });
}

export function formatMonthTitle(monthDate, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(createMonthDate(monthDate));
}

function pad(value) {
  return String(value).padStart(2, "0");
}
