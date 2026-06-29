import { ui as sharedUi } from "@shared/styles";

export const calendarStyles = {
  calendarHeaderStats: "grid shrink-0 grid-cols-2 gap-2 max-[520px]:w-full",
  calendarStatCard: "min-w-[148px] max-[520px]:min-w-0 max-[520px]:px-2",
  calendarStreakUnit: "ml-1 text-xs font-bold uppercase text-[var(--oc-muted)]",
  calendarPanel: "mt-4 min-w-0 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] text-[var(--oc-ink)] max-[760px]:mt-3",
  calendarToolbar: "flex items-end justify-between gap-4 border-b border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] px-6 py-4 max-[760px]:grid max-[760px]:grid-cols-1 max-[760px]:items-stretch max-[760px]:px-4",
  calendarActions: "grid grid-cols-3 gap-2 max-[760px]:w-full",
  calendarActionButton: "px-3 text-xs max-[520px]:!w-auto",
  calendarGrid: "min-w-0",
  calendarWeek: "grid grid-cols-7",
  calendarWeekday: "border-b border-r border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-2 py-2 text-center text-[11px] font-bold uppercase leading-normal text-[var(--oc-muted)] last:border-r-0 max-[520px]:px-1",
  calendarDay: "oc-interactive relative flex min-h-[92px] min-w-0 flex-col items-start justify-between border-0 border-b border-r border-[var(--oc-hairline)] bg-transparent p-3 text-left text-[var(--oc-body)] last:border-r-0 hover:bg-[var(--oc-surface-soft)] hover:text-[var(--oc-ink)] focus-visible:z-[1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-focus)] max-[760px]:min-h-16 max-[760px]:p-2 max-[520px]:min-h-12 max-[520px]:p-1.5",
  calendarDayBlank: "min-h-[92px] border-b border-r border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] last:border-r-0 max-[760px]:min-h-16 max-[520px]:min-h-12",
  calendarDayWorkout: "bg-[var(--oc-accent-softer)] text-[var(--oc-ink)] hover:bg-[var(--oc-accent-soft)]",
  calendarDayToday: "[&_span:first-child]:font-bold [&_span:first-child]:text-[var(--oc-accent-text)] [&_span:first-child]:underline [&_span:first-child]:underline-offset-4",
  calendarDaySelected: "!bg-[var(--oc-accent-softer)] !text-[var(--oc-ink)] outline outline-2 outline-offset-[-2px] outline-[var(--oc-accent)]",
  calendarDayNumber: "text-sm leading-none tabular-nums max-[520px]:text-xs",
  calendarDayCount: "inline-flex items-center gap-1 self-end rounded-[4px] border border-[var(--oc-accent)] bg-[var(--oc-canvas-deep)] px-1.5 py-1 text-[11px] font-bold leading-none text-[var(--oc-accent-text)] oc-ok-before max-[520px]:px-1 max-[520px]:text-[10px]",
  calendarAgenda: "mt-4 min-w-0 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] text-[var(--oc-ink)] max-[760px]:mt-3",
  calendarAgendaHeader: "flex items-center justify-between gap-4 border-b border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] px-6 py-4 max-[760px]:items-start max-[760px]:px-4 max-[520px]:flex-col",
  calendarAgendaCount: "shrink-0 text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]",
  calendarAgendaGrid: "grid grid-cols-3 gap-3 p-6 oc-content-swap max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1 max-[760px]:gap-2 max-[760px]:p-4",
  calendarAgendaEmpty: "m-4 max-[760px]:m-3",
  calendarDetail: "min-w-0 oc-content-swap",
};

export const calendarUi = {
  ...sharedUi,
  ...calendarStyles,
};
