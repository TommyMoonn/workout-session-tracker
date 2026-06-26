import { useEffect } from "react";
import { ui } from "../../styles";
import { Button } from "./Button";

export function ConfirmationDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  message,
  onCancel,
  onConfirm,
  title,
  variant = "danger",
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className={ui.modalOverlay} onMouseDown={onCancel}>
      <section
        className="w-[min(460px,100%)] border border-[var(--oc-hairline)] bg-[var(--oc-canvas)] p-5 text-[var(--oc-ink)] motion-safe:animate-[modalIn_var(--transition-base)_both]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-message"
        data-shortcut-blocking="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[var(--oc-hairline)] pb-4">
          <p className={ui.labelMarker}>Confirm action</p>
          <h2 id="confirmation-title" className={ui.sectionTitle}>{title}</h2>
          <p id="confirmation-message" className="mt-2 text-sm leading-6 text-[var(--oc-body)]">{message}</p>
        </div>

        <footer className={ui.modalFooter}>
          <Button type="button" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </footer>
      </section>
    </div>
  );
}
