import { useEffect, useRef, useState } from "react";
import { restAlertAutoDismissMs } from "../constants";
import { playChillAlarm } from "../utils/restAlarm";

export function useRestAlarm() {
  const alarmLoopRef = useRef(null);
  const restAlertDismissTimerRef = useRef(null);
  const alarmContextsRef = useRef([]);
  const [restAlert, setRestAlert] = useState(false);

  useEffect(() => () => {
    window.clearTimeout(restAlertDismissTimerRef.current);
    stopRestAlarm();
  }, []);

  function showRestEndedAlert() {
    stopRestAlarm();
    window.clearTimeout(restAlertDismissTimerRef.current);
    setRestAlert(true);
    startRestAlarmLoop();
    restAlertDismissTimerRef.current = window.setTimeout(closeRestAlert, restAlertAutoDismissMs);
  }

  function closeRestAlert() {
    window.clearTimeout(restAlertDismissTimerRef.current);
    restAlertDismissTimerRef.current = null;
    stopRestAlarm();
    setRestAlert(false);
  }

  function startRestAlarmLoop() {
    playChillAlarm(alarmContextsRef);
    alarmLoopRef.current = window.setInterval(() => playChillAlarm(alarmContextsRef), 1750);
  }

  function stopRestAlarm() {
    window.clearInterval(alarmLoopRef.current);
    alarmLoopRef.current = null;
    alarmContextsRef.current.forEach((audioContext) => {
      try {
        audioContext.close?.();
      } catch {
        // Ignore closed audio contexts.
      }
    });
    alarmContextsRef.current = [];
  }

  return { restAlert, closeRestAlert, showRestEndedAlert, stopRestAlarm };
}
