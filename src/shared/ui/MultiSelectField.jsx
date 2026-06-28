import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { ui } from "../styles";
import { MarkerLabel } from "./MarkerLabel";

export function MultiSelectField({
  label,
  values = [],
  options,
  onChange,
  emptyLabel = "No tags",
  maxSelections = Number.POSITIVE_INFINITY,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldId = useId();
  const rootRef = useRef(null);
  const selectedValues = useMemo(() => normalizeSelectedValues(values), [values]);
  const selectedValueMap = useMemo(() => buildSelectedValueMap(selectedValues), [selectedValues]);
  const selectedLabel = buildSelectedLabel(selectedValues, options, emptyLabel);
  const hasSelectionLimit = Number.isFinite(maxSelections);
  const isAtSelectionLimit = hasSelectionLimit && selectedValues.length >= maxSelections;

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

  function toggleValue(nextValue) {
    const trimmedValue = String(nextValue ?? "").trim();
    if (!trimmedValue) return;

    const normalizedValue = normalizeValue(trimmedValue);
    const isSelected = selectedValueMap.has(normalizedValue);

    if (!isSelected && isAtSelectionLimit) return;

    const nextValues = isSelected
      ? selectedValues.filter((value) => normalizeValue(value) !== normalizedValue)
      : [...selectedValues, trimmedValue].slice(0, maxSelections);

    onChange(nextValues);
  }

  function clearValues() {
    onChange([]);
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
          <span className="min-w-0 truncate">{selectedLabel}</span>
          <span className={ui.dropdownIndicator} aria-hidden="true">[v]</span>
        </button>

        {isOpen && (
          <div id={fieldId} role="listbox" aria-multiselectable="true" className={ui.dropdownPanel} tabIndex={-1}>
            {selectedValues.length > 0 && (
              <button
                type="button"
                role="option"
                aria-selected="false"
                className={ui.dropdownOption}
                onClick={clearValues}
              >
                <span className="oc-empty-before">Clear tags</span>
              </button>
            )}

            {options.map((option) => {
              const isSelected = selectedValueMap.has(normalizeValue(option.value));
              const isDisabled = !isSelected && isAtSelectionLimit;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  disabled={isDisabled}
                  className={cx(
                    ui.dropdownOption,
                    isSelected && ui.dropdownOptionSelected,
                    isDisabled && "cursor-not-allowed opacity-40",
                  )}
                  onClick={() => toggleValue(option.value)}
                >
                  <span className={isSelected ? "oc-x-before" : "oc-empty-before"}>{option.label}</span>
                </button>
              );
            })}

            {hasSelectionLimit && (
              <p className="border-t border-[var(--oc-border-muted)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--oc-muted)]">
                {selectedValues.length}/{maxSelections} tags
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeSelectedValues(values) {
  const sourceValues = Array.isArray(values) ? values : [values];
  const uniqueValues = new Map();

  sourceValues.forEach((value) => {
    const trimmedValue = String(value ?? "").trim();
    if (!trimmedValue) return;
    uniqueValues.set(normalizeValue(trimmedValue), trimmedValue);
  });

  return Array.from(uniqueValues.values());
}

function buildSelectedValueMap(values) {
  return new Map(values.map((value) => [normalizeValue(value), value]));
}

function buildSelectedLabel(values, options, emptyLabel) {
  if (values.length === 0) return emptyLabel;

  const optionLabels = new Map(options.map((option) => [normalizeValue(option.value), option.label]));
  return values
    .map((value) => optionLabels.get(normalizeValue(value)) ?? value)
    .join(" · ");
}

function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}
