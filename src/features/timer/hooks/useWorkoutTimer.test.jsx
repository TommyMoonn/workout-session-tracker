import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  SoundSettingsProvider,
  soundSettingsStorageKey,
  TimerSettingsProvider,
  timerSettingsStorageKey,
} from "@features/settings";
import { WORKOUT_STORAGE_KEY } from "@domain/workout";
import { useWorkoutTimer } from "./useWorkoutTimer";

function TimerProviders({ children }) {
  return (
    <TimerSettingsProvider>
      <SoundSettingsProvider>
        {children}
      </SoundSettingsProvider>
    </TimerSettingsProvider>
  );
}

describe("useWorkoutTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));
    window.localStorage.clear();
    window.localStorage.setItem(soundSettingsStorageKey, JSON.stringify({
      restAlertSoundEnabled: false,
      restAlertRepeatEnabled: false,
      restAlertVolume: "medium",
    }));
  });

  it("restores running timers as paused without losing elapsed state", () => {
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify({
      selectedSessionId: "session-1",
      sessionLogs: [{ id: "session-1" }],
      activeSession: {
        workoutElapsed: 125,
        workoutStatus: "running",
        restDuration: 60,
        restDurationInput: "60",
        restRemaining: 35,
        restStatus: "running",
        activeSetId: "set-1",
        setLogs: [{ id: "set-1", setNumber: 1 }],
      },
    }));

    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    expect(result.current.state).toMatchObject({
      activeSetId: "set-1",
      restDuration: 60,
      restRemaining: 35,
      restStatus: "paused",
      setLogs: [{ id: "set-1", setNumber: 1 }],
      workoutElapsed: 125,
      workoutStatus: "paused",
    });
  });

  it("advances workout and rest timers using elapsed wall-clock time", () => {
    window.localStorage.setItem(timerSettingsStorageKey, JSON.stringify({
      defaultRestSeconds: 30,
      autoStartRestAfterSet: true,
      confirmResetSession: true,
    }));

    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    act(() => {
      result.current.actions.startWorkout();
    });
    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(result.current.state.workoutElapsed).toBe(3);

    act(() => {
      result.current.actions.completeSetAndStartRest();
    });

    expect(result.current.state).toMatchObject({
      activeSetId: expect.any(String),
      restDuration: 30,
      restRemaining: 30,
      restStatus: "running",
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.state.restRemaining).toBe(20);
  });

  it("adjusts only the active rest countdown", () => {
    window.localStorage.setItem(timerSettingsStorageKey, JSON.stringify({
      defaultRestSeconds: 30,
      autoStartRestAfterSet: true,
      confirmResetSession: true,
    }));

    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      result.current.actions.completeSetAndStartRest();
    });
    act(() => {
      vi.advanceTimersByTime(5_000);
      result.current.actions.adjustActiveRest(-10);
    });

    expect(result.current.state.restRemaining).toBe(15);
    expect(result.current.state.restDuration).toBe(30);
    expect(result.current.state.restDurationInput).toBe("30");
  });

  it("preserves elapsed workout time across pause and resume", () => {
    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    act(() => {
      result.current.actions.startWorkout();
    });
    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    act(() => {
      result.current.actions.pauseWorkout();
    });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.state).toMatchObject({
      workoutElapsed: 5,
      workoutStatus: "paused",
    });

    act(() => {
      result.current.actions.startWorkout();
    });
    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(result.current.state.workoutElapsed).toBe(7);
  });

  it("completes rest and records its actual duration", () => {
    window.localStorage.setItem(timerSettingsStorageKey, JSON.stringify({
      defaultRestSeconds: 10,
      autoStartRestAfterSet: true,
      confirmResetSession: true,
    }));
    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      result.current.actions.completeSetAndStartRest();
    });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.state).toMatchObject({
      activeSetId: null,
      restAlert: true,
      restStatus: "done",
      setLogs: [
        expect.objectContaining({
          restActualSeconds: 10,
          status: "Rest completed",
        }),
      ],
    });
  });

  it("logs a set without starting rest when auto-start is disabled", () => {
    window.localStorage.setItem(timerSettingsStorageKey, JSON.stringify({
      defaultRestSeconds: 45,
      autoStartRestAfterSet: false,
      confirmResetSession: true,
    }));
    const { result } = renderHook(() => useWorkoutTimer(), {
      wrapper: TimerProviders,
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      result.current.actions.completeSetAndStartRest();
    });

    expect(result.current.state).toMatchObject({
      activeSetId: null,
      restDuration: 45,
      restRemaining: 45,
      restStatus: "idle",
      setLogs: [
        expect.objectContaining({
          restStartedAt: null,
          status: "Set logged",
        }),
      ],
      workoutStatus: "running",
    });
  });
});
