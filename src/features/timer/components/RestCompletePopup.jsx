import { Button } from "../../../components/ui";
import { ui } from "../../../styles";

export function RestCompletePopup({ onClose }) {
  return (
    <div className={ui.restAlert} role="status" aria-live="polite">
      <div className={ui.rowBetween}>
        <div>
          <p className={ui.labelMarker}>Rest ended</p>
          <h2 className={ui.restAlertTitle}>Rest has ended.</h2>
        </div>
        <Button variant="soft" onClick={onClose}>X</Button>
      </div>
    </div>
  );
}
