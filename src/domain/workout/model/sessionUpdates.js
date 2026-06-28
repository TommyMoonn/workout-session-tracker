import { normalizeReview, normalizeSetLogs } from "./workoutData";

export function removeSetFromSessionLogs(sessionLogs, sessionId, setId) {
  return sessionLogs.map((session) => {
    if (session.id !== sessionId) return session;

    const sets = normalizeSetLogs(
      (session.sets || []).filter((set) => set.id !== setId)
    );

    return {
      ...session,
      sets,
      setCount: sets.length,
      totalRestSeconds: sets.reduce(
        (sum, set) => sum + (set.restActualSeconds ?? 0),
        0
      ),
    };
  });
}

export function updateSessionReview(sessionLogs, sessionId, review) {
  const normalizedReview = normalizeReview(review);

  return sessionLogs.map((session) => (
    session.id === sessionId
      ? { ...session, review: normalizedReview }
      : session
  ));
}
