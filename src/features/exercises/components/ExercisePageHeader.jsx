import { MarkerLabel } from "@shared/ui";
import { ui } from "@shared/styles";

export function ExercisePageHeader({ totalExerciseCount }) {
  return (
    <section className={ui.pageHeader}>
      <div>
        <MarkerLabel>Exercise library</MarkerLabel>
        <h1 className={ui.pageTitle}>Exercises</h1>
      </div>
      <div className={ui.countCard}>
        <span className={ui.countLabel}>Total</span>
        <strong className={ui.countValue}>{totalExerciseCount}</strong>
      </div>
    </section>
  );
}
