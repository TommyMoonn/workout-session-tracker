import { cx } from "../lib/cx";
import { ui } from "../styles";

export function MarkedPill({ children, marker = "[x]", selected = false, className = "" }) {
  return (
    <span className={cx(ui.pill, selected && ui.pillSelected, className)}>
      <span className={selected ? "text-current" : ui.marker}>{marker}</span>
      <span>{children}</span>
    </span>
  );
}
