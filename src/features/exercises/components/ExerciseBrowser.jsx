import { MarkedPill, MarkerLabel } from "../../../components/ui";
import { ui } from "../../../styles";
import { ExerciseDetail } from "./ExerciseDetail";
import { ExerciseList } from "./ExerciseList";

export function ExerciseBrowser({ state, actions }) {
  return (
    <section className={ui.browserCard}>
      <div className={`${ui.browserHeader} ${ui.panelToolbarPadding}`}>
        <div className={ui.browserHeaderSummary}>
          <div>
            <MarkerLabel>Results</MarkerLabel>
            <h2 className={ui.panelTitle}>{state.filteredExercises.length} exercise{state.filteredExercises.length === 1 ? "" : "s"}</h2>
          </div>
          {state.selectedExercise && (
            <MarkedPill selected className={ui.selectedExercisePill}>
              {state.selectedExercise.name}
            </MarkedPill>
          )}
        </div>
      </div>

      <div className={ui.exerciseBrowserBody}>
        <ExerciseList
          exercises={state.filteredExercises}
          onSelectExercise={actions.setSelectedExerciseId}
          selectedExercise={state.selectedExercise}
        />
        <ExerciseDetail exercise={state.selectedExercise} />
      </div>
    </section>
  );
}
