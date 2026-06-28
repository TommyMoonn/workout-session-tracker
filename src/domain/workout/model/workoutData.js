export const maxWorkoutTagsPerSession = 5;

export function createEmptyReview() {
  return {
    workoutType: "",
    workoutTags: [],
    thoughts: "",
    energy: 0,
    difficulty: 0,
    mood: 0,
    overallExperience: 0,
  };
}

export function normalizeReview(review) {
  const source = review && typeof review === "object" ? review : {};
  const workoutTags = normalizeWorkoutTags(source.workoutTags, source.workoutType);

  return {
    workoutType: workoutTags[0] ?? "",
    workoutTags,
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

function normalizeWorkoutTags(tags, fallbackTag) {
  const sourceTags = Array.isArray(tags) ? tags : [fallbackTag];
  const uniqueTags = new Map();

  sourceTags.forEach((tag) => {
    const trimmedTag = String(tag ?? "").trim();
    if (!trimmedTag) return;

    const normalizedTag = trimmedTag.toLowerCase();
    if (!uniqueTags.has(normalizedTag)) {
      uniqueTags.set(normalizedTag, trimmedTag);
    }
  });

  return Array.from(uniqueTags.values()).slice(0, maxWorkoutTagsPerSession);
}

function clampRating(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(5, Math.floor(number)));
}
