import { useMemo, useState } from "react";
import { readWorkoutStorage } from "@domain/workout";
import {
  buildCalendarMonth,
  createMonthDate,
  formatMonthTitle,
  groupSessionsByLocalDate,
  shiftMonth,
  toLocalDateKey,
} from "../model/calendarDate";

export function useWorkoutCalendar(now = new Date()) {
  const [sessionLogs] = useState(() => {
    const storedSessions = readWorkoutStorage()?.sessionLogs;
    return Array.isArray(storedSessions) ? storedSessions : [];
  });
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

  function showToday() {
    setVisibleMonth(createMonthDate(now));
    setSelectedDateKey(todayKey);
  }

  return {
    state: {
      calendarDays,
      monthTitle: formatMonthTitle(visibleMonth),
      selectedDateKey,
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
