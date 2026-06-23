import { cx } from "../../lib/cx";
import { ui } from "../../styles";
import { MarkerLabel } from "./MarkerLabel";

export function SelectField({ label, value, onChange, children, className = "" }) {
  return (
    <label className={cx(ui.filterField, className)}>
      <MarkerLabel as="span">{label}</MarkerLabel>
      <span className={ui.selectWrap}>
        <select className={ui.select} value={value} onChange={onChange}>
          {children}
        </select>
      </span>
    </label>
  );
}
