import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const defaultRestSeconds = 90;
const restPresets = [30, 60, 90, 120, 180];
const storageKey = "liftlog-lite.workout-state.v1";

function WorkoutSessionPage() {
  const workoutTickerRef = useRef(null);
  const restTickerRef = useRef(null);
  const jsonInputRef = useRef(null);
  const storageLoadedRef = useRef(false);
  const alarmLoopRef = useRef(null);
  const alarmContextsRef = useRef([]);

  const [workoutStartedAt, setWorkoutStartedAt] = useState(null);
  const [workoutElapsedBeforeStart, setWorkoutElapsedBeforeStart] = useState(0);
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [workoutStatus, setWorkoutStatus] = useState("idle");

  const [restDuration, setRestDuration] = useState(defaultRestSeconds);
  const [restDurationInput, setRestDurationInput] = useState(String(defaultRestSeconds));
  const [restRemaining, setRestRemaining] = useState(defaultRestSeconds);
  const [restStartedAt, setRestStartedAt] = useState(null);
  const [restRemainingAtStart, setRestRemainingAtStart] = useState(defaultRestSeconds);
  const [restElapsedBeforeStart, setRestElapsedBeforeStart] = useState(0);
  const [restStatus, setRestStatus] = useState("idle");
  const [activeSetId, setActiveSetId] = useState(null);

  const [setLogs, setSetLogs] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [toast, setToast] = useState("");
  const [restAlert, setRestAlert] = useState(false);
  const [isSetPanelOpen, setIsSetPanelOpen] = useState(false);
  const [finishDraft, setFinishDraft] = useState(null);
  const [loggedSessionNotice, setLoggedSessionNotice] = useState(null);
  const [sessionReview, setSessionReview] = useState(createEmptyReview());
  const [editingSession, setEditingSession] = useState(null);
  const [editingReview, setEditingReview] = useState(createEmptyReview());

  const isWorkoutRunning = workoutStatus === "running";
  const isRestRunning = restStatus === "running";
  const hasActiveSession = workoutElapsed > 0 || workoutStatus === "running" || workoutStatus === "paused" || setLogs.length > 0;

  const totalRestSeconds = useMemo(
    () => setLogs.reduce((sum, log) => sum + (log.restActualSeconds ?? 0), 0),
    [setLogs]
  );

  const restProgress = useMemo(() => {
    if (!restDuration) return 0;
    return Math.min(100, Math.max(0, ((restDuration - restRemaining) / restDuration) * 100));
  }, [restDuration, restRemaining]);

  const workoutSummary = useMemo(() => {
    const minutes = Math.floor(workoutElapsed / 60);
    if (minutes < 10) return "Warm-up window";
    if (minutes < 35) return "Main workout active";
    if (minutes < 60) return "Strong session";
    return "Long session";
  }, [workoutElapsed]);

  const selectedSession = sessionLogs.find((session) => session.id === selectedSessionId) ?? sessionLogs[0] ?? null;

  useEffect(() => {
    loadSavedState();

    return () => {
      window.clearInterval(workoutTickerRef.current);
      window.clearInterval(restTickerRef.current);
      stopRestAlarm();
    };
  }, []);

  useEffect(() => {
    window.clearInterval(workoutTickerRef.current);

    if (!isWorkoutRunning || !workoutStartedAt) return;

    workoutTickerRef.current = window.setInterval(() => {
      setWorkoutElapsed(getCurrentWorkoutSeconds());
    }, 250);

    return () => window.clearInterval(workoutTickerRef.current);
  }, [isWorkoutRunning, workoutStartedAt, workoutElapsedBeforeStart]);

  useEffect(() => {
    window.clearInterval(restTickerRef.current);

    if (!isRestRunning || !restStartedAt) return;

    restTickerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - restStartedAt) / 1000);
      const nextRemaining = Math.max(0, restRemainingAtStart - elapsed);

      setRestRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        window.clearInterval(restTickerRef.current);
        completeActiveRest("Rest completed");
        showToast("Rest complete. Start the next set.");
        showRestEndedAlert();
      }
    }, 200);

    return () => window.clearInterval(restTickerRef.current);
  }, [isRestRunning, restStartedAt, restRemainingAtStart]);

  useEffect(() => {
    if (!storageLoadedRef.current) return;

    const payload = {
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
      activeSession: buildActiveSessionSnapshot(),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [
    sessionLogs,
    selectedSessionId,
    workoutElapsed,
    workoutStatus,
    restDuration,
    restDurationInput,
    restRemaining,
    restStatus,
    activeSetId,
    setLogs,
  ]);

  function getCurrentWorkoutSeconds() {
    if (!workoutStartedAt) return workoutElapsedBeforeStart;
    return workoutElapsedBeforeStart + Math.floor((Date.now() - workoutStartedAt) / 1000);
  }

  function getCurrentRestSeconds() {
    if (!restStartedAt) return restElapsedBeforeStart;
    return restElapsedBeforeStart + Math.floor((Date.now() - restStartedAt) / 1000);
  }

  function buildActiveSessionSnapshot() {
    return {
      workoutElapsed,
      workoutStatus,
      restDuration,
      restDurationInput,
      restRemaining,
      restStatus,
      activeSetId,
      setLogs,
    };
  }

  function loadSavedState() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        storageLoadedRef.current = true;
        return;
      }

      const data = JSON.parse(raw);
      const savedSessions = Array.isArray(data?.sessionLogs) ? data.sessionLogs : [];

      setSessionLogs(savedSessions);
      setSelectedSessionId(data?.selectedSessionId ?? savedSessions[0]?.id ?? null);
      restoreActiveSession(data?.activeSession);
    } catch (error) {
      console.error(error);
      showToast("Could not load saved workout data.");
    } finally {
      storageLoadedRef.current = true;
    }
  }

  function restoreActiveSession(activeSession) {
    if (!activeSession || typeof activeSession !== "object") return;

    const savedRestDuration = clampSeconds(Number(activeSession.restDuration || defaultRestSeconds));
    const savedWorkoutStatus = activeSession.workoutStatus === "running" ? "paused" : activeSession.workoutStatus;
    const savedRestStatus = activeSession.restStatus === "running" ? "paused" : activeSession.restStatus;
    const savedWorkoutElapsed = Math.max(0, Math.floor(activeSession.workoutElapsed || 0));
    const savedRestRemaining = Math.max(0, Math.floor(activeSession.restRemaining ?? savedRestDuration));

    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(savedWorkoutElapsed);
    setWorkoutElapsed(savedWorkoutElapsed);
    setWorkoutStatus(["idle", "paused", "finished"].includes(savedWorkoutStatus) ? savedWorkoutStatus : "idle");

    setRestDuration(savedRestDuration);
    setRestDurationInput(String(activeSession.restDurationInput || savedRestDuration));
    setRestRemaining(savedRestRemaining);
    setRestRemainingAtStart(savedRestRemaining);
    setRestElapsedBeforeStart(Math.max(0, savedRestDuration - savedRestRemaining));
    setRestStartedAt(null);
    setRestStatus(["idle", "paused", "done"].includes(savedRestStatus) ? savedRestStatus : "idle");
    setActiveSetId(activeSession.activeSetId ?? null);
    setSetLogs(Array.isArray(activeSession.setLogs) ? activeSession.setLogs : []);
  }

  function startWorkout() {
    setWorkoutStartedAt(Date.now());
    setWorkoutStatus("running");
  }

  function pauseWorkout() {
    const nextElapsed = getCurrentWorkoutSeconds();

    setWorkoutElapsedBeforeStart(nextElapsed);
    setWorkoutElapsed(nextElapsed);
    setWorkoutStartedAt(null);
    setWorkoutStatus("paused");
  }

  function resetWorkout() {
    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);
    closeRestAlert();

    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(0);
    setWorkoutElapsed(0);
    setWorkoutStatus("idle");
    setSetLogs([]);
    resetRestState(restDuration);
    showToast("Workout session reset.");
  }

  function finishWorkout() {
    const endedAt = Date.now();
    const finalWorkoutSeconds = getCurrentWorkoutSeconds();
    const finalSetLogs = setLogs.map((log) => {
      if (log.id !== activeSetId) return log;
      return {
        ...log,
        restEndedAt: endedAt,
        restEndedAtSessionSeconds: finalWorkoutSeconds,
        restActualSeconds: Math.max(0, getCurrentRestSeconds()),
        status: "Session finished",
      };
    });

    const finalTotalRestSeconds = finalSetLogs.reduce((sum, log) => sum + (log.restActualSeconds ?? 0), 0);

    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);

    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(finalWorkoutSeconds);
    setWorkoutElapsed(finalWorkoutSeconds);
    setWorkoutStatus("paused");

    setFinishDraft({
      id: `session-${endedAt}`,
      startedAt: endedAt - finalWorkoutSeconds * 1000,
      endedAt,
      workoutSeconds: finalWorkoutSeconds,
      totalRestSeconds: finalTotalRestSeconds,
      setCount: finalSetLogs.length,
      sets: normalizeSetLogs(finalSetLogs),
    });
    setSessionReview(createEmptyReview());
  }

  function submitFinishWorkout() {
    if (!finishDraft) return;

    const session = {
      ...finishDraft,
      review: normalizeReview(sessionReview),
    };

    setSessionLogs((current) => [session, ...current]);
    setSelectedSessionId(session.id);
    setFinishDraft(null);
    setSessionReview(createEmptyReview());
    resetAfterSessionLogged();
    setLoggedSessionNotice({
      id: session.id,
      workoutSeconds: session.workoutSeconds,
      totalRestSeconds: session.totalRestSeconds,
      setCount: session.setCount,
    });
  }

  function cancelFinishWorkout() {
    setFinishDraft(null);
    showToast("Session finish cancelled. Workout is paused.");
  }

  function resetAfterSessionLogged() {
    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(0);
    setWorkoutElapsed(0);
    setWorkoutStatus("idle");
    setSetLogs([]);
    resetRestState(restDuration);
  }

  function completeSetAndStartRest() {
    const now = Date.now();
    const wasIdle = workoutStatus === "idle" || workoutStatus === "finished";
    const sessionSeconds = wasIdle ? 0 : getCurrentWorkoutSeconds();

    if (wasIdle) {
      setWorkoutStartedAt(now);
      setWorkoutElapsedBeforeStart(0);
      setWorkoutElapsed(0);
      setWorkoutStatus("running");
    }

    if (activeSetId) {
      updateActiveSetRest("Replaced by next set", now, getCurrentRestSeconds(), sessionSeconds);
    }

    const previousSet = setLogs[setLogs.length - 1];
    const previousRestEndSeconds = previousSet ? previousSet.restEndedAtSessionSeconds ?? sessionSeconds : 0;
    const setNumber = setLogs.length + 1;
    const setId = `${now}-${setNumber}`;
    const safeRestSeconds = commitRestDurationInput();

    setSetLogs((current) => [
      ...current,
      {
        id: setId,
        setNumber,
        completedAt: now,
        completedAtSessionSeconds: sessionSeconds,
        timeToCompleteSetSeconds: Math.max(0, sessionSeconds - previousRestEndSeconds),
        restTargetSeconds: safeRestSeconds,
        restStartedAt: now,
        restStartedAtSessionSeconds: sessionSeconds,
        restEndedAt: null,
        restEndedAtSessionSeconds: null,
        restActualSeconds: null,
        status: "Resting",
      },
    ]);

    startRestForSet(setId, safeRestSeconds, now);
    showToast(`Set ${setNumber} logged. Rest started.`);
  }

  function startRestForSet(setId, seconds, timestamp) {
    window.clearInterval(restTickerRef.current);

    setRestDuration(seconds);
    setRestDurationInput(String(seconds));
    setRestRemaining(seconds);
    setRestRemainingAtStart(seconds);
    setRestElapsedBeforeStart(0);
    setRestStartedAt(timestamp);
    setActiveSetId(setId);
    setRestStatus("running");
  }

  function pauseRest() {
    if (!restStartedAt) return;

    const elapsedSegment = Math.floor((Date.now() - restStartedAt) / 1000);
    const nextElapsed = restElapsedBeforeStart + elapsedSegment;
    const nextRemaining = Math.max(0, restRemainingAtStart - elapsedSegment);

    setRestElapsedBeforeStart(nextElapsed);
    setRestRemaining(nextRemaining);
    setRestRemainingAtStart(nextRemaining);
    setRestStartedAt(null);
    setRestStatus(nextRemaining > 0 ? "paused" : "done");
  }

  function resumeRest() {
    if (restRemaining <= 0 || !activeSetId) return;

    setRestRemainingAtStart(restRemaining);
    setRestStartedAt(Date.now());
    setRestStatus("running");
  }

  function resetRest() {
    if (!activeSetId) {
      resetRestState(restDuration);
      return;
    }

    updateActiveSetRest("Rest stopped", Date.now(), getCurrentRestSeconds(), getCurrentWorkoutSeconds());
    resetRestState(restDuration);
    showToast("Rest stopped and saved to set log.");
  }

  function completeActiveRest(status) {
    updateActiveSetRest(status, Date.now(), getCurrentRestSeconds(), getCurrentWorkoutSeconds());
    resetRestState(restDuration, "done");
  }

  function updateActiveSetRest(status, endedAt, actualSeconds, endedAtSessionSeconds = getCurrentWorkoutSeconds()) {
    const setId = activeSetId;
    if (!setId) return;

    setSetLogs((current) => current.map((log) => (
      log.id === setId
        ? {
          ...log,
          restEndedAt: endedAt,
          restEndedAtSessionSeconds: endedAtSessionSeconds,
          restActualSeconds: Math.max(0, actualSeconds),
          status,
        }
        : log
    )));
  }

  function resetRestState(seconds, status = "idle") {
    window.clearInterval(restTickerRef.current);
    setRestRemaining(seconds);
    setRestRemainingAtStart(seconds);
    setRestElapsedBeforeStart(0);
    setRestStartedAt(null);
    setActiveSetId(null);
    setRestStatus(status);
  }

  function deleteCurrentSet(setId) {
    setSetLogs((current) => normalizeSetLogs(current.filter((log) => log.id !== setId)));

    if (activeSetId === setId) {
      resetRestState(restDuration);
    }

    showToast("Set deleted.");
  }

  function deleteSessionSet(sessionId, setId) {
    setSessionLogs((current) => current.map((session) => {
      if (session.id !== sessionId) return session;

      const nextSets = normalizeSetLogs((session.sets || []).filter((set) => set.id !== setId));
      const nextTotalRestSeconds = nextSets.reduce((sum, set) => sum + (set.restActualSeconds ?? 0), 0);

      return {
        ...session,
        sets: nextSets,
        setCount: nextSets.length,
        totalRestSeconds: nextTotalRestSeconds,
      };
    }));

    showToast("Set removed from saved session.");
  }

  function clearSetLogs() {
    setSetLogs([]);
    resetRestState(restDuration);
    showToast("Current set log cleared.");
  }

  function clearSessionLogs() {
    setSessionLogs([]);
    setSelectedSessionId(null);
    showToast("Session history cleared.");
  }

  function changeRestDurationInput(value) {
    const nextValue = String(value).replace(/\D/g, "");
    setRestDurationInput(nextValue);

    if (nextValue === "") return;

    const parsedSeconds = Number(nextValue);
    if (!Number.isFinite(parsedSeconds) || parsedSeconds <= 0) return;

    const nextSeconds = Math.min(1800, Math.floor(parsedSeconds));
    setRestDuration(nextSeconds);

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }
  }

  function commitRestDurationInput() {
    const nextSeconds = clampSeconds(Number(restDurationInput));
    setRestDuration(nextSeconds);
    setRestDurationInput(String(nextSeconds));

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }

    return nextSeconds;
  }

  function selectRestPreset(seconds) {
    const nextSeconds = clampSeconds(seconds);
    setRestDuration(nextSeconds);
    setRestDurationInput(String(nextSeconds));

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }
  }

  function openEditSessionReview(session) {
    if (!session) return;
    setEditingSession(session);
    setEditingReview(normalizeReview(session.review));
  }

  function saveEditSessionReview() {
    if (!editingSession) return;

    const nextReview = normalizeReview(editingReview);
    setSessionLogs((current) => current.map((session) => (
      session.id === editingSession.id ? { ...session, review: nextReview } : session
    )));
    setEditingSession(null);
    setEditingReview(createEmptyReview());
    showToast("Session notes updated.");
  }

  function cancelEditSessionReview() {
    setEditingSession(null);
    setEditingReview(createEmptyReview());
  }

  function exportWorkoutHistoryJson() {
    if (sessionLogs.length === 0) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-history-${formatFileTimestamp(Date.now())}.json`,
      JSON.stringify({ exportedAt: new Date().toISOString(), sessionLogs }, null, 2),
      "application/json"
    );
    showToast("Workout history JSON exported.");
  }

  function openJsonImport() {
    jsonInputRef.current?.click();
  }

  function importWorkoutHistoryJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        const logs = Array.isArray(data?.sessionLogs) ? data.sessionLogs : Array.isArray(data) ? data : [];

        if (!logs.length) {
          showToast("JSON file has no workout sessions.");
          return;
        }

        setSessionLogs(logs);
        setSelectedSessionId(logs[0]?.id ?? null);
        showToast(`${logs.length} workout session(s) loaded.`);
      } catch (error) {
        console.error(error);
        showToast("Invalid workout JSON file.");
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => {
      showToast("Could not read JSON file.");
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function exportSelectedMarkdown() {
    const session = selectedSession ?? sessionLogs[0];
    if (!session) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-session-${formatFileTimestamp(session.endedAt)}.md`,
      buildSessionMarkdown(session),
      "text/markdown"
    );
    showToast("Selected markdown exported.");
  }

  function exportAllMarkdown() {
    if (sessionLogs.length === 0) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-sessions-${formatFileTimestamp(Date.now())}.md`,
      sessionLogs.map(buildSessionMarkdown).join("\n\n---\n\n"),
      "text/markdown"
    );
    showToast("All sessions markdown exported.");
  }

  function showToast(message) {
    setToast(message);
    window.clearTimeout(window.__liftlogToastTimer);
    window.__liftlogToastTimer = window.setTimeout(() => setToast(""), 2800);
  }

  function showRestEndedAlert() {
    stopRestAlarm();
    setRestAlert(true);
    startRestAlarmLoop();
  }

  function closeRestAlert() {
    stopRestAlarm();
    setRestAlert(false);
  }

  function startRestAlarmLoop() {
    playChillAlarm();
    alarmLoopRef.current = window.setInterval(playChillAlarm, 1750);
  }

  function stopRestAlarm() {
    window.clearInterval(alarmLoopRef.current);
    alarmLoopRef.current = null;
    alarmContextsRef.current.forEach((audioContext) => {
      try {
        audioContext.close?.();
      } catch {
        // Ignore closed audio contexts.
      }
    });
    alarmContextsRef.current = [];
  }

  function playChillAlarm() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      alarmContextsRef.current = [...alarmContextsRef.current, audioContext];
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.075, audioContext.currentTime + 0.03);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.55);
      masterGain.connect(audioContext.destination);

      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        const startTime = audioContext.currentTime + index * 0.26;
        const endTime = startTime + 0.5;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.65, startTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        oscillator.connect(noteGain);
        noteGain.connect(masterGain);
        oscillator.start(startTime);
        oscillator.stop(endTime + 0.03);
      });

      window.setTimeout(() => {
        try {
          audioContext.close?.();
        } catch {
          // Ignore closed audio contexts.
        }
        alarmContextsRef.current = alarmContextsRef.current.filter((context) => context !== audioContext);
      }, 1650);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="workout-page">
      <main>
        <section className="grid-top workout-fu">
          <div className="hero-card card card-padding workout-card">
            <p className="kicker">Workout command center</p>
            <h1 className="hero-title">Log sets while the session runs.</h1>
            <p className="hero-copy">
              Start the workout timer, press Complete set after each set, and the rest timer starts automatically using your selected rest length.
            </p>

            <hr className="divider" />

            <div className="timer-panel">
              <div className="timer-topline">
                <span className="timer-label">Main timer</span>
                <span className={`pulse-dot ${isWorkoutRunning ? "running" : ""}`} />
              </div>
              <div className="big-time">{formatDuration(workoutElapsed)}</div>
              <p className="timer-summary">{workoutSummary}</p>
            </div>

            <div className="button-row">
              {!isWorkoutRunning ? (
                <button className="btn btn-primary" type="button" onClick={startWorkout}>
                  {workoutStatus === "paused" ? "Resume workout" : "Start workout"}
                </button>
              ) : (
                <button className="btn" type="button" onClick={pauseWorkout}>Pause workout</button>
              )}

              <button className="btn btn-dark" type="button" onClick={finishWorkout} disabled={!hasActiveSession}>
                Finish + log session
              </button>

              <button className="btn btn-soft" type="button" onClick={resetWorkout} disabled={!hasActiveSession}>
                Reset session
              </button>
            </div>
          </div>

          <aside className="card card-padding rest-card workout-card workout-fu-1">
            <div>
              <p className="kicker">Set + rest flow</p>
              <h2 className="rest-title">Complete set, then rest.</h2>
            </div>

            <div className="rest-display">
              <div className="rest-topline">
                <div>
                  <p className="metric-label">Rest remaining</p>
                  <p className="rest-time">{formatClock(restRemaining)}</p>
                </div>
                <p className="rest-status">{restStatus === "idle" ? "Not running" : restStatus}</p>
              </div>
              <div className="progress-shell">
                <div className="progress-fill" style={{ width: `${restProgress}%` }} />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="restSeconds">Rest length for next set</label>
              <div className="input-row">
                <input
                  id="restSeconds"
                  className="input"
                  type="number"
                  min="1"
                  max="1800"
                  step="1"
                  inputMode="numeric"
                  value={restDurationInput}
                  onChange={(event) => changeRestDurationInput(event.target.value)}
                  onBlur={commitRestDurationInput}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                />
                <span className="unit-box">Sec</span>
              </div>

              <div className="presets">
                {restPresets.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => selectRestPreset(seconds)}
                    className={`preset ${restDuration === seconds ? "active" : ""}`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            <div className="rest-actions button-grid">
              <button className="btn btn-primary" type="button" onClick={completeSetAndStartRest}>
                Complete set + start rest
              </button>
              <div className="two-col">
                {!isRestRunning ? (
                  <button className="btn" type="button" onClick={resumeRest} disabled={restStatus !== "paused"}>
                    Resume rest
                  </button>
                ) : (
                  <button className="btn" type="button" onClick={pauseRest}>Pause rest</button>
                )}
                <button className="btn btn-dark" type="button" onClick={resetRest} disabled={!activeSetId}>
                  Stop rest
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="metric-grid workout-fu workout-fu-2">
          <MetricCard label="Workout time" value={formatDuration(workoutElapsed)} />
          <MetricCard label="Total rest time" value={formatDuration(totalRestSeconds)} />
          <MetricCard label="Sets logged" value={String(setLogs.length)}>
            <div className="metric-actions">
              <button className="btn btn-primary" type="button" onClick={() => setIsSetPanelOpen(true)}>Open log</button>
              <button className="btn btn-soft" type="button" onClick={clearSetLogs} disabled={setLogs.length === 0}>Clear</button>
            </div>
          </MetricCard>
        </section>

        <section className="card card-padding workout-card workout-fu-2" style={{ marginTop: "24px" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="kicker">Session history moved</p>
              <h2 className="history-title">Finished sessions now live on the History page.</h2>
              <p className="history-subtitle">Keep this timer focused on the active workout. Review, import, export, edit notes, and manage saved sessions from History.</p>
            </div>
            <Link className="btn btn-primary" to="/history">Open history</Link>
          </div>
        </section>
      </main>

      {isSetPanelOpen && (
        <SetLogDrawer
          setLogs={setLogs}
          onClose={() => setIsSetPanelOpen(false)}
          onClear={clearSetLogs}
          onDeleteSet={deleteCurrentSet}
        />
      )}

      {finishDraft && (
        <ReviewModal
          mode="finish"
          title="Add session notes."
          subtitle={`Workout ${formatDuration(finishDraft.workoutSeconds)} · Rest ${formatDuration(finishDraft.totalRestSeconds)} · ${finishDraft.setCount} sets`}
          review={sessionReview}
          onChange={setSessionReview}
          onCancel={cancelFinishWorkout}
          onSave={submitFinishWorkout}
        />
      )}

      {editingSession && (
        <ReviewModal
          mode="edit"
          title="Update workout review."
          subtitle={`${formatDateTime(editingSession.startedAt)} · ${formatDuration(editingSession.workoutSeconds)}`}
          review={editingReview}
          onChange={setEditingReview}
          onCancel={cancelEditSessionReview}
          onSave={saveEditSessionReview}
        />
      )}

      {loggedSessionNotice && (
        <SessionLoggedPopup
          session={loggedSessionNotice}
          onClose={() => setLoggedSessionNotice(null)}
        />
      )}

      {restAlert && <RestCompletePopup onClose={closeRestAlert} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function MetricCard({ label, value, children }) {
  return (
    <div className="metric-card workout-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {children}
    </div>
  );
}

function ActionGroup({ label, children }) {
  return (
    <div className="action-group">
      <p className="action-group-label">{label}</p>
      <div className="action-group-buttons">{children}</div>
    </div>
  );
}

function ActionButton({ iconType, label, onClick, disabled = false, primary = false, danger = false }) {
  let className = "btn action-btn";
  if (primary) className += " btn-primary";
  if (danger) className += " btn-dark";

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      <ActionIcon type={iconType} />
      <span>{label}</span>
    </button>
  );
}

function ActionIcon({ type }) {
  const commonProps = {
    className: "action-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    "aria-hidden": "true",
  };

  if (type === "download") {
    return (
      <svg {...commonProps}>
        <path d="M12 3v11" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  if (type === "upload") {
    return (
      <svg {...commonProps}>
        <path d="M12 21V10" />
        <path d="M7 14l5-5 5 5" />
        <path d="M5 4h14" />
      </svg>
    );
  }

  if (type === "file") {
    return (
      <svg {...commonProps}>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  if (type === "list") {
    return (
      <svg {...commonProps}>
        <path d="M8 7h11" />
        <path d="M8 12h11" />
        <path d="M8 17h11" />
        <path d="M4 7h1" />
        <path d="M4 12h1" />
        <path d="M4 17h1" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M6 7h12" />
      <path d="M10 7V5h4v2" />
      <path d="M8 10v9" />
      <path d="M12 10v9" />
      <path d="M16 10v9" />
      <path d="M7 7l1 14h8l1-14" />
    </svg>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function SessionDetail({ session, onDeleteSet, onEditReview }) {
  if (!session) return null;

  const sets = Array.isArray(session.sets) ? session.sets : [];

  return (
    <div className="session-detail">
      <div className="detail-metrics">
        <MiniMetric label="Workout time" value={formatDuration(session.workoutSeconds)} />
        <MiniMetric label="Total rest time" value={formatDuration(session.totalRestSeconds)} />
        <MiniMetric label="Sets" value={String(session.setCount)} />
      </div>

      <SessionReviewSummary session={session} onEditReview={() => onEditReview(session)} />

      <div className="table-panel">
        <div className="table-title">Sets inside this session</div>
        <div className="table-scroll">
          <SetTable
            sets={sets}
            emptyText="This session has no sets."
            onDeleteSet={(setId) => onDeleteSet(session.id, setId)}
          />
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="mini-metric">
      <p className="metric-label">{label}</p>
      <p className="mini-value">{value}</p>
    </div>
  );
}

function SessionReviewSummary({ session, onEditReview }) {
  const review = normalizeReview(session?.review);

  return (
    <div className="review-box">
      <div className="review-top">
        <div>
          <p className="kicker">Session notes</p>
          <h3 className="review-title">{review.workoutType.trim() || "No workout type added"}</h3>
        </div>
        <button type="button" className="btn btn-soft" onClick={onEditReview}>Edit notes</button>
      </div>

      <div className="rating-grid">
        <RatingPill label="Energy" value={review.energy} />
        <RatingPill label="Difficulty" value={review.difficulty} />
        <RatingPill label="Mood" value={review.mood} />
        <RatingPill label="Experience" value={review.overallExperience} />
      </div>

      <p className="review-thoughts">{review.thoughts.trim() || "No thoughts added."}</p>
    </div>
  );
}

function RatingPill({ label, value }) {
  return (
    <div className="rating-pill">
      {label}: {value ?? 0}/5
    </div>
  );
}

function SetLogDrawer({ setLogs, onClose, onClear, onDeleteSet }) {
  return (
    <>
      <div className="drawer-overlay" onMouseDown={onClose} />
      <aside className="drawer-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div className="review-top">
            <div>
              <p className="kicker">Current set log</p>
              <h2 className="history-title">{setLogs.length} sets logged</h2>
            </div>
            <button type="button" className="btn btn-soft" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="drawer-body">
          <div className="table-panel">
            <div className="table-title">Current session sets</div>
            <div className="table-scroll">
              <SetTable sets={setLogs} emptyText="No sets logged in the current session yet." onDeleteSet={onDeleteSet} />
            </div>
          </div>
        </div>
        <div className="drawer-footer">
          <button type="button" className="btn btn-soft" onClick={onClear} disabled={setLogs.length === 0}>Clear current sets</button>
        </div>
      </aside>
    </>
  );
}

function SetTable({ sets, emptyText, onDeleteSet }) {
  return (
    <table className="log-table">
      <thead>
        <tr>
          <th>Set</th>
          <th>Time to complete</th>
          <th>Completed at</th>
          <th>Rest target</th>
          <th>Rest actual</th>
          <th>Rest start</th>
          <th>Rest end</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sets.length === 0 ? (
          <tr>
            <td className="empty-table-cell" colSpan={8}>{emptyText}</td>
          </tr>
        ) : (
          sets.map((set) => (
            <tr key={set.id}>
              <td>Set {set.setNumber}</td>
              <td>{formatClock(set.timeToCompleteSetSeconds ?? 0)}</td>
              <td>{formatClock(set.completedAtSessionSeconds ?? 0)}</td>
              <td>{formatClock(set.restTargetSeconds ?? 0)}</td>
              <td>{set.restActualSeconds == null ? "—" : formatClock(set.restActualSeconds)}</td>
              <td>{formatClock(set.restStartedAtSessionSeconds ?? 0)}</td>
              <td>{set.restEndedAtSessionSeconds == null ? "—" : formatClock(set.restEndedAtSessionSeconds)}</td>
              <td>
                <button type="button" className="btn btn-soft" onClick={() => onDeleteSet(set.id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function ReviewModal({ title, subtitle, review, onChange, onCancel, onSave, mode }) {
  function update(field, value) {
    onChange({ ...review, [field]: value });
  }

  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <section className="modal-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="kicker">{mode === "edit" ? "Edit session notes" : "Finish workout"}</p>
            <h2 className="modal-title">{title}</h2>
            <p className="history-subtitle">{subtitle}</p>
          </div>
          <button type="button" className="btn btn-soft" onClick={onCancel}>X</button>
        </div>

        <div className="form-grid">
          <label className="full-span">
            <span className="field-label">Workout type</span>
            <input
              className="input"
              value={review.workoutType}
              onChange={(event) => update("workoutType", event.target.value)}
              placeholder="Push day, pull + legs, chest day..."
            />
          </label>

          <RatingInput label="Energy" value={review.energy} onChange={(value) => update("energy", value)} />
          <RatingInput label="Difficulty" value={review.difficulty} onChange={(value) => update("difficulty", value)} />
          <RatingInput label="Mood" value={review.mood} onChange={(value) => update("mood", value)} />
          <RatingInput label="Experience" value={review.overallExperience} onChange={(value) => update("overallExperience", value)} />

          <label className="full-span">
            <span className="field-label">Thoughts and feelings</span>
            <textarea
              className="textarea"
              rows={5}
              value={review.thoughts}
              onChange={(event) => update("thoughts", event.target.value)}
              placeholder="How did the session feel? Any notes for next time?"
            />
          </label>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={onSave}>{mode === "edit" ? "Save notes" : "Save session"}</button>
        </footer>
      </section>
    </div>
  );
}

function RatingInput({ label, value, onChange }) {
  return (
    <label className="rating-input">
      <span className="field-label">{label}</span>
      <div className="rating-row">
        <input type="range" min="0" max="5" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <span className="rating-number">{value}</span>
      </div>
    </label>
  );
}

function SessionLoggedPopup({ session, onClose }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <section
        className="modal-panel relative"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="btn btn-soft absolute right-6 top-6 h-11 w-11 p-0"
          onClick={onClose}
          aria-label="Close popup"
        >
          X
        </button>

        <div className="modal-header pr-20">
          <div>
            <p className="kicker">Session logged</p>
            <h2 className="modal-title">Saved to History.</h2>
            <p className="history-subtitle">
              Your workout was saved with {session.setCount} set{session.setCount === 1 ? "" : "s"},{" "}
              {formatDuration(session.workoutSeconds)} workout time, and{" "}
              {formatDuration(session.totalRestSeconds)} rest time.
            </p>
          </div>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Stay on timer
          </button>
          <Link className="btn btn-primary" to="/history" onClick={onClose}>
            Open history
          </Link>
        </footer>
      </section>
    </div>
  );
}

function RestCompletePopup({ onClose }) {
  return (
    <div className="rest-alert" role="status" aria-live="polite">
      <div className="rest-alert-content">
        <div>
          <p className="kicker">Rest ended</p>
          <h2 className="rest-alert-title">Rest has ended.</h2>
        </div>
        <button type="button" className="btn btn-soft" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

function createEmptyReview() {
  return {
    workoutType: "",
    thoughts: "",
    energy: 0,
    difficulty: 0,
    mood: 0,
    overallExperience: 0,
  };
}

function normalizeReview(review) {
  const source = review && typeof review === "object" ? review : {};
  return {
    workoutType: String(source.workoutType ?? ""),
    thoughts: String(source.thoughts ?? ""),
    energy: clampRating(source.energy),
    difficulty: clampRating(source.difficulty),
    mood: clampRating(source.mood),
    overallExperience: clampRating(source.overallExperience),
  };
}

function clampRating(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(5, Math.floor(number)));
}

function normalizeSetLogs(logs) {
  return logs.map((log, index) => ({ ...log, setNumber: index + 1 }));
}

function clampSeconds(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return defaultRestSeconds;
  return Math.max(1, Math.min(1800, Math.floor(number)));
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function formatClock(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

function formatFileTimestamp(timestamp) {
  const date = new Date(timestamp || Date.now());
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join("-");
}

function buildSessionMarkdown(session) {
  const review = normalizeReview(session.review);
  const sets = Array.isArray(session.sets) ? session.sets : [];
  const lines = [
    `# Workout Session - ${formatDateTime(session.startedAt)}`,
    "",
    `- Workout time: ${formatDuration(session.workoutSeconds)}`,
    `- Total rest time: ${formatDuration(session.totalRestSeconds)}`,
    `- Sets: ${session.setCount}`,
    `- Workout type: ${review.workoutType || "Not added"}`,
    `- Energy: ${review.energy}/5`,
    `- Difficulty: ${review.difficulty}/5`,
    `- Mood: ${review.mood}/5`,
    `- Overall experience: ${review.overallExperience}/5`,
    "",
    "## Thoughts",
    "",
    review.thoughts || "No thoughts added.",
    "",
    "## Sets",
    "",
  ];

  if (sets.length === 0) {
    lines.push("No sets logged.");
    return lines.join("\n");
  }

  lines.push("| Set | Time to complete | Completed at | Rest target | Rest actual | Rest start | Rest end |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");

  sets.forEach((set) => {
    lines.push(`| ${set.setNumber} | ${formatClock(set.timeToCompleteSetSeconds ?? 0)} | ${formatClock(set.completedAtSessionSeconds ?? 0)} | ${formatClock(set.restTargetSeconds ?? 0)} | ${set.restActualSeconds == null ? "—" : formatClock(set.restActualSeconds)} | ${formatClock(set.restStartedAtSessionSeconds ?? 0)} | ${set.restEndedAtSessionSeconds == null ? "—" : formatClock(set.restEndedAtSessionSeconds)} |`);
  });

  return lines.join("\n");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default WorkoutSessionPage;
