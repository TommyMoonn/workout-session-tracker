import { maxWorkoutTagsPerSession, normalizeReview } from "../utils/workoutData";

export const allWorkoutTypesValue = "all";
export const untaggedWorkoutTypeValue = "__untagged__";
export { maxWorkoutTagsPerSession };

export const workoutTagOptions = [
  { value: "Push", label: "Push" },
  { value: "Pull", label: "Pull" },
  { value: "Legs", label: "Legs" },
  { value: "Upper", label: "Upper" },
  { value: "Lower", label: "Lower" },
  { value: "Full body", label: "Full body" },
  { value: "Cardio", label: "Cardio" },
  { value: "Mobility", label: "Mobility" },
  { value: "Other", label: "Other" },
];

export const workoutTypeOptions = [
  { value: "", label: "No tag" },
  ...workoutTagOptions,
];

const predefinedTypeLabels = new Map(
  workoutTagOptions.map((option) => [normalizeWorkoutTypeValue(option.value), option.label])
);

export function normalizeWorkoutTypeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getWorkoutTags(session) {
  return normalizeReview(session?.review).workoutTags;
}

export function getWorkoutType(session) {
  return getWorkoutTags(session)[0] ?? "";
}

export function getWorkoutTypeLabel(value) {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue) return "No tag";
  return predefinedTypeLabels.get(normalizeWorkoutTypeValue(trimmedValue)) ?? trimmedValue;
}

export function getWorkoutTagsLabel(values) {
  const tags = Array.isArray(values) ? values : [values];
  const labels = tags.map(getWorkoutTypeLabel).filter((label) => label !== "No tag");
  return labels.length > 0 ? labels.join(" · ") : "No tags";
}

export function getReviewWorkoutTagOptions(currentValues) {
  const customOptions = new Map();
  const tags = Array.isArray(currentValues) ? currentValues : [currentValues];

  tags.forEach((tag) => {
    const trimmedTag = String(tag ?? "").trim();
    const normalizedTag = normalizeWorkoutTypeValue(trimmedTag);

    if (!trimmedTag || predefinedTypeLabels.has(normalizedTag)) return;
    customOptions.set(normalizedTag, trimmedTag);
  });

  return [
    ...workoutTagOptions,
    ...Array.from(customOptions.values())
      .sort((left, right) => left.localeCompare(right))
      .map((value) => ({ value, label: value })),
  ];
}

export function getReviewWorkoutTypeOptions(currentValue) {
  const currentType = String(currentValue ?? "").trim();
  const hasExactOption = workoutTypeOptions.some((option) => option.value === currentType);

  if (!currentType || hasExactOption) return workoutTypeOptions;

  return [
    ...workoutTypeOptions,
    { value: currentType, label: getWorkoutTypeLabel(currentType) },
  ];
}

export function buildWorkoutTypeFilterOptions(sessions) {
  const customOptions = new Map();

  sessions.forEach((session) => {
    getWorkoutTags(session).forEach((workoutTag) => {
      const normalizedTag = normalizeWorkoutTypeValue(workoutTag);

      if (!workoutTag || predefinedTypeLabels.has(normalizedTag)) return;
      customOptions.set(normalizedTag, workoutTag);
    });
  });

  return [
    { value: allWorkoutTypesValue, label: "All workouts" },
    { value: untaggedWorkoutTypeValue, label: "Untagged" },
    ...workoutTagOptions,
    ...Array.from(customOptions.values())
      .sort((left, right) => left.localeCompare(right))
      .map((value) => ({ value, label: value })),
  ];
}

export function matchesWorkoutTypeFilter(session, filterValue) {
  if (!filterValue || filterValue === allWorkoutTypesValue) return true;

  const workoutTags = getWorkoutTags(session);
  if (filterValue === untaggedWorkoutTypeValue) return workoutTags.length === 0;

  return workoutTags.some((tag) => (
    normalizeWorkoutTypeValue(tag) === normalizeWorkoutTypeValue(filterValue)
  ));
}
