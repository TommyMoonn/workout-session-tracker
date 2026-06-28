import { describe, expect, it, vi } from "vitest";
import {
  buildWorkoutHistoryExportPayload,
  parseWorkoutHistoryImport,
  workoutHistoryExportFormat,
  workoutHistoryExportVersion,
} from "./workoutImport";

const validSession = {
  id: "session-1",
  startedAt: 1_700_000_000_000,
  endedAt: 1_700_000_060_000,
  workoutSeconds: 60,
  sets: [
    {
      id: "set-1",
      setNumber: 7,
      completedAtSessionSeconds: 25,
      restActualSeconds: 10,
    },
  ],
  review: {
    workoutTags: ["Strength"],
    energy: 4,
  },
};

describe("workout history serialization", () => {
  it("builds a versioned normalized export payload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));

    const payload = buildWorkoutHistoryExportPayload([validSession]);

    expect(payload).toMatchObject({
      format: workoutHistoryExportFormat,
      version: workoutHistoryExportVersion,
      exportedAt: "2026-06-28T12:00:00.000Z",
      sessionCount: 1,
    });
    expect(payload.sessionLogs[0]).toMatchObject({
      id: "session-1",
      workoutSeconds: 60,
      totalRestSeconds: 10,
      setCount: 1,
      sets: [{ id: "set-1", setNumber: 1, restActualSeconds: 10 }],
    });
  });

  it("imports supported shapes and makes duplicate IDs unique", () => {
    const result = parseWorkoutHistoryImport(JSON.stringify({
      sessionLogs: [
        validSession,
        { ...validSession },
        null,
      ],
    }));

    expect(result).toMatchObject({
      ok: true,
      skippedCount: 1,
      totalCount: 3,
    });
    expect(result.sessions.map((session) => session.id)).toEqual([
      "session-1",
      "session-1-2",
    ]);
  });

  it.each([
    ["not json", "Invalid JSON file."],
    [JSON.stringify({ unknown: [] }), "Unknown workout backup format."],
    [JSON.stringify({ sessionLogs: [] }), "JSON file has no workout sessions."],
  ])("rejects invalid imports", (content, message) => {
    expect(parseWorkoutHistoryImport(content)).toEqual({
      ok: false,
      message,
      sessions: [],
      skippedCount: 0,
      totalCount: 0,
    });
  });
});
