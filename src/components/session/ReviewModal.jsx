import { Button } from "../ui";
import { ui } from "../../styles";

export function ReviewModal({ title, subtitle, review, onChange, onCancel, onSave, mode }) {
  function update(field, value) {
    onChange({ ...review, [field]: value });
  }

  return (
    <div className={ui.modalOverlay} onMouseDown={onCancel}>
      <section className={ui.modalPanel} onMouseDown={(event) => event.stopPropagation()}>
        <div className={ui.modalHeader}>
          <div>
            <p className={ui.labelMarker}>{mode === "edit" ? "Edit session notes" : "Finish workout"}</p>
            <h2 className={ui.sectionTitle}>{title}</h2>
            <p className={ui.bodyCopy}>{subtitle}</p>
          </div>
          <Button variant="soft" onClick={onCancel}>X</Button>
        </div>

        <div className={ui.formGrid}>
          <label className={ui.fullSpan}>
            <span className={ui.labelMarker}>Workout type</span>
            <input
              className={ui.input}
              value={review.workoutType}
              onChange={(event) => update("workoutType", event.target.value)}
              placeholder="Push day, pull + legs, chest day..."
            />
          </label>

          <RatingInput label="Energy" value={review.energy} onChange={(value) => update("energy", value)} />
          <RatingInput label="Difficulty" value={review.difficulty} onChange={(value) => update("difficulty", value)} />
          <RatingInput label="Mood" value={review.mood} onChange={(value) => update("mood", value)} />
          <RatingInput label="Experience" value={review.overallExperience} onChange={(value) => update("overallExperience", value)} />

          <label className={ui.fullSpan}>
            <span className={ui.labelMarker}>Thoughts and feelings</span>
            <textarea
              className={ui.textarea}
              rows={5}
              value={review.thoughts}
              onChange={(event) => update("thoughts", event.target.value)}
              placeholder="How did the session feel? Any notes for next time?"
            />
          </label>
        </div>

        <footer className={ui.modalFooter}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>{mode === "edit" ? "Save notes" : "Save session"}</Button>
        </footer>
      </section>
    </div>
  );
}

function RatingInput({ label, value, onChange }) {
  return (
    <label className={ui.ratingInput}>
      <span className={ui.labelMarker}>{label}</span>
      <div className={ui.ratingRow}>
        <input type="range" min="0" max="5" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <span className={ui.ratingNumber}>{value}</span>
      </div>
    </label>
  );
}
