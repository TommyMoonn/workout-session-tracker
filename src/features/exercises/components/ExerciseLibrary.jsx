import { useMemo, useRef, useState } from "react";
import { cx } from "@shared/lib";
import { exerciseUi as ui } from "../styles";
import { useKeyboardShortcuts } from "@features/settings";
import { ExerciseBrowser } from "./ExerciseBrowser";
import { ExerciseFilters } from "./ExerciseFilters";
import { ExercisePageHeader } from "./ExercisePageHeader";

export function ExerciseLibrary({ state, actions }) {
  const searchInputRef = useRef(null);
  const [isCompactDetailOpen, setIsCompactDetailOpen] = useState(false);
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
        if (isCompactDetailOpen) {
          setIsCompactDetailOpen(false);
          return;
        }
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          return;
        }
        if (state.query) {
          actions.setQuery("");
        }
      },
    },
  ], [actions, isCompactDetailOpen, state.query]);

  useKeyboardShortcuts(exerciseShortcuts);

  return (
    <div className={ui.pageWide}>
      <div className={cx(
        ui.reveal,
        isCompactDetailOpen && "max-[1120px]:hidden",
      )}>
        <ExercisePageHeader totalExerciseCount={state.totalExerciseCount} />
      </div>

      <div className={cx(
        ui.reveal1,
        "relative z-30",
        isCompactDetailOpen && "max-[1120px]:hidden",
      )}>
        <ExerciseFilters state={state} actions={actions} searchInputRef={searchInputRef} />
      </div>

      <div className={cx(ui.reveal, ui.reveal2, "relative z-0")}>
        <ExerciseBrowser
          state={state}
          actions={actions}
          isCompactDetailOpen={isCompactDetailOpen}
          onChangeCompactDetail={setIsCompactDetailOpen}
        />
      </div>
    </div>
  );
}
