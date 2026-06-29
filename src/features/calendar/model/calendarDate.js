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

export function calculateCurrentWorkoutStreak(sessionsByDate, today = new Date()) {
  if (!(sessionsByDate instanceof Map) || sessionsByDate.size === 0) return 0;

  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!sessionsByDate.has(toLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (sessionsByDate.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
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

export function formatLocalDateTitle(dateKey, locale) {
  const date = fromLocalDateKey(dateKey);
  if (!date) return "Selected date";

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function fromLocalDateKey(dateKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey));
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toLocalDateKey(date) === dateKey ? date : null;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
