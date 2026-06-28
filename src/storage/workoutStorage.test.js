import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  readWorkoutStorage,
  saveWorkoutStorage,
  updateWorkoutStorage,
  WORKOUT_STORAGE_KEY,
} from "./workoutStorage";

describe("workout storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and reads workout state", () => {
    const state = {
      savedAt: 1000,
      sessionLogs: [{ id: "session-1" }],
    };

    saveWorkoutStorage(state);

    expect(readWorkoutStorage()).toEqual(state);
  });

  it("patches stored state without removing unrelated values", () => {
    saveWorkoutStorage({
      sessionLogs: [{ id: "session-1" }],
      historyDisplayMode: "cards",
    });

    updateWorkoutStorage({
      selectedSessionId: "session-1",
    });

    expect(readWorkoutStorage()).toEqual({
      sessionLogs: [{ id: "session-1" }],
      historyDisplayMode: "cards",
      selectedSessionId: "session-1",
    });
  });

  it("returns empty state when stored JSON is malformed", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, "{invalid");

    expect(readWorkoutStorage()).toEqual({});
  });
});
