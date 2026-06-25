import { Button } from "../ui";
import { ui } from "../../styles";
import { normalizeReview } from "../../utils/workoutData";

export function SessionReviewSummary({ session, onEditReview }) {
  const review = normalizeReview(session?.review);
  const workoutType = review.workoutType.trim();
  const thoughts = review.thoughts.trim();

  return (
    <section className={ui.reviewBox}>
      <div className={ui.rowBetween}>
        <div className="min-w-0">
          <p className={ui.labelMarker}>Review</p>
          <h3 className={ui.smallTitle}>{workoutType || "Untitled workout"}</h3>
        </div>
        <Button variant="soft" className="h-9 w-9 shrink-0 px-0 text-base leading-none" onClick={onEditReview} aria-label="Edit review" title="Edit review">
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
