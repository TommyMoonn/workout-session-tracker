import { cx } from "../../lib/cx";
import { ui } from "../../styles";

export function MarkerLabel({ children, marker = "[+]", className = "", as: Tag = "p" }) {
  return (
    <Tag className={cx(ui.label, className)}>
      <span className={ui.marker}>{marker}</span> {children}
    </Tag>
  );
}
