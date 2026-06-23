import { ui } from "../../styles";

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className={ui.toastMarked} role="status" aria-live="polite">
      {message}
    </div>
  );
}
