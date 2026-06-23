import { Button, MarkerLabel, SelectField } from "../../../components/ui";
import { ui } from "../../../styles";
import { allOption, demoFilterOptions } from "../utils/exerciseSearch";

export function ExerciseFilters({ state, actions }) {
  return (
    <section className={ui.card + " " + ui.cardPadding}>
      <div className={ui.toolbar}>
        <div>
          <MarkerLabel>Filters</MarkerLabel>
          <h2 className={ui.sectionTitle}>Search and narrow the list</h2>
        </div>
        <Button variant="soft" onClick={actions.clearFilters} disabled={state.activeFilterCount === 0}>
          Clear filters
        </Button>
      </div>

      <div className={ui.exerciseFilterGrid}>
        <TextFilter value={state.query} onChange={actions.setQuery} />
        <FilterSelect label="Category" value={state.category} options={state.categories} onChange={actions.setCategory} />
        <FilterSelect label="Equipment" value={state.equipment} options={state.equipmentOptions} onChange={actions.setEquipment} />
        <FilterSelect label="Difficulty" value={state.difficulty} options={state.difficultyOptions} onChange={actions.setDifficulty} />
        <FilterSelect label="Demo" value={state.demoFilter} options={demoFilterOptions} onChange={actions.setDemoFilter} />
      </div>
    </section>
  );
}

function TextFilter({ value, onChange }) {
  return (
    <label className={ui.filterField}>
      <MarkerLabel as="span">Search</MarkerLabel>
      <input
        className={ui.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for workouts"
      />
    </label>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <SelectField label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value={allOption}>All</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </SelectField>
  );
}
