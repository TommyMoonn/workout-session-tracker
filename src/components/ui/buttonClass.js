import { cx } from "../../lib/cx";
import { ui } from "../../styles";

export function buttonClass(variant = "default", extra = "") {
  return cx(
    ui.buttonBase,
    variant === "primary" && ui.buttonPrimary,
    variant === "soft" && ui.buttonSoft,
    variant === "danger" && ui.buttonDanger,
    extra,
  );
}
