import { useMemo, useState } from "react";
import { readWorkoutStorage } from "@domain/workout";
import {
  buildCalendarMonth,
  createMonthDate,
  formatLocalDateTitle,
  formatMonthTitle,
  groupSessionsByLocalDate,
  shiftMonth,
  toLocalDateKey,
} from "../model/calendarDate";

export function useWorkoutCalendar(options = {}) {
  const {
    now = new Date(),
    sessionLogs: providedSessionLogs,
  } = options;
  const [storedSessionLogs] = useState(() => {
    if (Array.isArray(providedSessionLogs)) return [];
    const storedSessions = readWorkoutStorage()?.sessionLogs;
    return Array.isArray(storedSessions) ? storedSessions : [];
  });
  const sessionLogs = Array.isArray(providedSessionLogs)
    ? providedSessionLogs
    : storedSessionLogs;
  const [visibleMonth, setVisibleMonth] = useState(() => createMonthDate(now));
  const [selectedDateKey, setSelectedDateKey] = useState(() => toLocalDateKey(now));
  const todayKey = toLocalDateKey(now);
  const sessionsByDate = useMemo(
    () => groupSessionsByLocalDate(sessionLogs),
    [sessionLogs]
  );
  const calendarDays = useMemo(
    () => buildCalendarMonth(visibleMonth, sessionsByDate),
    [sessionsByDate, visibleMonth]
  );
  const selectedDateSessions = sessionsByDate.get(selectedDateKey) ?? [];

  function showToday() {
    setVisibleMonth(createMonthDate(now));
    setSelectedDateKey(todayKey);
  }

  return {
    state: {
      calendarDays,
      monthTitle: formatMonthTitle(visibleMonth),
      selectedDateKey,
      selectedDateSessions,
      selectedDateTitle: formatLocalDateTitle(selectedDateKey),
      sessionCount: sessionLogs.length,
      todayKey,
    },
    actions: {
      nextMonth: () => setVisibleMonth((current) => shiftMonth(current, 1)),
      previousMonth: () => setVisibleMonth((current) => shiftMonth(current, -1)),
      selectDate: setSelectedDateKey,
      showToday,
    },
  };
}
