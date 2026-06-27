import { Button } from "../ui";
import { ui } from "../../styles";
import { getWorkoutTagsLabel } from "../../domain/workoutTypes";
import { normalizeReview } from "../../utils/workoutData";

export function SessionReviewSummary({ session, onEditReview }) {
  const review = normalizeReview(session?.review);
  const workoutTagsLabel = getWorkoutTagsLabel(review.workoutTags);
  const thoughts = review.thoughts.trim();

  return (
    <section className={ui.reviewBox}>
      <div className={ui.rowBetween}>
        <div className="min-w-0">
          <p className={ui.labelMarker}>Review</p>
          <h3 className={ui.smallTitle}>{workoutTagsLabel}</h3>
        </div>
        <Button variant="soft" className={ui.iconButton} onClick={onEditReview} aria-label="Edit review" title="Edit review">
          ✎
        </Button>
      </div>

      <div className={ui.ratingGrid}>
        <RatingPill label="Energy" value={review.energy} />
        <RatingPill label="Difficulty" value={review.difficulty} />
        <RatingPill label="Mood" value={review.mood} />
        <RatingPill label="Experience" value={review.overallExperience} />
      </div>

      <p className={ui.reviewThoughts}>{thoughts || "No notes."}</p>
    </section>
  );
}

function RatingPill({ label, value }) {
  return (
    <div className={ui.ratingPill}>
      <span className={ui.ratingLabel}>{label}</span>
      <span className={ui.ratingValue}>{value ?? 0}/5</span>
    </div>
  );
}
