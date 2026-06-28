import { useRef, useState } from "react";

export function useToast(timeoutMs = 2800) {
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), timeoutMs);
  }

  return { toast, showToast };
}
