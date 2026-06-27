import { Button, EmptyBlock, MarkedPill, MarkerLabel } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { ExerciseVideo } from "./ExerciseVideo";

export function ExerciseDetail({
  backButtonRef,
  className = "",
  exercise,
  onBack,
}) {
  if (!exercise) {
    return (
      <div className={cx(ui.exerciseDetailPane, className)}>
        <EmptyBlock>Select an exercise to view details.</EmptyBlock>
      </div>
    );
  }

  return (
    <article className={cx(ui.exerciseDetailPane, className)}>
      <div className={ui.exerciseMobileDetailToolbar}>
        <Button ref={backButtonRef} variant="soft" className="max-[520px]:w-auto" onClick={onBack}>
          ← Exercises
        </Button>
      </div>

      <div className={ui.exerciseDetailCard}>
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
