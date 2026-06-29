import { Button } from "@shared/ui";
import { cx } from "@shared/lib";
import { calendarUi as ui } from "../styles";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WorkoutCalendar({ state, actions }) {
  const weeks = chunkWeeks(state.calendarDays);

  return (
    <div className={ui.pageWide}>
      <header className={ui.pageHeader}>
        <div>
          <p className={ui.labelMarker}>Calendar</p>
          <h1 className={ui.pageTitle}>Workout calendar</h1>
          <p className={ui.bodyCopy}>Completed sessions by local date.</p>
        </div>
        <div className={ui.countCard}>
          <span className={ui.countLabel}>Sessions</span>
          <strong className={ui.countValue}>{state.sessionCount}</strong>
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
        <span className={ui.calendarDayCount} aria-hidden="true">[{sessionCount}]</span>
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
