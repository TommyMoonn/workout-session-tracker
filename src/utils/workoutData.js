export function createEmptyReview() {
  return {
    workoutType: "",
    thoughts: "",
    energy: 0,
    difficulty: 0,
    mood: 0,
    overallExperience: 0,
  };
}

export function normalizeReview(review) {
  const source = review && typeof review === "object" ? review : {};
  return {
    workoutType: String(source.workoutType ?? ""),
    thoughts: String(source.thoughts ?? ""),
    energy: clampRating(source.energy),
    difficulty: clampRating(source.difficulty),
    mood: clampRating(source.mood),
    overallExperience: clampRating(source.overallExperience),
  };
}

export function normalizeSetLogs(logs) {
  return logs.map((log, index) => ({ ...log, setNumber: index + 1 }));
}

function clampRating(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(5, Math.floor(number)));
}
