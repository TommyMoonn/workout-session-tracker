import { useCallback, useEffect, useRef } from "react";
import { timerTickMs } from "../constants";
import { readTimerTimestamp } from "../model/timerClock";

export function useRestClock({
  elapsedBeforeStart,
  isRunning,
  onComplete,
  onTick,
  remainingAtStart,
  startedAt,
}) {
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  });

  const getElapsedSeconds = useCallback(() => {
    if (!startedAt) return elapsedBeforeStart;
    return elapsedBeforeStart + Math.floor((readTimerTimestamp() - startedAt) / 1000);
  }, [elapsedBeforeStart, startedAt]);

  useEffect(() => {
    if (!isRunning || !startedAt) return undefined;

    const ticker = window.setInterval(() => {
      const elapsedSegment = Math.floor((readTimerTimestamp() - startedAt) / 1000);
      const remaining = Math.max(0, remainingAtStart - elapsedSegment);

      onTickRef.current(remaining);
      if (remaining <= 0) {
        window.clearInterval(ticker);
        onCompleteRef.current(getElapsedSeconds());
      }
    }, timerTickMs);

    return () => window.clearInterval(ticker);
  }, [getElapsedSeconds, isRunning, remainingAtStart, startedAt]);

  return getElapsedSeconds;
}
