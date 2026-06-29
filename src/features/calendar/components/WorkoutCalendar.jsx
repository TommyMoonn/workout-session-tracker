import { useLayoutEffect, useRef, useState } from "react";
import {
  formatDateTime,
  formatDuration,
  ReviewModal,
  SessionDetail,
} from "@domain/workout";
import { SessionSummaryCard } from "@features/history";
import { Button, ConfirmationDialog, EmptyBlock, Toast } from "@shared/ui";
import { useConfirmation } from "@shared/hooks";
import { cx } from "@shared/lib";
import { calendarUi as ui } from "../styles";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WorkoutCalendar({ state, actions }) {
  const {
    cancelConfirmation,
    confirmation,
    confirmAction,
    requestConfirmation,
  } = useConfirmation();
  const backButtonRef = useRef(null);
  const selectedSessionCardRef = useRef(null);
  const wasDetailViewRef = useRef(Boolean(state.selectedSession));
  const [lastOpenedSessionId, setLastOpenedSessionId] = useState(null);
  const weeks = chunkWeeks(state.calendarDays);

  useLayoutEffect(() => {
    const isDetailView = Boolean(state.selectedSession);
    const wasDetailView = wasDetailViewRef.current;

    if (!wasDetailView && isDetailView) {
      backButtonRef.current?.focus({ preventScroll: true });
    }

    if (wasDetailView && !isDetailView) {
      selectedSessionCardRef.current?.focus({ preventScroll: true });
    }

    wasDetailViewRef.current = isDetailView;
  }, [state.selectedSession]);

  function openSessionDetail(sessionId) {
    setLastOpenedSessionId(sessionId);
    actions.openSessionDetail(sessionId);
  }

  function deleteSessionSet(sessionId, setId) {
    requestConfirmation({
      title: "Delete this saved set?",
      message: "This removes the set from the saved session and updates that session's set count and total rest time.",
      confirmLabel: "Delete set",
      onConfirm: () => actions.deleteSessionSet(sessionId, setId),
    });
  }

  return (
    <div className={ui.pageWide}>
      <header className={ui.pageHeader}>
        <div>
          <p className={ui.labelMarker}>Calendar</p>
          <h1 className={ui.pageTitle}>Workout calendar</h1>
          <p className={ui.bodyCopy}>Completed sessions by local date.</p>
        </div>
        <div className={ui.calendarHeaderStats}>
          <div className={cx(ui.countCard, ui.calendarStatCard)}>
            <span className={ui.countLabel}>Sessions</span>
            <strong className={ui.countValue}>{state.sessionCount}</strong>
          </div>
          <div className={cx(ui.countCard, ui.calendarStatCard)}>
            <span className={ui.countLabel}>Current streak</span>
            <strong className={ui.countValue}>
              {state.currentWorkoutStreak}
              <small className={ui.calendarStreakUnit}>
                {state.currentWorkoutStreak === 1 ? " day" : " days"}
              </small>
            </strong>
          </div>
        </div>
      </header>

      <section className={ui.calendarPanel} aria-labelledby="calendar-month-title">
        <div className={ui.calendarToolbar}>
          <div>
            <p className={ui.labelMarker}>Month</p>
            <h2 id="calendar-month-title" className={ui.panelTitle}>{state.monthTitle}</h2>
          </div>
          <div className={ui.calendarActions}>
            <Button variant="soft" className={ui.calendarActionButton} onClick={actions.previousMonth}>
              ← Prev
            </Button>
            <Button variant="soft" className={ui.calendarActionButton} onClick={actions.showToday}>
              Today
            </Button>
            <Button variant="soft" className={ui.calendarActionButton} onClick={actions.nextMonth}>
              Next →
            </Button>
          </div>
        </div>

        <div className={ui.calendarGrid} role="grid" aria-labelledby="calendar-month-title">
          <div className={ui.calendarWeek} role="row">
            {weekdays.map((weekday) => (
              <span className={ui.calendarWeekday} key={weekday} role="columnheader">
                {weekday}
              </span>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div className={ui.calendarWeek} key={weekIndex} role="row">
              {week.map((calendarDay, dayIndex) => (
                calendarDay ? (
                  <CalendarDay
                    calendarDay={calendarDay}
                    isSelected={calendarDay.dateKey === state.selectedDateKey}
                    isToday={calendarDay.dateKey === state.todayKey}
                    key={calendarDay.dateKey}
                    onSelect={actions.selectDate}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={ui.calendarDayBlank}
                    key={`blank-${weekIndex}-${dayIndex}`}
                    role="gridcell"
                  />
                )
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={ui.calendarAgenda} aria-labelledby="calendar-agenda-title">
        {state.selectedSession ? (
          <div className={ui.calendarDetail}>
            <div className={ui.calendarAgendaHeader}>
              <div>
                <p className={ui.labelMarker}>Session detail</p>
                <h2 id="calendar-agenda-title" className={ui.panelTitle}>{state.selectedDateTitle}</h2>
              </div>
              <Button
                ref={backButtonRef}
                variant="soft"
                className="max-[520px]:w-auto"
                onClick={actions.closeSessionDetail}
              >
                ← Calendar
              </Button>
            </div>
            <SessionDetail
              session={state.selectedSession}
              onDeleteSet={deleteSessionSet}
              onEditReview={actions.openEditSessionReview}
            />
          </div>
        ) : (
          <>
            <div className={ui.calendarAgendaHeader}>
              <div>
                <p className={ui.labelMarker}>Selected date</p>
                <h2 id="calendar-agenda-title" className={ui.panelTitle}>{state.selectedDateTitle}</h2>
              </div>
              <span className={ui.calendarAgendaCount}>
                {state.selectedDateSessions.length} {state.selectedDateSessions.length === 1 ? "session" : "sessions"}
              </span>
            </div>

            {state.selectedDateSessions.length > 0 ? (
              <div className={ui.calendarAgendaGrid}>
                {state.selectedDateSessions.map((session, index) => (
                  <SessionSummaryCard
                    key={session.id}
                    onOpenSession={openSessionDetail}
                    ref={session.id === lastOpenedSessionId ? selectedSessionCardRef : undefined}
                    selected={session.id === lastOpenedSessionId}
                    session={session}
                    sessionNumber={state.selectedDateSessions.length - index}
                  />
                ))}
              </div>
            ) : (
              <EmptyBlock className={ui.calendarAgendaEmpty}>
                No completed sessions on this date.
              </EmptyBlock>
            )}
          </>
        )}
      </section>

      {state.editingSession && (
        <ReviewModal
          mode="edit"
          title="Update workout review."
          subtitle={`${formatDateTime(state.editingSession.startedAt)} · ${formatDuration(state.editingSession.workoutSeconds)}`}
          review={state.editingReview}
          onChange={actions.setEditingReview}
          onCancel={actions.cancelEditSessionReview}
          onSave={actions.saveEditSessionReview}
        />
      )}

      {confirmation && (
        <ConfirmationDialog
          {...confirmation}
          onCancel={cancelConfirmation}
          onConfirm={confirmAction}
        />
      )}

      <Toast message={state.toast} />
    </div>
  );
}

function CalendarDay({ calendarDay, isSelected, isToday, onSelect }) {
  const sessionCount = calendarDay.sessions.length;
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(calendarDay.date);
  const workoutLabel = sessionCount === 1 ? "1 completed session" : `${sessionCount} completed sessions`;

  return (
    <button
      type="button"
      role="gridcell"
      aria-current={isToday ? "date" : undefined}
      aria-label={`${dateLabel}, ${workoutLabel}`}
      aria-selected={isSelected}
      className={cx(
        ui.calendarDay,
        sessionCount > 0 && ui.calendarDayWorkout,
        isToday && ui.calendarDayToday,
        isSelected && ui.calendarDaySelected,
      )}
      onClick={() => onSelect(calendarDay.dateKey)}
    >
      <span className={ui.calendarDayNumber}>{calendarDay.day}</span>
      {sessionCount > 0 && (
        <span className={ui.calendarDayCount} aria-hidden="true">
          <span>{sessionCount}</span>
        </span>
      )}
    </button>
  );
}

function chunkWeeks(days) {
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
}
