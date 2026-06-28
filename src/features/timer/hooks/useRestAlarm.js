import { useEffect, useRef, useState } from "react";
import { playChillAlarm, useSoundSettings } from "@features/settings/sound";
import { restAlertAutoDismissMs } from "../constants";

export function useRestAlarm() {
  const alarmLoopRef = useRef(null);
  const restAlertDismissTimerRef = useRef(null);
  const alarmContextsRef = useRef([]);
  const [restAlert, setRestAlert] = useState(false);
  const { settings } = useSoundSettings();

  useEffect(() => () => {
    window.clearTimeout(restAlertDismissTimerRef.current);
    stopRestAlarm();
  }, []);

  useEffect(() => {
    if (!restAlert || settings.restAlertSoundEnabled) return;
    stopRestAlarm();
  }, [restAlert, settings.restAlertSoundEnabled]);

  function showRestEndedAlert() {
    stopRestAlarm();
    window.clearTimeout(restAlertDismissTimerRef.current);
    setRestAlert(true);

    if (settings.restAlertSoundEnabled) {
      startRestAlarmLoop();
    }

    restAlertDismissTimerRef.current = window.setTimeout(closeRestAlert, restAlertAutoDismissMs);
  }

  function closeRestAlert() {
    window.clearTimeout(restAlertDismissTimerRef.current);
    restAlertDismissTimerRef.current = null;
    stopRestAlarm();
    setRestAlert(false);
  }

  function startRestAlarmLoop() {
    playChillAlarm(alarmContextsRef, settings.restAlertVolume);

    if (!settings.restAlertRepeatEnabled) return;

    alarmLoopRef.current = window.setInterval(
      () => playChillAlarm(alarmContextsRef, settings.restAlertVolume),
      1750
    );
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
