import { EmptyBlock, MarkedPill } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";

export function ExerciseList({ exercises, onSelectExercise, selectedExercise }) {
  return (
    <aside className={ui.exerciseList}>
      {exercises.length === 0 ? (
        <EmptyBlock>No exercises match the current filters.</EmptyBlock>
      ) : (
        exercises.map((exercise) => {
          const isSelected = selectedExercise?.id === exercise.id;

          return (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onSelectExercise(exercise.id)}
              className={cx(ui.exerciseRow, isSelected && ui.rowSelected)}
            >
              <div className="min-w-0">
                <p className={ui.rowTitle}>{exercise.name}</p>
                <p className={cx(ui.rowMeta, isSelected && ui.rowMetaSelected)}>
                  {exercise.category} · {exercise.difficulty} · {exercise.normalizedEquipment}
                </p>
              </div>
              <MarkedPill selected={isSelected}>{exercise.movementType}</MarkedPill>
            </button>
          );
        })
      )}
    </aside>
  );
}
