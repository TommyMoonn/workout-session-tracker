import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { ExerciseBrowser } from "./ExerciseBrowser";
import { ExerciseFilters } from "./ExerciseFilters";
import { ExercisePageHeader } from "./ExercisePageHeader";

export function ExerciseLibrary({ state, actions }) {
  return (
    <div className={ui.page}>
      <div className={ui.reveal}>
        <ExercisePageHeader totalExerciseCount={state.totalExerciseCount} />
      </div>

      <div className={cx(ui.reveal1, "relative z-30")}>
        <ExerciseFilters state={state} actions={actions} />
      </div>

      <div className={cx(ui.reveal, ui.reveal2, "relative z-0")}>
        <ExerciseBrowser state={state} actions={actions} />
      </div>
    </div>
  );
}
