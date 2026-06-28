import { describe, expect, it } from "vitest";
import { createFinishDraft } from "./sessionLifecycle";
import { timerActionTypes, timerReducer } from "./timerReducer";
import {
  selectHasActiveSession,
  selectRestProgress,
  selectTotalRestSeconds,
  selectWorkoutSummary,
} from "./timerSelectors";
import { createInitialTimerState } from "./timerState";

describe("timer model", () => {
  it("restores running clocks as paused", () => {
    const state = createInitialTimerState({
      activeSession: {
        workoutElapsed: 125,
        workoutStatus: "running",
        restDuration: 60,
        restRemaining: 35,
        restStatus: "running",
        activeSetId: "set-1",
        setLogs: [{ id: "set-1" }],
      },
    });

    expect(state).toMatchObject({
      activeSetId: "set-1",
      restDuration: 60,
      restRemaining: 35,
      restStatus: "paused",
      workoutElapsed: 125,
      workoutStatus: "paused",
    });
  });

  it("handles set and rest transitions through reducer actions", () => {
    const initialState = createInitialTimerState();
    const restingState = timerReducer(initialState, {
      type: timerActionTypes.setCompleted,
      autoStartRest: true,
      restSeconds: 30,
      setId: "set-1",
      setLogs: [{ id: "set-1", status: "Resting" }],
      startWorkout: true,
      timestamp: 1_000,
    });
    const pausedState = timerReducer(restingState, {
      type: timerActionTypes.restPaused,
      elapsed: 8,
      remaining: 22,
    });
    const completedState = timerReducer(pausedState, {
      type: timerActionTypes.restReset,
      seconds: 30,
      setLogs: [{ id: "set-1", status: "Rest completed", restActualSeconds: 8 }],
      status: "done",
    });

    expect(restingState).toMatchObject({
      activeSetId: "set-1",
      restRemaining: 30,
      restStatus: "running",
      workoutStatus: "running",
    });
    expect(pausedState).toMatchObject({
      restElapsedBeforeStart: 8,
      restRemaining: 22,
      restStatus: "paused",
    });
    expect(completedState).toMatchObject({
      activeSetId: null,
      restRemaining: 30,
      restStatus: "done",
    });
  });

  it("derives timer display state without mutating source data", () => {
    const state = {
      restDuration: 40,
      restRemaining: 10,
      setLogs: [
        { restActualSeconds: 12 },
        { restActualSeconds: null },
        { restActualSeconds: 8 },
      ],
      workoutElapsed: 2_100,
      workoutStatus: "paused",
    };

    expect(selectHasActiveSession(state)).toBe(true);
    expect(selectRestProgress(state)).toBe(75);
    expect(selectTotalRestSeconds(state)).toBe(20);
    expect(selectWorkoutSummary(state)).toBe("Strong session");
  });

  it("builds a normalized finish draft and closes active rest", () => {
    const draft = createFinishDraft({
      activeSetId: "set-2",
      endedAt: 20_000,
      restActualSeconds: 15,
      setLogs: [
        { id: "set-1", setNumber: 4, restActualSeconds: 10 },
        { id: "set-2", setNumber: 8, restActualSeconds: null },
      ],
      workoutSeconds: 120,
    });

    expect(draft).toMatchObject({
      id: "session-20000",
      startedAt: -100_000,
      endedAt: 20_000,
      workoutSeconds: 120,
      totalRestSeconds: 25,
      setCount: 2,
      sets: [
        { id: "set-1", setNumber: 1, restActualSeconds: 10 },
        {
          id: "set-2",
          setNumber: 2,
          restActualSeconds: 15,
          status: "Session finished",
        },
      ],
    });
  });
});
