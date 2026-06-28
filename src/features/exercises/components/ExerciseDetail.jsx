import { useEffect, useRef } from "react";
import { Button, EmptyBlock, MarkedPill, MarkerLabel } from "@shared/ui";
import { cx } from "@shared/lib/cx";
import { ui } from "@shared/styles";
import { ExerciseVideo } from "./ExerciseVideo";

export function ExerciseDetail({
  backButtonRef,
  className = "",
  exercise,
  hasNext,
  hasPrevious,
  onBack,
  onNext,
  onPrevious,
  resultPosition,
}) {
  const detailPaneRef = useRef(null);

  useEffect(() => {
    if (detailPaneRef.current) detailPaneRef.current.scrollTop = 0;
  }, [exercise?.id]);

  if (!exercise) {
    return (
      <div className={cx(ui.exerciseDetailPane, className)}>
        <EmptyBlock>Select an exercise to view details.</EmptyBlock>
      </div>
    );
  }

  return (
    <article ref={detailPaneRef} className={cx(ui.exerciseDetailPane, className)}>
      <div className={ui.exerciseDetailToolbar}>
        <Button ref={backButtonRef} variant="soft" className={ui.exerciseDetailBack} onClick={onBack}>
          ← Exercises
        </Button>
        <div className={ui.exerciseDetailPager}>
          <span className={ui.exerciseResultPosition}>{resultPosition}</span>
          <Button variant="soft" onClick={onPrevious} disabled={!hasPrevious}>
            ← Previous
          </Button>
          <Button variant="soft" onClick={onNext} disabled={!hasNext}>
            Next →
          </Button>
        </div>
      </div>

      <div key={exercise.id} className={cx(ui.exerciseDetailCard, ui.exerciseDetailContentIn)}>
        <MarkerLabel>Exercise detail</MarkerLabel>
        <h2 className={ui.detailTitle}>{exercise.name}</h2>
        <p className={ui.bodyCopy}>{exercise.description}</p>

        <div className={ui.exerciseBadgeGrid}>
          <InfoBadge label="Category" value={exercise.category} />
          <InfoBadge label="Difficulty" value={exercise.difficulty} />
          <InfoBadge label="Equipment" value={exercise.normalizedEquipment} />
          <InfoBadge label="Rest" value={`${exercise.defaultRestSeconds}s`} />
          <InfoBadge label="Default sets" value={exercise.defaultSets} />
          <InfoBadge label="Default reps" value={exercise.defaultReps} />
          <InfoBadge label="Movement" value={exercise.movementType} />
        </div>

        <div className={ui.sectionBlock}>
          <MarkerLabel>Target muscles</MarkerLabel>
          <div className={ui.pillWrap}>
            {(exercise.primaryMuscles ?? []).map((muscle) => (
              <MarkedPill key={muscle}>{muscle}</MarkedPill>
            ))}
          </div>
        </div>

        <ExerciseVideo exercise={exercise} />
      </div>
    </article>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div className={ui.infoBadge}>
      <MarkerLabel>{label}</MarkerLabel>
      <p className={ui.infoBadgeValue}>{value}</p>
    </div>
  );
}
