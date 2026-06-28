import { createSessionReview } from "./sessionLifecycle";

export const timerActionTypes = {
  defaultRestSynced: "defaultRestSynced",
  finishCanceled: "finishCanceled",
  finishDraftCreated: "finishDraftCreated",
  loggedSessionNoticeChanged: "loggedSessionNoticeChanged",
  restAdjusted: "restAdjusted",
  restDurationChanged: "restDurationChanged",
  restPaused: "restPaused",
  restReset: "restReset",
  restResumed: "restResumed",
  restTicked: "restTicked",
  sessionLogged: "sessionLogged",
  sessionReviewChanged: "sessionReviewChanged",
  setCompleted: "setCompleted",
  setLogsChanged: "setLogsChanged",
  setPanelChanged: "setPanelChanged",
  workoutPaused: "workoutPaused",
  workoutReset: "workoutReset",
  workoutStarted: "workoutStarted",
  workoutTicked: "workoutTicked",
};

export function timerReducer(state, action) {
  switch (action.type) {
    case timerActionTypes.workoutStarted:
      return {
        ...state,
        workoutStartedAt: action.startedAt,
        workoutStatus: "running",
      };
    case timerActionTypes.workoutTicked:
      return state.workoutElapsed === action.elapsed
        ? state
        : { ...state, workoutElapsed: action.elapsed };
    case timerActionTypes.workoutPaused:
      return {
        ...state,
        workoutStartedAt: null,
        workoutElapsedBeforeStart: action.elapsed,
        workoutElapsed: action.elapsed,
        workoutStatus: "paused",
      };
    case timerActionTypes.workoutReset:
      return {
        ...state,
        workoutStartedAt: null,
        workoutElapsedBeforeStart: 0,
        workoutElapsed: 0,
        workoutStatus: "idle",
        setLogs: [],
        ...createRestReset(action.seconds),
      };
    case timerActionTypes.defaultRestSynced:
      return {
        ...state,
        restDuration: action.seconds,
        restDurationInput: String(action.seconds),
        ...createRestReset(action.seconds),
      };
    case timerActionTypes.finishDraftCreated:
      return {
        ...state,
        workoutStartedAt: null,
        workoutElapsedBeforeStart: action.workoutElapsed,
        workoutElapsed: action.workoutElapsed,
        workoutStatus: "paused",
        finishDraft: action.finishDraft,
        sessionReview: createSessionReview(),
      };
    case timerActionTypes.finishCanceled:
      return { ...state, finishDraft: null };
    case timerActionTypes.sessionLogged:
      return {
        ...state,
        workoutStartedAt: null,
        workoutElapsedBeforeStart: 0,
        workoutElapsed: 0,
        workoutStatus: "idle",
        setLogs: [],
        finishDraft: null,
        sessionReview: createSessionReview(),
        sessionLogs: action.sessionLogs,
        selectedSessionId: action.selectedSessionId,
        loggedSessionNotice: action.notice,
        ...createRestReset(action.restDuration),
      };
    case timerActionTypes.setCompleted:
      return {
        ...state,
        setLogs: action.setLogs,
        ...(action.startWorkout
          ? {
            workoutStartedAt: action.timestamp,
            workoutElapsedBeforeStart: 0,
            workoutElapsed: 0,
            workoutStatus: "running",
          }
          : {}),
        ...(action.autoStartRest
          ? createRestRunning(action.setId, action.restSeconds, action.timestamp)
          : createRestReset(action.restSeconds)),
      };
    case timerActionTypes.restPaused:
      return {
        ...state,
        restElapsedBeforeStart: action.elapsed,
        restRemaining: action.remaining,
        restRemainingAtStart: action.remaining,
        restStartedAt: null,
        restStatus: action.remaining > 0 ? "paused" : "done",
      };
    case timerActionTypes.restResumed:
      return {
        ...state,
        restRemainingAtStart: state.restRemaining,
        restStartedAt: action.startedAt,
        restStatus: "running",
      };
    case timerActionTypes.restTicked:
      return state.restRemaining === action.remaining
        ? state
        : { ...state, restRemaining: action.remaining };
    case timerActionTypes.restAdjusted:
      return {
        ...state,
        restRemaining: action.remaining,
        restRemainingAtStart: action.remaining,
        restElapsedBeforeStart: action.elapsed,
        restStartedAt: action.startedAt,
      };
    case timerActionTypes.restReset:
      return {
        ...state,
        ...(action.setLogs ? { setLogs: action.setLogs } : {}),
        ...createRestReset(action.seconds, action.status),
      };
    case timerActionTypes.setLogsChanged:
      return {
        ...state,
        setLogs: action.setLogs,
        ...(action.resetRest ? createRestReset(action.restDuration) : {}),
      };
    case timerActionTypes.restDurationChanged:
      return {
        ...state,
        restDurationInput: action.input,
        ...(action.seconds == null ? {} : { restDuration: action.seconds }),
        ...(action.syncIdle && action.seconds != null
          ? {
            restRemaining: action.seconds,
            restRemainingAtStart: action.seconds,
            restStatus: "idle",
          }
          : {}),
      };
    case timerActionTypes.setPanelChanged:
      return { ...state, isSetPanelOpen: action.isOpen };
    case timerActionTypes.loggedSessionNoticeChanged:
      return { ...state, loggedSessionNotice: action.notice };
    case timerActionTypes.sessionReviewChanged:
      return { ...state, sessionReview: action.review };
    default:
      return state;
  }
}

function createRestRunning(setId, seconds, timestamp) {
  return {
    activeSetId: setId,
    restDuration: seconds,
    restDurationInput: String(seconds),
    restElapsedBeforeStart: 0,
    restRemaining: seconds,
    restRemainingAtStart: seconds,
    restStartedAt: timestamp,
    restStatus: "running",
  };
}

function createRestReset(seconds, status = "idle") {
  return {
    activeSetId: null,
    restElapsedBeforeStart: 0,
    restRemaining: seconds,
    restRemainingAtStart: seconds,
    restStartedAt: null,
    restStatus: status,
  };
}
