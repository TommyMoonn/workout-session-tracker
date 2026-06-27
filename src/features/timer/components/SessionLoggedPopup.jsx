import { Link } from "react-router-dom";
import { Button } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDuration } from "../../../utils/workoutFormat";

export function SessionLoggedPopup({ session, onClose }) {
  return (
    <div className={ui.modalOverlay} onMouseDown={onClose}>
      <section className={cx(ui.modalPanel, "relative")} onMouseDown={(event) => event.stopPropagation()}>
        <Button
          variant="soft"
          className={ui.modalClose}
          onClick={onClose}
          aria-label="Close popup"
        >
          X
        </Button>

        <div className={cx(ui.modalHeader, "pr-20")}>
          <div>
            <p className={ui.labelMarker}>Session logged</p>
            <h2 className={ui.sectionTitle}>Saved to History.</h2>
            <p className={ui.bodyCopy}>
              Your workout was saved with {session.setCount} set{session.setCount === 1 ? "" : "s"},{" "}
              {formatDuration(session.workoutSeconds)} workout time, and{" "}
              {formatDuration(session.totalRestSeconds)} rest time.
            </p>
          </div>
        </div>

        <footer className={ui.modalFooter}>
          <Button onClick={onClose}>Stay on timer</Button>
          <Link className={cx(ui.buttonBase, ui.buttonPrimary)} to="/history" onClick={onClose}>
            Open history
          </Link>
        </footer>
      </section>
    </div>
  );
}
