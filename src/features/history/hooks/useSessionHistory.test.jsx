import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WORKOUT_STORAGE_KEY } from "@domain/workout";
import { useSessionHistory } from "./useSessionHistory";

const session = {
  id: "session-1",
  startedAt: 1_000,
  endedAt: 2_000,
  workoutSeconds: 60,
  totalRestSeconds: 30,
  setCount: 2,
  sets: [
    { id: "set-1", setNumber: 1, restActualSeconds: 10 },
    { id: "set-2", setNumber: 2, restActualSeconds: 20 },
  ],
  review: {
    workoutTags: ["Strength"],
    thoughts: "",
    energy: 3,
    difficulty: 3,
    mood: 3,
    overallExperience: 3,
  },
};

describe("useSessionHistory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));
    window.localStorage.clear();
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify({
      sessionLogs: [session],
      historyDisplayMode: "card",
      historyPage: 1,
      workoutTypeFilter: "Strength",
    }));
  });

  it("preserves the page-facing state and action contract", () => {
    const { result } = renderHook(() => useSessionHistory());

    expect(result.current.state).toMatchObject({
      currentHistoryPage: 1,
      filteredSessionCount: 1,
      historyDisplayMode: "card",
      selectedSession: null,
      workoutTypeFilter: "Strength",
    });

    act(() => {
      result.current.actions.openSessionDetail("session-1");
    });

    expect(result.current.state.selectedSession?.id).toBe("session-1");

    act(() => {
      result.current.actions.deleteSessionSet("session-1", "set-1");
    });

    expect(result.current.state.selectedSession).toMatchObject({
      setCount: 1,
      totalRestSeconds: 20,
      sets: [{ id: "set-2", setNumber: 1 }],
    });
  });

  it("edits a session review through focused review actions", () => {
    const { result } = renderHook(() => useSessionHistory());

    act(() => {
      result.current.actions.openEditSessionReview(session);
    });
    act(() => {
      result.current.actions.setEditingReview({
        ...result.current.state.editingReview,
        thoughts: "Improved notes",
        energy: 5,
      });
    });
    act(() => {
      result.current.actions.saveEditSessionReview();
    });

    expect(result.current.state).toMatchObject({
      editingSession: null,
      sessionLogs: [
        expect.objectContaining({
          review: expect.objectContaining({
            thoughts: "Improved notes",
            energy: 5,
          }),
        }),
      ],
    });
  });
});
