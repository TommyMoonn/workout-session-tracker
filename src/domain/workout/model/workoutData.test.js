import { describe, expect, it } from "vitest";
import {
  createEmptyReview,
  normalizeReview,
  normalizeSetLogs,
} from "./workoutData";

describe("workout data", () => {
  it("creates an independent empty review", () => {
    const firstReview = createEmptyReview();
    const secondReview = createEmptyReview();

    firstReview.workoutTags.push("strength");

    expect(secondReview).toEqual({
      workoutType: "",
      workoutTags: [],
      thoughts: "",
      energy: 0,
      difficulty: 0,
      mood: 0,
      overallExperience: 0,
    });
  });

  it("normalizes review tags, text, and ratings", () => {
    expect(normalizeReview({
      workoutTags: [" Strength ", "strength", "Cardio", "", "Mobility", "Core", "Arms", "Extra"],
      thoughts: 42,
      energy: 7,
      difficulty: 3.9,
      mood: -2,
      overallExperience: "4",
    })).toEqual({
      workoutType: "Strength",
      workoutTags: ["Strength", "Cardio", "Mobility", "Core", "Arms"],
      thoughts: "42",
      energy: 5,
      difficulty: 3,
      mood: 0,
      overallExperience: 4,
    });
  });

  it("renumbers set logs without discarding their data", () => {
    const logs = [
      { id: "set-a", setNumber: 4, timeToCompleteSetSeconds: 30 },
      { id: "set-b", setNumber: 8, timeToCompleteSetSeconds: 45 },
    ];

    expect(normalizeSetLogs(logs)).toEqual([
      { id: "set-a", setNumber: 1, timeToCompleteSetSeconds: 30 },
      { id: "set-b", setNumber: 2, timeToCompleteSetSeconds: 45 },
    ]);
  });
});
