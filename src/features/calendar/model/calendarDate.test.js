import { describe, expect, it } from "vitest";
import {
  buildCalendarMonth,
  groupSessionsByLocalDate,
  shiftMonth,
  toLocalDateKey,
} from "./calendarDate";

describe("workout calendar date helpers", () => {
  it("groups multiple sessions by their local calendar date", () => {
    const firstDate = new Date(2026, 5, 29, 0, 15);
    const secondDate = new Date(2026, 5, 29, 23, 45);
    const nextDate = new Date(2026, 5, 30, 0, 5);
    const sessions = [
      { id: "first", startedAt: firstDate.getTime() },
      { id: "second", startedAt: secondDate.getTime() },
      { id: "next", startedAt: nextDate.getTime() },
      { id: "invalid", startedAt: "not-a-date" },
    ];

    const grouped = groupSessionsByLocalDate(sessions);

    expect(grouped.get("2026-06-29")?.map((session) => session.id)).toEqual([
      "first",
      "second",
    ]);
    expect(grouped.get("2026-06-30")?.map((session) => session.id)).toEqual(["next"]);
    expect(grouped.size).toBe(2);
  });

  it("builds a complete leap-year month with workout counts", () => {
    const leapDayKey = toLocalDateKey(new Date(2024, 1, 29, 12));
    const grouped = new Map([
      [leapDayKey, [{ id: "leap-1" }, { id: "leap-2" }]],
    ]);

    const days = buildCalendarMonth(new Date(2024, 1, 1), grouped);
    const calendarDates = days.filter(Boolean);

    expect(calendarDates).toHaveLength(29);
    expect(calendarDates.at(-1)).toMatchObject({
      dateKey: "2024-02-29",
      day: 29,
      sessions: [{ id: "leap-1" }, { id: "leap-2" }],
    });
    expect(days.length % 7).toBe(0);
  });

  it("navigates across month and year boundaries", () => {
    expect(toLocalDateKey(shiftMonth(new Date(2026, 11, 1), 1))).toBe("2027-01-01");
    expect(toLocalDateKey(shiftMonth(new Date(2026, 0, 1), -1))).toBe("2025-12-01");
  });
});
