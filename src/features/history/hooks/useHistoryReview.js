import { historyActionTypes } from "../model/historyReducer";

export function useHistoryReview({ dispatch, editingSession, showToast }) {
  function openEditSessionReview(session) {
    if (!session) return;
    dispatch({
      type: historyActionTypes.reviewOpened,
      session,
    });
  }

  function saveEditSessionReview() {
    if (!editingSession) return;
    dispatch({ type: historyActionTypes.reviewSaved });
    showToast("Session notes updated.");
  }

  function cancelEditSessionReview() {
    dispatch({ type: historyActionTypes.reviewCanceled });
  }

  function setEditingReview(review) {
    dispatch({
      type: historyActionTypes.reviewChanged,
      review,
    });
  }

  return {
    cancelEditSessionReview,
    openEditSessionReview,
    saveEditSessionReview,
    setEditingReview,
  };
}
