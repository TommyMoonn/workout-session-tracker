import { useCallback, useEffect, useRef } from "react";
import { MarkedPill, MarkerLabel } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { ExerciseDetail } from "./ExerciseDetail";
import { ExerciseList } from "./ExerciseList";

export function ExerciseBrowser({
  state,
  actions,
  isCompactDetailOpen,
  onChangeCompactDetail,
}) {
  const browserRef = useRef(null);
  const backButtonRef = useRef(null);
  const listRef = useRef(null);
  const savedListScrollRef = useRef(0);
  const savedPageScrollRef = useRef(0);
  const selectedExerciseIndex = state.filteredExercises.findIndex(
    (exercise) => exercise.id === state.selectedExercise?.id,
  );
  const previousExercise = selectedExerciseIndex > 0
    ? state.filteredExercises[selectedExerciseIndex - 1]
    : null;
  const nextExercise = selectedExerciseIndex >= 0
    ? state.filteredExercises[selectedExerciseIndex + 1] ?? null
    : null;
  const getSelectedExerciseRow = useCallback(
    () => listRef.current?.querySelector('[aria-current="true"]') ?? null,
    [],
  );
  const scrollSelectedExerciseIntoView = useCallback(() => {
    const list = listRef.current;
    const selectedRow = getSelectedExerciseRow();
    if (!list || !selectedRow) return;

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const visibleTop = list.scrollTop;
    const visibleBottom = visibleTop + list.clientHeight;

    if (rowTop < visibleTop) {
      list.scrollTop = rowTop;
    } else if (rowBottom > visibleBottom) {
      list.scrollTop = rowBottom - list.clientHeight;
    }
  }, [getSelectedExerciseRow]);

  useEffect(() => {
    if (isCompactDetailOpen || !state.selectedExercise) return undefined;

    const frame = window.requestAnimationFrame(() => {
      scrollSelectedExerciseIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isCompactDetailOpen, scrollSelectedExerciseIntoView, state.selectedExercise]);

  function selectExercise(exerciseId) {
    actions.setSelectedExerciseId(exerciseId);

    if (!window.matchMedia("(max-width: 1119px)").matches) return;

    savedListScrollRef.current = listRef.current?.scrollTop ?? 0;
    savedPageScrollRef.current = window.scrollY;
    onChangeCompactDetail(true);
    window.requestAnimationFrame(() => {
      browserRef.current?.scrollIntoView({ block: "start" });
      backButtonRef.current?.focus({ preventScroll: true });
    });
  }

  function closeCompactDetail() {
    onChangeCompactDetail(false);
    window.requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = savedListScrollRef.current;
      window.scrollTo({ top: savedPageScrollRef.current });
      const selectedRow = getSelectedExerciseRow();
      scrollSelectedExerciseIntoView();
      selectedRow?.focus({ preventScroll: true });
    });
  }

  function showAdjacentExercise(exercise) {
    if (!exercise) return;
    actions.setSelectedExerciseId(exercise.id);
  }

  return (
    <section ref={browserRef} className={ui.browserCard}>
      <div className={cx(
        ui.browserHeader,
        ui.panelToolbarPadding,
        isCompactDetailOpen && "max-[1120px]:hidden",
      )}>
        <div className={ui.browserHeaderSummary}>
          <div>
            <MarkerLabel>Results</MarkerLabel>
            <h2 className={ui.panelTitle}>{state.filteredExercises.length} exercise{state.filteredExercises.length === 1 ? "" : "s"}</h2>
          </div>
          {state.selectedExercise && (
            <MarkedPill selected className={ui.selectedExercisePill}>
              {state.selectedExercise.name}
            </MarkedPill>
          )}
        </div>
      </div>

      <div className={ui.exerciseBrowserBody}>
        <ExerciseList
          ref={listRef}
          exercises={state.filteredExercises}
          onClearFilters={actions.clearFilters}
          onSelectExercise={selectExercise}
          selectedExercise={state.selectedExercise}
          className={isCompactDetailOpen ? "max-[1120px]:hidden" : ""}
        />
        <ExerciseDetail
          exercise={state.selectedExercise}
          backButtonRef={backButtonRef}
          onBack={closeCompactDetail}
          onNext={() => showAdjacentExercise(nextExercise)}
          onPrevious={() => showAdjacentExercise(previousExercise)}
          hasNext={Boolean(nextExercise)}
          hasPrevious={Boolean(previousExercise)}
          resultPosition={`${selectedExerciseIndex + 1} of ${state.filteredExercises.length}`}
          className={isCompactDetailOpen ? "" : "max-[1120px]:hidden"}
        />
      </div>
    </section>
  );
}
