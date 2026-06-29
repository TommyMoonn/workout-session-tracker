import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WORKOUT_STORAGE_KEY } from "@domain/workout";
import CalendarPage from "../../../pages/CalendarPage";

describe("calendar session browsing", () => {
  it("opens, edits, and deletes through the existing history session contract", () => {
    const startedAt = new Date();
    startedAt.setHours(12, 0, 0, 0);
    const session = {
      id: "calendar-session",
      startedAt: startedAt.getTime(),
      endedAt: startedAt.getTime() + 120_000,
      workoutSeconds: 120,
      totalRestSeconds: 30,
      setCount: 1,
      sets: [{
        id: "set-1",
        setNumber: 1,
        timeToCompleteSetSeconds: 45,
        completedAtSessionSeconds: 45,
        restTargetSeconds: 30,
        restActualSeconds: 30,
        restStartedAtSessionSeconds: 45,
        restEndedAtSessionSeconds: 75,
      }],
      review: {
        workoutTags: ["Strength"],
        thoughts: "Original note",
        energy: 3,
        difficulty: 3,
        mood: 3,
        overallExperience: 3,
      },
    };
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify({
      sessionLogs: [session],
    }));

    render(<CalendarPage />);

    const sessionCard = screen.getByRole("button", { name: /Session 1/i });
    fireEvent.click(sessionCard);

    const backButton = screen.getByRole("button", { name: /Calendar/i });
    expect(document.activeElement).toBe(backButton);

    fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
    fireEvent.change(screen.getByPlaceholderText(/How did the session feel/i), {
      target: { value: "Updated from calendar" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save notes" }));
    expect(screen.getByText("Updated from calendar")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Delete set" }));
    expect(screen.getByText("No sets logged.")).toBeTruthy();

    fireEvent.click(backButton);

    const restoredCard = screen.getByRole("button", { name: /Session 1/i });
    expect(document.activeElement).toBe(restoredCard);
    expect(restoredCard.textContent).toContain("[sets]0");
    expect(screen.getByText(/1 session$/i)).toBeTruthy();
  });

  it("shows a compact empty state for a selected date without sessions", () => {
    render(<CalendarPage />);

    const emptyDay = screen.getAllByRole("gridcell", {
      name: /0 completed sessions/i,
    })[0];
    fireEvent.click(emptyDay);

    expect(screen.getByText("No completed sessions on this date.")).toBeTruthy();
    expect(screen.getByText(/^0 sessions$/i)).toBeTruthy();
  });
});
