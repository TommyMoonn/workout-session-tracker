import { forwardRef } from "react";
import { Button, MarkerLabel, SelectField } from "../../../components/ui";
import { ui } from "../../../styles";
import { allOption, demoFilterOptions } from "../utils/exerciseSearch";

export function ExerciseFilters({ state, actions, searchInputRef }) {
  const activeFilters = [
    state.query.trim() && {
      id: "query",
      label: `Search: ${state.query.trim()}`,
      onRemove: () => actions.setQuery(""),
    },
    state.category !== allOption && {
      id: "category",
      label: `Category: ${state.category}`,
      onRemove: () => actions.setCategory(allOption),
    },
    state.equipment !== allOption && {
      id: "equipment",
      label: `Equipment: ${state.equipment}`,
      onRemove: () => actions.setEquipment(allOption),
    },
    state.difficulty !== allOption && {
      id: "difficulty",
      label: `Difficulty: ${state.difficulty}`,
      onRemove: () => actions.setDifficulty(allOption),
    },
    state.demoFilter !== allOption && {
      id: "demo",
      label: `Demo: ${state.demoFilter}`,
      onRemove: () => actions.setDemoFilter(allOption),
    },
  ].filter(Boolean);

  return (
    <section className={`${ui.card} ${ui.panelPadding} relative overflow-visible`}>
      <div className={ui.toolbar}>
        <div>
          <MarkerLabel>Filters</MarkerLabel>
          <h2 className={ui.panelTitle}>Search and narrow the list</h2>
        </div>
        <Button variant="soft" onClick={actions.clearFilters} disabled={state.activeFilterCount === 0}>
          Clear filters
        </Button>
      </div>

      <div className={ui.exerciseFilterGrid}>
        <TextFilter ref={searchInputRef} value={state.query} onChange={actions.setQuery} />
        <FilterSelect label="Category" value={state.category} options={state.categories} onChange={actions.setCategory} />
        <FilterSelect label="Equipment" value={state.equipment} options={state.equipmentOptions} onChange={actions.setEquipment} />
        <FilterSelect label="Difficulty" value={state.difficulty} options={state.difficultyOptions} onChange={actions.setDifficulty} />
        <FilterSelect label="Demo" value={state.demoFilter} options={demoFilterOptions} onChange={actions.setDemoFilter} />
      </div>

      {activeFilters.length > 0 && (
        <div className={ui.exerciseActiveFilters}>
          <MarkerLabel as="span">Active</MarkerLabel>
          <div className={ui.exerciseActiveFilterList}>
            {activeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={ui.exerciseActiveFilter}
                aria-label={`Remove ${filter.label} filter`}
                onClick={filter.onRemove}
              >
                <span className="truncate">{filter.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const TextFilter = forwardRef(function TextFilter({ value, onChange }, ref) {
  return (
    <label className={`${ui.filterField} ${ui.exerciseSearchField}`}>
      <MarkerLabel as="span">Search</MarkerLabel>
      <input
        ref={ref}
        className={ui.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for workouts"
      />
    </label>
  );
});

function FilterSelect({ label, value, options, onChange }) {
  const dropdownOptions = [allOption, ...options].map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <SelectField
      label={label}
      value={value}
      options={dropdownOptions}
      onChange={onChange}
    />
  );
}
