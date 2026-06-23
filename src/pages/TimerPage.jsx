import { TimerDashboard } from "../features/timer/components/TimerDashboard";
import { useWorkoutTimer } from "../features/timer/hooks/useWorkoutTimer";

function TimerPage() {
  const timer = useWorkoutTimer();
  return <TimerDashboard {...timer} />;
}

export default TimerPage;
