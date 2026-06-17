import { useEffect, useMemo, useRef, useState } from "react";
import { readWorkoutStorage, saveWorkoutStorage } from "../storage/workoutStorage";
import { buildSessionMarkdown, downloadFile } from "../utils/workoutExport";
import { formatClock, formatDateTime, formatDuration, formatFileTimestamp } from "../utils/workoutFormat";
import { createEmptyReview, normalizeReview, normalizeSetLogs } from "../utils/workoutData";

const initialVisibleSessionCount = 40;
const sessionLoadStep = 40;

function HistoryPage() {
  const jsonInputRef = useRef(null);
  const storageLoadedRef = useRef(false);

  const [sessionLogs, setSessionLogs] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingReview, setEditingReview] = useState(createEmptyReview());
  const [toast, setToast] = useState("");
  const [visibleSessionCount, setVisibleSessionCount] = useState(initialVisibleSessionCount);

  const selectedSession = useMemo(() => (
    sessionLogs.find((session) => session.id === selectedSessionId) ?? sessionLogs[0] ?? null
  ), [sessionLogs, selectedSessionId]);

  const visibleSessions = useMemo(
    () => sessionLogs.slice(0, visibleSessionCount),
    [sessionLogs, visibleSessionCount]
  );

  const hasMoreSessions = visibleSessionCount < sessionLogs.length;

  const stats = useMemo(() => {
    const totalWorkoutSeconds = sessionLogs.reduce((sum, session) => sum + (session.workoutSeconds ?? 0), 0);
    const totalRestSeconds = sessionLogs.reduce((sum, session) => sum + (session.totalRestSeconds ?? 0), 0);
    const totalSets = sessionLogs.reduce((sum, session) => sum + (session.setCount ?? 0), 0);

    return {
      totalWorkoutSeconds,
      totalRestSeconds,
      totalSets,
    };
  }, [sessionLogs]);

  useEffect(() => {
    loadSavedState();
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) return;

    const currentState = readWorkoutStorage();
    saveWorkoutStorage({
      ...currentState,
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
    });
  }, [sessionLogs, selectedSessionId]);

  function loadSavedState() {
    const data = readWorkoutStorage();
    const savedSessions = Array.isArray(data?.sessionLogs) ? data.sessionLogs : [];

    setSessionLogs(savedSessions);
    setSelectedSessionId(data?.selectedSessionId ?? savedSessions[0]?.id ?? null);
    setVisibleSessionCount(initialVisibleSessionCount);
    storageLoadedRef.current = true;
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

  function clearSessionLogs() {
    setSessionLogs([]);
    setSelectedSessionId(null);
    setVisibleSessionCount(initialVisibleSessionCount);
    showToast("Session history cleared.");
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
        setVisibleSessionCount(initialVisibleSessionCount);
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

  return (
    <div className="workout-page">
      <section className="page-header block-reveal">
        <div>
          <p className="kicker">History</p>
          <h1 className="page-title">Finished sessions</h1>
        </div>
        <div className="count-card">
          <span>Total</span>
          <strong>{sessionLogs.length}</strong>
        </div>
      </section>

      <section className="metric-grid workout-fu workout-fu-2">
        <MetricCard label="Total workout time" value={formatDuration(stats.totalWorkoutSeconds)} />
        <MetricCard label="Total rest time" value={formatDuration(stats.totalRestSeconds)} />
        <MetricCard label="Total sets" value={String(stats.totalSets)} />
      </section>

      <section className="card history-card workout-card workout-fu-2">
        <div className="history-header">
          <div>
            <p className="kicker">Saved sessions</p>
            <h2 className="history-title !text-[1.6rem] md:!text-[1.85rem]">Archive</h2>
            <p className="history-subtitle">Review sessions, notes, and exports.</p>
          </div>

          <div className="action-groups">
            <input ref={jsonInputRef} type="file" accept="application/json,.json" hidden onChange={importWorkoutHistoryJson} />
            <ActionGroup label="Backup JSON">
              <ActionButton iconType="download" label="Export" onClick={exportWorkoutHistoryJson} disabled={sessionLogs.length === 0} />
              <ActionButton iconType="upload" label="Load" onClick={openJsonImport} />
            </ActionGroup>
            <ActionGroup label="Markdown report">
              <ActionButton iconType="file" label="Selected" onClick={exportSelectedMarkdown} disabled={!selectedSession} primary />
              <ActionButton iconType="list" label="All" onClick={exportAllMarkdown} disabled={sessionLogs.length === 0} />
            </ActionGroup>
            <ActionGroup label="Manage">
              <ActionButton iconType="trash" label="Clear" onClick={clearSessionLogs} disabled={sessionLogs.length === 0} danger />
            </ActionGroup>
          </div>
        </div>

        {sessionLogs.length === 0 ? (
          <EmptyState text="No sessions logged yet. Finish a workout from the timer page to save the full session summary." />
        ) : (
          <div className="history-body">
            <div className="session-list">
              {visibleSessions.map((session, index) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`session-row ${selectedSession?.id === session.id ? "selected" : ""}`}
                >
                  <div className="session-row-top">
                    <div>
                      <p className="kicker">Session {sessionLogs.length - index}</p>
                      <p className="session-date">{formatDateTime(session.startedAt)}</p>
                    </div>
                    <span className="set-count-pill">{session.setCount} sets</span>
                  </div>
                  <div className="session-row-meta">
                    <span>Workout {formatDuration(session.workoutSeconds)}</span>
                    <span>Rest {formatDuration(session.totalRestSeconds)}</span>
                  </div>
                </button>
              ))}

              {hasMoreSessions && (
                <div className="history-load-more">
                  <button
                    type="button"
                    className="btn btn-soft"
                    onClick={() => setVisibleSessionCount((current) => current + sessionLoadStep)}
                  >
                    Show {Math.min(sessionLoadStep, sessionLogs.length - visibleSessionCount)} more
                  </button>
                </div>
              )}
            </div>

            <SessionDetail
              session={selectedSession}
              onDeleteSet={deleteSessionSet}
              onEditReview={openEditSessionReview}
            />
          </div>
        )}
      </section>

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

export default HistoryPage;
