import { EmptyBlock, MarkedPill, MarkerLabel } from "../../../components/ui";
import { ui } from "../../../styles";
import { ExerciseVideo } from "./ExerciseVideo";

export function ExerciseDetail({ exercise }) {
  if (!exercise) {
    return <div className={ui.exerciseDetailPane}><EmptyBlock>Select an exercise to view details.</EmptyBlock></div>;
  }

  return (
    <article className={ui.exerciseDetailPane}>
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
