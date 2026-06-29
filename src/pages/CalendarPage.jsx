import { WorkoutCalendar, useWorkoutCalendar } from "@features/calendar";
import { useSessionHistory } from "@features/history";

function CalendarPage() {
  const history = useSessionHistory();
  const calendar = useWorkoutCalendar({
    sessionLogs: history.state.sessionLogs,
  });

  return (
    <WorkoutCalendar
      state={{
        ...calendar.state,
        editingReview: history.state.editingReview,
        editingSession: history.state.editingSession,
        selectedSession: history.state.selectedSession,
        toast: history.state.toast,
      }}
      actions={{
        ...calendar.actions,
        cancelEditSessionReview: history.actions.cancelEditSessionReview,
        closeSessionDetail: history.actions.closeSessionDetail,
        deleteSessionSet: history.actions.deleteSessionSet,
        openEditSessionReview: history.actions.openEditSessionReview,
        openSessionDetail: history.actions.openSessionDetail,
        saveEditSessionReview: history.actions.saveEditSessionReview,
        setEditingReview: history.actions.setEditingReview,
      }}
    />
  );
}

export default CalendarPage;
