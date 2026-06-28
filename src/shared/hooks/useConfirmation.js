import { useState } from "react";

export function useConfirmation() {
  const [confirmation, setConfirmation] = useState(null);

  function requestConfirmation(options) {
    setConfirmation({
      cancelLabel: "Cancel",
      confirmLabel: "Confirm",
      variant: "danger",
      ...options,
    });
  }

  function cancelConfirmation() {
    setConfirmation(null);
  }

  function confirmAction() {
    const action = confirmation?.onConfirm;
    setConfirmation(null);
    action?.();
  }

  return {
    cancelConfirmation,
    confirmation,
    confirmAction,
    requestConfirmation,
  };
}
