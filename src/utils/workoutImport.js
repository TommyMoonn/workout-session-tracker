import { normalizeReview, normalizeSetLogs } from "./workoutData";

export const workoutHistoryExportFormat = "liftlog-lite.workout-history";
export const workoutHistoryExportVersion = 2;

export function buildWorkoutHistoryExportPayload(sessionLogs) {
  const usedIds = new Set();
  const normalizedSessions = getSessionArray(sessionLogs)
    .map((session, index) => normalizeImportedSession(session, index, usedIds))
    .filter(Boolean);

  return {
    format: workoutHistoryExportFormat,
    version: workoutHistoryExportVersion,
    exportedAt: new Date().toISOString(),
    sessionCount: normalizedSessions.length,
    sessionLogs: normalizedSessions,
  };
}

export function parseWorkoutHistoryImport(rawContent) {
  let data;

  try {
    data = JSON.parse(String(rawContent || "{}"));
  } catch {
    return invalidImport("Invalid JSON file.");
  }

  const rawSessions = extractSessionLogs(data);

  if (!Array.isArray(rawSessions)) {
    return invalidImport("Unknown workout backup format.");
  }

  if (rawSessions.length === 0) {
    return invalidImport("JSON file has no workout sessions.");
  }

  const usedIds = new Set();
  const sessions = rawSessions
    .map((session, index) => normalizeImportedSession(session, index, usedIds))
    .filter(Boolean);
  const skippedCount = rawSessions.length - sessions.length;

  if (sessions.length === 0) {
    return invalidImport("No valid workout sessions found.");
  }

  return {
    ok: true,
    sessions,
    skippedCount,
    totalCount: rawSessions.length,
  };
}

function extractSessionLogs(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data.sessionLogs)) return data.sessionLogs;
  return null;
}

function normalizeImportedSession(rawSession, index, usedIds = new Set()) {
  if (!rawSession || typeof rawSession !== "object" || Array.isArray(rawSession)) return null;

  const startedAt = normalizeTimestamp(rawSession.startedAt);
  const rawEndedAt = normalizeTimestamp(rawSession.endedAt);
  const fallbackWorkoutSeconds = rawEndedAt && startedAt
    ? Math.max(0, Math.floor((rawEndedAt - startedAt) / 1000))
    : 0;
  const workoutSeconds = normalizeInteger(rawSession.workoutSeconds, fallbackWorkoutSeconds);
  const endedAt = rawEndedAt ?? (startedAt ? startedAt + workoutSeconds * 1000 : null);

  if (!startedAt || !endedAt) return null;

  const sessionId = getUniqueSessionId(rawSession.id, endedAt, index, usedIds);
  const sets = normalizeImportedSets(rawSession.sets, sessionId);
  const totalRestSeconds = normalizeInteger(
    rawSession.totalRestSeconds,
    sets.reduce((sum, set) => sum + (set.restActualSeconds ?? 0), 0)
  );

  return {
    ...rawSession,
    id: sessionId,
    startedAt,
    endedAt,
    workoutSeconds,
    totalRestSeconds,
    setCount: sets.length,
    sets,
    review: normalizeReview(rawSession.review),
  };
}

function normalizeImportedSets(rawSets, sessionId) {
  if (!Array.isArray(rawSets)) return [];

  return normalizeSetLogs(
    rawSets
      .filter((set) => set && typeof set === "object" && !Array.isArray(set))
      .map((set, index) => ({
        ...set,
        id: normalizeText(set.id) || `${sessionId}-set-${index + 1}`,
        completedAt: normalizeTimestamp(set.completedAt),
        completedAtSessionSeconds: normalizeInteger(set.completedAtSessionSeconds, 0),
        timeToCompleteSetSeconds: normalizeInteger(set.timeToCompleteSetSeconds, 0),
        restTargetSeconds: normalizeInteger(set.restTargetSeconds, 0),
        restStartedAt: normalizeTimestamp(set.restStartedAt),
        restStartedAtSessionSeconds: normalizeInteger(set.restStartedAtSessionSeconds, 0),
        restEndedAt: normalizeTimestamp(set.restEndedAt),
        restEndedAtSessionSeconds: normalizeOptionalInteger(set.restEndedAtSessionSeconds),
        restActualSeconds: normalizeOptionalInteger(set.restActualSeconds),
        status: normalizeText(set.status),
      }))
  );
}

function getUniqueSessionId(rawId, endedAt, index, usedIds) {
  const baseId = normalizeText(rawId) || `session-${endedAt}-${index + 1}`;
  let nextId = baseId;
  let suffix = 2;

  while (usedIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(nextId);
  return nextId;
}

function normalizeTimestamp(value) {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
  }

  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeInteger(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.floor(number));
}

function normalizeOptionalInteger(value) {
  if (value == null || value === "") return null;
  return normalizeInteger(value, 0);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function getSessionArray(value) {
  return Array.isArray(value) ? value : [];
}

function invalidImport(message) {
  return {
    ok: false,
    message,
    sessions: [],
    skippedCount: 0,
    totalCount: 0,
  };
}
