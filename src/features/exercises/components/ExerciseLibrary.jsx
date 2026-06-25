import { useMemo, useRef } from "react";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { useKeyboardShortcuts } from "../../shortcuts";
import { ExerciseBrowser } from "./ExerciseBrowser";
import { ExerciseFilters } from "./ExerciseFilters";
import { ExercisePageHeader } from "./ExercisePageHeader";

export function ExerciseLibrary({ state, actions }) {
  const searchInputRef = useRef(null);
  const exerciseShortcuts = useMemo(() => [
    {
      id: "exercises.search",
      handler: () => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      },
    },
    {
      id: "global.close",
      allowInEditable: true,
      handler: () => {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          return;
        }
        if (state.query) {
          actions.setQuery("");
        }
      },
    },
  ], [actions, state.query]);

  useKeyboardShortcuts(exerciseShortcuts);

  return (
    <div className={ui.page}>
      <div className={ui.reveal}>
        <ExercisePageHeader totalExerciseCount={state.totalExerciseCount} />
      </div>

      <div className={cx(ui.reveal1, "relative z-30")}>
        <ExerciseFilters state={state} actions={actions} searchInputRef={searchInputRef} />
      </div>

      <div className={cx(ui.reveal, ui.reveal2, "relative z-0")}>
        <ExerciseBrowser state={state} actions={actions} />
      </div>
    </div>
  );
}
