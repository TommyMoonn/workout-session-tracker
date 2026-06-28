import { describe, expect, it } from "vitest";
import { removeSetFromSessionLogs, updateSessionReview } from "./sessionUpdates";

const sessions = [
  {
    id: "session-1",
    setCount: 2,
    totalRestSeconds: 30,
    sets: [
      { id: "set-1", setNumber: 4, restActualSeconds: 10 },
      { id: "set-2", setNumber: 8, restActualSeconds: 20 },
    ],
    review: { workoutTags: ["Strength"], energy: 3 },
  },
  {
    id: "session-2",
    sets: [],
  },
];

describe("session updates", () => {
  it("removes and renumbers a set while recalculating session totals", () => {
    const result = removeSetFromSessionLogs(sessions, "session-1", "set-1");

    expect(result[0]).toMatchObject({
      setCount: 1,
      totalRestSeconds: 20,
      sets: [{ id: "set-2", setNumber: 1, restActualSeconds: 20 }],
    });
    expect(result[1]).toBe(sessions[1]);
  });

  it("normalizes an updated review without changing other sessions", () => {
    const result = updateSessionReview(sessions, "session-1", {
      workoutTags: ["Cardio", "cardio"],
      energy: 8,
      thoughts: 42,
    });

    expect(result[0].review).toMatchObject({
      workoutTags: ["Cardio"],
      energy: 5,
      thoughts: "42",
    });
    expect(result[1]).toBe(sessions[1]);
  });
});
