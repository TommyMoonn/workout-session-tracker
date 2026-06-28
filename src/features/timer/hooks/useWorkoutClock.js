import { useCallback, useEffect, useRef } from "react";
import { timerTickMs } from "../constants";
import { readTimerTimestamp } from "../model/timerClock";

export function useWorkoutClock({
  elapsedBeforeStart,
  isRunning,
  onTick,
  startedAt,
}) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  const getElapsedSeconds = useCallback(() => {
    if (!startedAt) return elapsedBeforeStart;
    return elapsedBeforeStart + Math.floor((readTimerTimestamp() - startedAt) / 1000);
  }, [elapsedBeforeStart, startedAt]);

  useEffect(() => {
    if (!isRunning || !startedAt) return undefined;

    const ticker = window.setInterval(() => {
      onTickRef.current(getElapsedSeconds());
    }, timerTickMs);

    return () => window.clearInterval(ticker);
  }, [getElapsedSeconds, isRunning, startedAt]);

  return getElapsedSeconds;
}
