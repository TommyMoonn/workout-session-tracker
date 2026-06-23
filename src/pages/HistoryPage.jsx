import { useEffect, useMemo, useRef, useState } from "react";
import { readWorkoutStorage, saveWorkoutStorage } from "../storage/workoutStorage";
import { buildSessionMarkdown, downloadFile } from "../utils/workoutExport";
import { formatClock, formatDateTime, formatDuration, formatFileTimestamp } from "../utils/workoutFormat";
import { createEmptyReview, normalizeReview, normalizeSetLogs } from "../utils/workoutData";
import { cx, Toast, ui } from "../styles/ui";

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
    <div className={ui.page}>
      <section className={cx(ui.pageHeader, ui.reveal)}>
        <div>
          <p className={ui.labelMarker}>History</p>
          <h1 className={ui.pageTitle}>Finished sessions</h1>
        </div>
        <div className={ui.countCard}>
          <span className={ui.countLabel}>Total</span>
          <strong className={ui.countValue}>{sessionLogs.length}</strong>
        </div>
      </section>

      <section className={cx(ui.historyCard, ui.reveal2)}>
        <div className={ui.historyHeader}>
          <div>
            <p className={cx(ui.labelMarker, "whitespace-nowrap")}>Saved sessions</p>
            <h2 className={ui.sectionTitle}>Archive</h2>
          </div>

          <div className={ui.actionGroups}>
            <input ref={jsonInputRef} type="file" accept="application/json,.json" hidden onChange={importWorkoutHistoryJson} />
            <ActionGroup label="Backup JSON">
              <ActionButton label="Export" onClick={exportWorkoutHistoryJson} disabled={sessionLogs.length === 0} />
              <ActionButton label="Load" onClick={openJsonImport} />
            </ActionGroup>
            <ActionGroup label="Markdown report">
              <ActionButton label="Selected" onClick={exportSelectedMarkdown} disabled={!selectedSession} primary />
              <ActionButton label="All" onClick={exportAllMarkdown} disabled={sessionLogs.length === 0} />
            </ActionGroup>
            <ActionGroup label="Manage">
              <ActionButton label="Clear" onClick={clearSessionLogs} disabled={sessionLogs.length === 0} danger />
            </ActionGroup>
          </div>
        </div>

        {sessionLogs.length === 0 ? (
          <EmptyState text="No sessions logged yet. Finish a workout from the timer page to save the full session summary." />
        ) : (
          <div className={ui.browserBody}>
            <div className={ui.listPanel}>
              {visibleSessions.map((session, index) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSessionId(session.id)}
                  className={cx(ui.rowButton, "[contain-intrinsic-size:116px]", selectedSession?.id === session.id && ui.rowSelected)}
                >
                  <div className={ui.rowTop}>
                    <div>
                      <p className={ui.labelMarker}>Session {sessionLogs.length - index}</p>
                      <p className={ui.rowTitle}>{formatDateTime(session.startedAt)}</p>
                    </div>
                    <span className={cx(ui.pillMarked, selectedSession?.id === session.id && "border-current text-current before:text-current")}>{session.setCount} sets</span>
                  </div>
                  <div className={cx(ui.rowMeta, selectedSession?.id === session.id && ui.rowMetaSelected)}>
                    <span>Workout {formatDuration(session.workoutSeconds)}</span>
                    <span>Rest {formatDuration(session.totalRestSeconds)}</span>
                  </div>
                </button>
              ))}

              {hasMoreSessions && (
                <div className="p-4">
                  <button
                    type="button"
                    className={cx(ui.buttonBase, ui.buttonSoft)}
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

      <Toast message={toast} />
    </div>
  );
}


function ActionGroup({ label, children }) {
  return (
    <div className={ui.actionGroup}>
      <p className={cx(ui.labelMarker, "whitespace-nowrap")}>{label}</p>
      <div className={ui.actionButtons}>{children}</div>
    </div>
  );
}

function ActionButton({ label, onClick, disabled = false, primary = false, danger = false }) {
  const className = cx(ui.buttonBase, "min-h-9 px-3 py-0 text-xs", primary && ui.buttonPrimary, danger && ui.buttonDanger);

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

function EmptyState({ text }) {
  return <div className={ui.emptyMarked}>{text}</div>;
}

function SessionDetail({ session, onDeleteSet, onEditReview }) {
  if (!session) return null;

  const sets = Array.isArray(session.sets) ? session.sets : [];

  return (
    <div className={ui.detailPane}>
      <div className={ui.detailMetrics}>
        <MiniMetric label="Workout time" value={formatDuration(session.workoutSeconds)} />
        <MiniMetric label="Total rest time" value={formatDuration(session.totalRestSeconds)} />
        <MiniMetric label="Sets" value={String(session.setCount)} />
      </div>

      <SessionReviewSummary session={session} onEditReview={() => onEditReview(session)} />

      <div className={ui.tablePanel}>
        <div className={ui.tableTitleMarked}>Sets inside this session</div>
        <div className={ui.tableScroll}>
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
    <div className={ui.miniMetric}>
      <p className={ui.labelMarker}>{label}</p>
      <p className={ui.miniValue}>{value}</p>
    </div>
  );
}

function SessionReviewSummary({ session, onEditReview }) {
  const review = normalizeReview(session?.review);

  return (
    <div className={ui.reviewBox}>
      <div className={ui.rowBetween}>
        <div>
          <p className={ui.labelMarker}>Session notes</p>
          <h3 className={ui.smallTitle}>{review.workoutType.trim() || "No workout type added"}</h3>
        </div>
        <button type="button" className={cx(ui.buttonBase, ui.buttonSoft)} onClick={onEditReview}>Edit notes</button>
      </div>

      <div className={ui.ratingGrid}>
        <RatingPill label="Energy" value={review.energy} />
        <RatingPill label="Difficulty" value={review.difficulty} />
        <RatingPill label="Mood" value={review.mood} />
        <RatingPill label="Experience" value={review.overallExperience} />
      </div>

      <p className={ui.reviewThoughts}>{review.thoughts.trim() || "No thoughts added."}</p>
    </div>
  );
}

function RatingPill({ label, value }) {
  return (
    <div className={ui.pillMarked}>
      {label}: {value ?? 0}/5
    </div>
  );
}

function SetTable({ sets, emptyText, onDeleteSet }) {
  return (
    <table className={ui.table}>
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
            <td className={ui.emptyTableCell} colSpan={8}>{emptyText}</td>
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
                <button type="button" className={cx(ui.buttonBase, ui.buttonSoft)} onClick={() => onDeleteSet(set.id)}>Delete</button>
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
    <div className={ui.modalOverlay} onMouseDown={onCancel}>
      <section className={ui.modalPanel} onMouseDown={(event) => event.stopPropagation()}>
        <div className={ui.modalHeader}>
          <div>
            <p className={ui.labelMarker}>{mode === "edit" ? "Edit session notes" : "Finish workout"}</p>
            <h2 className={ui.sectionTitle}>{title}</h2>
            <p className={ui.bodyCopy}>{subtitle}</p>
          </div>
          <button type="button" className={cx(ui.buttonBase, ui.buttonSoft)} onClick={onCancel}>X</button>
        </div>

        <div className={ui.formGrid}>
          <label className={ui.fullSpan}>
            <span className={ui.labelMarker}>Workout type</span>
            <input
              className={ui.input}
              value={review.workoutType}
              onChange={(event) => update("workoutType", event.target.value)}
              placeholder="Push day, pull + legs, chest day..."
            />
          </label>

          <RatingInput label="Energy" value={review.energy} onChange={(value) => update("energy", value)} />
          <RatingInput label="Difficulty" value={review.difficulty} onChange={(value) => update("difficulty", value)} />
          <RatingInput label="Mood" value={review.mood} onChange={(value) => update("mood", value)} />
          <RatingInput label="Experience" value={review.overallExperience} onChange={(value) => update("overallExperience", value)} />

          <label className={ui.fullSpan}>
            <span className={ui.labelMarker}>Thoughts and feelings</span>
            <textarea
              className={ui.textarea}
              rows={5}
              value={review.thoughts}
              onChange={(event) => update("thoughts", event.target.value)}
              placeholder="How did the session feel? Any notes for next time?"
            />
          </label>
        </div>

        <footer className={ui.modalFooter}>
          <button type="button" className={ui.buttonBase} onClick={onCancel}>Cancel</button>
          <button type="button" className={cx(ui.buttonBase, ui.buttonPrimary)} onClick={onSave}>{mode === "edit" ? "Save notes" : "Save session"}</button>
        </footer>
      </section>
    </div>
  );
}

function RatingInput({ label, value, onChange }) {
  return (
    <label className={ui.ratingInput}>
      <span className={ui.labelMarker}>{label}</span>
      <div className={ui.ratingRow}>
        <input type="range" min="0" max="5" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <span className={ui.ratingNumber}>{value}</span>
      </div>
    </label>
  );
}

export default HistoryPage;
