import { TimerDashboard, useWorkoutTimer } from "@features/timer";

function TimerPage() {
  const timer = useWorkoutTimer();
  return <TimerDashboard {...timer} />;
}

export default TimerPage;
