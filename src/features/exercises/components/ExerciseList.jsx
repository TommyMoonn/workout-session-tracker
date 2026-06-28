import { forwardRef } from "react";
import { Button, EmptyBlock } from "@shared/ui";
import { cx } from "@shared/lib";
import { exerciseUi as ui } from "../styles";

export const ExerciseList = forwardRef(function ExerciseList({
  className = "",
  exercises,
  onClearFilters,
  onSelectExercise,
  selectedExercise,
}, ref) {
  return (
    <aside ref={ref} className={cx(ui.exerciseList, className)}>
      {exercises.length === 0 ? (
        <EmptyBlock
          className={ui.exerciseEmptyState}
          action={(
            <Button variant="soft" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        >
          No exercises match the current filters.
        </EmptyBlock>
      ) : (
        exercises.map((exercise) => {
          const isSelected = selectedExercise?.id === exercise.id;
          const targetMuscles = (exercise.primaryMuscles ?? []).join(" · ");

          return (
            <button
              key={exercise.id}
              type="button"
              aria-current={isSelected ? "true" : undefined}
              onClick={() => onSelectExercise(exercise.id)}
              className={cx(ui.exerciseRow, isSelected && ui.exerciseRowSelected)}
            >
              <div className="min-w-0">
                <p className={ui.exerciseRowTitle}>{exercise.name}</p>
                <p className={ui.exerciseRowMuscles}>
                  {targetMuscles || "Target muscles not listed"}
                </p>
                <p className={ui.exerciseRowMeta}>
                  {exercise.difficulty} · {exercise.normalizedEquipment}
                </p>
              </div>
              {exercise.hasDemo && (
                <span className={ui.exerciseRowSignals}>
                  <span className={ui.exerciseDemoIndicator} aria-label="Demo video available">
                    [demo]
                  </span>
                </span>
              )}
            </button>
          );
        })
      )}
    </aside>
  );
});
