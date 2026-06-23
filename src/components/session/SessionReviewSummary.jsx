import { Button } from "../ui";
import { ui } from "../../styles";
import { normalizeReview } from "../../utils/workoutData";

export function SessionReviewSummary({ session, onEditReview }) {
  const review = normalizeReview(session?.review);

  return (
    <div className={ui.reviewBox}>
      <div className={ui.rowBetween}>
        <div>
          <p className={ui.labelMarker}>Session notes</p>
          <h3 className={ui.smallTitle}>{review.workoutType.trim() || "No workout type added"}</h3>
        </div>
        <Button variant="soft" onClick={onEditReview}>Edit notes</Button>
      </div>

      <div className={ui.ratingGrid}>
        <RatingPill label="Energy" value={review.energy} />
        <RatingPill label="Difficulty" value={review.difficulty} />
        <RatingPill label="Mood" value={review.mood} />
        <RatingPill label="Experience" value={review.overallExperience} />
      </div>

      <p className={ui.reviewThoughts}>{review.thoughts.trim() || "No thoughts added."}</p>
    </div>
  );
}

function RatingPill({ label, value }) {
  return (
    <div className={ui.pillMarked}>
      {label}: {value ?? 0}/5
    </div>
  );
}
