import { useRef } from "react";
import { MarkedPill, MarkerLabel } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { ExerciseDetail } from "./ExerciseDetail";
import { ExerciseList } from "./ExerciseList";

export function ExerciseBrowser({
  state,
  actions,
  isMobileDetailOpen,
  onChangeMobileDetail,
}) {
  const browserRef = useRef(null);
  const backButtonRef = useRef(null);
  const listRef = useRef(null);
  const savedListScrollRef = useRef(0);
  const savedPageScrollRef = useRef(0);

  function selectExercise(exerciseId) {
    actions.setSelectedExerciseId(exerciseId);

    if (!window.matchMedia("(max-width: 760px)").matches) return;

    savedListScrollRef.current = listRef.current?.scrollTop ?? 0;
    savedPageScrollRef.current = window.scrollY;
    onChangeMobileDetail(true);
    window.requestAnimationFrame(() => {
      browserRef.current?.scrollIntoView({ block: "start" });
      backButtonRef.current?.focus({ preventScroll: true });
    });
  }

  function closeMobileDetail() {
    onChangeMobileDetail(false);
    window.requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = savedListScrollRef.current;
      window.scrollTo({ top: savedPageScrollRef.current });
      listRef.current
        ?.querySelector('[aria-current="true"]')
        ?.focus({ preventScroll: true });
    });
  }

  return (
    <section ref={browserRef} className={ui.browserCard}>
      <div className={cx(
        ui.browserHeader,
        ui.panelToolbarPadding,
        isMobileDetailOpen && "max-[760px]:hidden",
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
          onSelectExercise={selectExercise}
          selectedExercise={state.selectedExercise}
          className={isMobileDetailOpen ? "max-[760px]:hidden" : ""}
        />
        <ExerciseDetail
          exercise={state.selectedExercise}
          backButtonRef={backButtonRef}
          onBack={closeMobileDetail}
          className={isMobileDetailOpen ? "" : "max-[760px]:hidden"}
        />
      </div>
    </section>
  );
}
