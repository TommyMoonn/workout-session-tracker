import { createEmptyReview, normalizeReview, normalizeSetLogs } from "@domain/workout";

export function createSetLog({
  id,
  setNumber,
  completedAt,
  completedAtSessionSeconds,
  previousRestEndSeconds,
  restTargetSeconds,
  shouldAutoStartRest,
}) {
  return {
    id,
    setNumber,
    completedAt,
    completedAtSessionSeconds,
    timeToCompleteSetSeconds: Math.max(0, completedAtSessionSeconds - previousRestEndSeconds),
    restTargetSeconds,
    restStartedAt: shouldAutoStartRest ? completedAt : null,
    restStartedAtSessionSeconds: shouldAutoStartRest ? completedAtSessionSeconds : null,
    restEndedAt: null,
    restEndedAtSessionSeconds: null,
    restActualSeconds: null,
    status: shouldAutoStartRest ? "Resting" : "Set logged",
  };
}

export function updateSetRest(setLogs, setId, {
  status,
  endedAt,
  actualSeconds,
  endedAtSessionSeconds,
}) {
  if (!setId) return setLogs;

  return setLogs.map((log) => (
    log.id === setId
      ? {
        ...log,
        restEndedAt: endedAt,
        restEndedAtSessionSeconds: endedAtSessionSeconds,
        restActualSeconds: Math.max(0, actualSeconds),
        status,
      }
      : log
  ));
}

export function createFinishDraft({
  activeSetId,
  endedAt,
  restActualSeconds,
  setLogs,
  workoutSeconds,
}) {
  const finalSetLogs = updateSetRest(setLogs, activeSetId, {
    status: "Session finished",
    endedAt,
    actualSeconds: restActualSeconds,
    endedAtSessionSeconds: workoutSeconds,
  });
  const totalRestSeconds = finalSetLogs.reduce(
    (sum, log) => sum + (log.restActualSeconds ?? 0),
    0
  );

  return {
    id: `session-${endedAt}`,
    startedAt: endedAt - workoutSeconds * 1000,
    endedAt,
    workoutSeconds,
    totalRestSeconds,
    setCount: finalSetLogs.length,
    sets: normalizeSetLogs(finalSetLogs),
  };
}

export function createLoggedSession(finishDraft, sessionReview) {
  return {
    ...finishDraft,
    review: normalizeReview(sessionReview),
  };
}

export function createSessionReview() {
  return createEmptyReview();
}
