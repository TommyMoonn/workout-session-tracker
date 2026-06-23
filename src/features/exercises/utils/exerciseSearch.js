import exercises from "../../../data/exercises.json";
import { toEmbeddableVideoUrl } from "./video";

export const allOption = "All";
export const demoFilterOptions = ["Has demo", "No demo"];

export const searchableExercises = exercises.map((exercise) => {
  const normalizedEquipment = normalizeEquipment(exercise.equipment);
  const embedUrl = toEmbeddableVideoUrl(exercise.demoUrl);

  return {
    ...exercise,
    normalizedEquipment,
    embedUrl,
    hasDemo: Boolean(embedUrl),
    searchableText: buildExerciseSearchText(exercise, normalizedEquipment),
  };
});

export function filterExercises(exercisesToFilter, filters) {
  const queryTokens = tokenizeSearch(filters.query);

  return exercisesToFilter.filter((exercise) => (
    matchesSearchTokens(exercise.searchableText, queryTokens)
    && (filters.category === allOption || exercise.category === filters.category)
    && (filters.equipment === allOption || exercise.normalizedEquipment === filters.equipment)
    && (filters.difficulty === allOption || exercise.difficulty === filters.difficulty)
    && (filters.demoFilter === allOption || (filters.demoFilter === "Has demo" ? exercise.hasDemo : !exercise.hasDemo))
  ));
}

export function getExerciseOptions() {
  return {
    categories: unique(searchableExercises.map((item) => item.category)),
    equipmentOptions: unique(searchableExercises.map((item) => item.normalizedEquipment)),
    difficultyOptions: unique(searchableExercises.map((item) => item.difficulty)),
  };
}

function normalizeForSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]+/g, " ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactForSearch(value) {
  return normalizeForSearch(value).replace(/\s+/g, "");
}

function tokenizeSearch(value) {
  const normalized = normalizeForSearch(value);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildExerciseSearchText(exercise, normalizedEquipment) {
  const pieces = [
    exercise.id,
    exercise.name,
    exercise.category,
    normalizedEquipment,
    exercise.difficulty,
    exercise.movementType,
    exercise.description,
    ...(exercise.primaryMuscles ?? []),
    ...(exercise.searchKeywords ?? []),
  ];

  const friendlyText = normalizeForSearch(pieces.join(" "));
  const compactText = pieces.map(compactForSearch).filter(Boolean).join(" ");

  return `${friendlyText} ${compactText}`;
}

function matchesSearchTokens(searchableText, queryTokens) {
  if (queryTokens.length === 0) return true;

  const normalizedText = normalizeForSearch(searchableText);
  const compactText = compactForSearch(searchableText);
  const compactQuery = queryTokens.join("");

  return queryTokens.every((token) => normalizedText.includes(token) || compactText.includes(token))
    || compactText.includes(compactQuery);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function normalizeEquipment(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Bodyweight";
  if (["dumbells", "dumbell", "dumbbells"].includes(text.toLowerCase())) return "Dumbbell";
  return text;
}
