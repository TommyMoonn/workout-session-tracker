import { getWorkoutTagsLabel } from "../domain/workoutTypes";
import { normalizeReview } from "./workoutData";
import { formatClock, formatDateTime, formatDuration } from "./workoutFormat";

export function buildSessionMarkdown(session) {
  const review = normalizeReview(session.review);
  const sets = Array.isArray(session.sets) ? session.sets : [];
  const lines = [
    `# Workout Session - ${formatDateTime(session.startedAt)}`,
    "",
    `- Workout time: ${formatDuration(session.workoutSeconds)}`,
    `- Total rest time: ${formatDuration(session.totalRestSeconds)}`,
    `- Sets: ${session.setCount}`,
    `- Workout tags: ${getWorkoutTagsLabel(review.workoutTags)}`,
    `- Energy: ${review.energy}/5`,
    `- Difficulty: ${review.difficulty}/5`,
    `- Mood: ${review.mood}/5`,
    `- Overall experience: ${review.overallExperience}/5`,
    "",
    "## Thoughts",
    "",
    review.thoughts || "No thoughts added.",
    "",
    "## Sets",
    "",
  ];

  if (sets.length === 0) {
    lines.push("No sets logged.");
    return lines.join("\n");
  }

  lines.push("| Set | Time to complete | Completed at | Rest target | Rest actual | Rest start | Rest end |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");

  sets.forEach((set) => {
    lines.push(`| ${set.setNumber} | ${formatClock(set.timeToCompleteSetSeconds ?? 0)} | ${formatClock(set.completedAtSessionSeconds ?? 0)} | ${formatClock(set.restTargetSeconds ?? 0)} | ${set.restActualSeconds == null ? "—" : formatClock(set.restActualSeconds)} | ${formatClock(set.restStartedAtSessionSeconds ?? 0)} | ${set.restEndedAtSessionSeconds == null ? "—" : formatClock(set.restEndedAtSessionSeconds)} |`);
  });

  return lines.join("\n");
}

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
