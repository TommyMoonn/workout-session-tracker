import { useEffect, useId, useRef, useState } from "react";
import { cx } from "../../lib/cx";
import { ui } from "../../styles";
import { MarkerLabel } from "./MarkerLabel";

export function SelectField({ label, value, options, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldId = useId();
  const rootRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div ref={rootRef} className={cx(ui.filterField, className)}>
      <MarkerLabel as="span">{label}</MarkerLabel>
      <div className={cx(ui.dropdownRoot, isOpen && "z-[120]")}>
        <button
          type="button"
          className={cx(ui.dropdownButton, isOpen && ui.dropdownButtonOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={fieldId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="min-w-0 truncate">{selectedOption?.label ?? value}</span>
          <span className={ui.dropdownIndicator} aria-hidden="true">[v]</span>
        </button>

        {isOpen && (
          <div id={fieldId} role="listbox" className={ui.dropdownPanel} tabIndex={-1}>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cx(ui.dropdownOption, isSelected && ui.dropdownOptionSelected)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className={isSelected ? "oc-x-before" : "oc-empty-before"}>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
