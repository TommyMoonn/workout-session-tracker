import { WorkoutCalendar, useWorkoutCalendar } from "@features/calendar";

function CalendarPage() {
  const calendar = useWorkoutCalendar();
  return <WorkoutCalendar {...calendar} />;
}

export default CalendarPage;
