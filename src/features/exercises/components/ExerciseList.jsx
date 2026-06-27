import { forwardRef } from "react";
import { EmptyBlock, MarkedPill } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";

export const ExerciseList = forwardRef(function ExerciseList({
  className = "",
  exercises,
  onSelectExercise,
  selectedExercise,
}, ref) {
  return (
    <aside ref={ref} className={cx(ui.exerciseList, className)}>
      {exercises.length === 0 ? (
        <EmptyBlock>No exercises match the current filters.</EmptyBlock>
      ) : (
        exercises.map((exercise) => {
          const isSelected = selectedExercise?.id === exercise.id;

          return (
            <button
              key={exercise.id}
              type="button"
              aria-current={isSelected ? "true" : undefined}
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
});
