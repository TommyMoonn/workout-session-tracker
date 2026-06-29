import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WORKOUT_STORAGE_KEY } from "@domain/workout";
import { useWorkoutCalendar } from "./useWorkoutCalendar";

describe("useWorkoutCalendar", () => {
  it("defaults to today and navigates months without mutating workout history", () => {
    const today = new Date(2026, 5, 29, 12);
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify({
      sessionLogs: [
        { id: "session-1", startedAt: today.getTime() },
        { id: "session-2", startedAt: today.getTime() + 60_000 },
      ],
    }));
    const { result } = renderHook(() => useWorkoutCalendar({ now: today }));

    expect(result.current.state).toMatchObject({
      monthTitle: "June 2026",
      selectedDateKey: "2026-06-29",
      sessionCount: 2,
      todayKey: "2026-06-29",
    });
    expect(result.current.state.selectedDateTitle).toContain("Monday");
    expect(result.current.state.selectedDateTitle).toContain("June");
    expect(result.current.state.selectedDateTitle).toContain("29");
    expect(result.current.state.selectedDateTitle).toContain("2026");
    expect(result.current.state.selectedDateSessions).toHaveLength(2);
    expect(
      result.current.state.calendarDays.find((day) => day?.dateKey === "2026-06-29")?.sessions
    ).toHaveLength(2);

    act(() => result.current.actions.nextMonth());
    expect(result.current.state.monthTitle).toBe("July 2026");

    act(() => result.current.actions.previousMonth());
    expect(result.current.state.monthTitle).toBe("June 2026");

    act(() => result.current.actions.selectDate("2026-06-12"));
    expect(result.current.state.selectedDateKey).toBe("2026-06-12");

    act(() => result.current.actions.showToday());
    expect(result.current.state.selectedDateKey).toBe("2026-06-29");
    expect(JSON.parse(window.localStorage.getItem(WORKOUT_STORAGE_KEY)).sessionLogs).toHaveLength(2);
  });
});
