export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ui = {
  page: "mx-auto w-full max-w-[1120px]",
  reveal: "motion-safe:animate-[fadeUp_var(--transition-base)_both]",
  reveal1: "motion-safe:animate-[fadeUp_var(--transition-base)_both] motion-safe:[animation-delay:35ms]",
  reveal2: "motion-safe:animate-[fadeUp_var(--transition-base)_both] motion-safe:[animation-delay:70ms]",

  card: "border border-[var(--oc-hairline)] bg-[var(--oc-surface)] text-[var(--oc-ink)] shadow-none",
  cardPadding: "p-6 max-[760px]:p-4",
  pageHeader: "mb-6 flex items-end justify-between gap-6 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-6 text-[var(--oc-ink)] max-[1120px]:items-stretch max-[760px]:flex-col max-[760px]:p-4",
  pageTitle: "mt-2 max-w-[860px] text-[clamp(30px,5vw,44px)] font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)] max-[760px]:text-[clamp(28px,10vw,38px)]",
  heroTitle: "mt-2 max-w-[860px] text-[clamp(32px,5.4vw,52px)] font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)] max-[760px]:text-[clamp(28px,10vw,38px)]",
  sectionTitle: "mt-2 text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)]",
  detailTitle: "mt-2 text-[clamp(28px,4vw,44px)] font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)]",
  smallTitle: "mt-2 text-xl font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)]",
  bodyCopy: "mt-2 max-w-[720px] text-base font-normal leading-normal text-[var(--oc-body)]",
  divider: "my-4 border-0 border-t border-[var(--oc-hairline)]",

  label: "text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]",
  marker: "text-[var(--oc-marker)]",
  markerSoft: "text-[var(--oc-marker-soft)]",
  labelMarker: "text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] oc-plus-before",
  timerSummaryMarked: "mt-4 border-t border-[var(--oc-hairline)] pt-3 text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] oc-status-before",
  emptyMarked: "border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-6 text-[var(--oc-muted)] oc-empty-before max-[760px]:p-4",

  countCard: "grid min-w-[132px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-4 py-3 text-center",
  countLabel: "text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]",
  countValue: "mt-1 text-[34px] font-bold leading-[1.15] text-[var(--oc-ink)]",

  gridTop: "grid grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)] items-stretch gap-4 max-[1120px]:grid-cols-1",
  metricGrid: "mt-4 grid grid-cols-3 gap-4 max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1",
  metricCard: "flex min-h-[136px] flex-col gap-2 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  metricValue: "text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] text-[var(--oc-ink)]",
  miniMetric: "border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  miniValue: "text-[28px] font-bold leading-[1.2] text-[var(--oc-ink)]",
  detailMetrics: "grid grid-cols-3 gap-3 max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1",

  rowBetween: "flex items-start justify-between gap-4 max-[760px]:flex-col max-[760px]:items-stretch",
  toolbar: "flex items-start justify-between gap-4 max-[1120px]:items-stretch max-[760px]:flex-col max-[760px]:items-stretch",

  buttonBase: "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border border-[var(--oc-hairline-strong)] bg-transparent px-4 py-1 text-center text-sm font-medium leading-[2] text-[var(--oc-ink)] no-underline transition-colors hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)] disabled:cursor-not-allowed disabled:border-[var(--oc-hairline)] disabled:bg-transparent disabled:text-[var(--oc-stone)] disabled:opacity-60 disabled:hover:border-[var(--oc-hairline)] disabled:hover:bg-transparent disabled:hover:text-[var(--oc-stone)] max-[520px]:w-full",
  buttonPrimary: "border-[var(--oc-primary)] bg-[var(--oc-primary-soft)] text-[var(--oc-ink)] hover:border-[var(--oc-primary-active)] hover:bg-[var(--oc-primary-softer)] hover:text-[var(--oc-ink)] disabled:border-[var(--oc-hairline)] disabled:bg-transparent disabled:text-[var(--oc-stone)]",
  buttonSoft: "bg-[var(--oc-surface-soft)] text-[var(--oc-ink)] hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] disabled:bg-transparent disabled:text-[var(--oc-stone)]",
  buttonDanger: "border-[var(--oc-danger)] bg-[var(--oc-danger-soft)] text-[var(--oc-ink)] hover:border-[var(--oc-danger)] hover:bg-[var(--oc-danger)] hover:text-white disabled:border-[var(--oc-hairline)] disabled:bg-transparent disabled:text-[var(--oc-stone)]",
  iconBadge: "inline-flex h-6 min-w-10 flex-none items-center justify-center whitespace-nowrap rounded-[4px] border border-current px-2 font-mono text-xs font-bold leading-none tabular-nums",

  input: "min-h-10 w-full rounded-[4px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-3 py-2 text-base font-normal leading-normal text-[var(--oc-ink)] outline-none transition-colors placeholder:text-[var(--oc-stone)] focus:border-[var(--oc-accent)] focus:bg-[var(--oc-canvas-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)]",
  textarea: "min-h-[132px] w-full resize-y rounded-[4px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-3 py-2 text-base font-normal leading-normal text-[var(--oc-ink)] outline-none transition-colors placeholder:text-[var(--oc-stone)] focus:border-[var(--oc-accent)] focus:bg-[var(--oc-canvas-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)]",
  selectWrap: "relative block oc-select-wrap",
  select: "min-h-10 w-full appearance-none rounded-[4px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-3 py-2 pr-12 text-base font-normal leading-normal text-[var(--oc-ink)] outline-none transition-colors focus:border-[var(--oc-accent)] focus:bg-[var(--oc-canvas-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)]",
  filterField: "grid gap-1",

  timerPanel: "overflow-hidden border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  bigTime: "mt-6 whitespace-nowrap text-[clamp(48px,8.8vw,96px)] font-bold leading-none text-[var(--oc-ink)] max-[760px]:text-[clamp(42px,16vw,72px)]",
  timerSummary: "mt-4 border-t border-[var(--oc-hairline)] pt-3 text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]",
  pulseDot: "mt-1.5 h-2.5 w-2.5 flex-none rounded-[4px] bg-[var(--oc-stone)]",
  pulseDotRunning: "bg-[var(--oc-success)] motion-safe:animate-[pulseDot_1200ms_ease-in-out_infinite]",
  restCard: "flex flex-col gap-4",
  restDisplay: "border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-4 text-[var(--oc-ink)]",
  restTime: "mt-1 text-[clamp(36px,5vw,54px)] font-bold leading-[1.15] text-[var(--oc-ink)]",
  restStatus: "text-right text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] max-[760px]:text-left",
  progressShell: "mt-4 h-3.5 overflow-hidden rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)]",
  progressFill: "h-full bg-[var(--oc-primary)] transition-[width] duration-200 ease-linear",
  inputRow: "mt-1 grid grid-cols-[minmax(0,1fr)_72px] gap-2 max-[760px]:grid-cols-1",
  unitBox: "grid min-h-10 min-w-[72px] place-items-center rounded-[4px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] text-xs font-bold uppercase text-[var(--oc-muted)]",
  presets: "mt-2 grid grid-cols-5 gap-2 max-[760px]:grid-cols-1",
  preset: "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border border-[var(--oc-hairline-strong)] bg-transparent px-4 py-1 text-center text-sm font-medium leading-[2] text-[var(--oc-ink)] transition-colors hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)] max-[520px]:w-full",
  presetActive: "border-[var(--oc-primary)] bg-[var(--oc-primary-soft)] text-[var(--oc-ink)] hover:border-[var(--oc-primary-active)] hover:bg-[var(--oc-primary-softer)] hover:text-[var(--oc-ink)]",
  buttonRow: "mt-4 grid grid-cols-2 gap-2 max-[760px]:grid-cols-1",
  buttonGrid: "grid grid-cols-1 gap-2",
  twoCol: "grid grid-cols-2 gap-2 max-[760px]:grid-cols-1",

  historyCard: "mt-4 overflow-hidden border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-0 text-[var(--oc-ink)]",
  historyHeader: "grid grid-cols-[minmax(260px,1fr)_auto] items-start gap-4 border-b border-[var(--oc-hairline)] p-6 max-[1120px]:grid-cols-1 max-[1120px]:items-stretch max-[760px]:p-4",
  actionGroups: "flex flex-wrap items-start justify-end gap-2 max-[1120px]:justify-start",
  actionGroup: "border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] px-2 py-1.5 text-[var(--oc-ink)]",
  actionButtons: "mt-1 grid grid-cols-2 gap-1.5 max-[760px]:grid-cols-1",
  browserBody: "grid h-[clamp(560px,calc(100vh-220px),760px)] min-h-0 grid-cols-[minmax(280px,0.44fr)_minmax(0,1fr)] items-stretch overflow-hidden max-[1120px]:h-auto max-[1120px]:overflow-visible max-[1120px]:grid-cols-1",
  listPanel: "grid h-full min-h-0 content-start self-stretch overflow-y-scroll overscroll-contain border-r border-[var(--oc-hairline)] max-[1120px]:max-h-[430px] max-[1120px]:border-r-0 max-[1120px]:border-b",
  exerciseBrowserBody: "grid h-[clamp(560px,calc(100vh-220px),760px)] min-h-0 grid-cols-[minmax(280px,0.44fr)_minmax(0,1fr)] items-stretch overflow-hidden max-[1120px]:h-auto max-[1120px]:overflow-visible max-[1120px]:grid-cols-1",
  exerciseList: "grid h-full max-h-full min-h-0 content-start self-stretch overflow-y-scroll overscroll-contain border-r border-[var(--oc-hairline)] max-[1120px]:max-h-[430px] max-[1120px]:border-r-0 max-[1120px]:border-b",
  rowButton: "w-full border-0 border-b border-[var(--oc-hairline)] bg-transparent p-4 text-left text-[var(--oc-body)] transition-colors hover:bg-[var(--oc-surface-soft)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-accent)] [contain:layout_paint_style] [content-visibility:auto]",
  rowSelected: "border-l-2 border-l-[var(--oc-accent)] bg-[var(--oc-accent-softer)] text-[var(--oc-ink)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)]",
  rowTop: "flex items-start justify-between gap-4 max-[760px]:flex-col max-[760px]:items-stretch",
  rowTitle: "text-base font-bold leading-[1.45] text-current",
  rowMeta: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase leading-normal text-[var(--oc-muted)]",
  rowMetaSelected: "text-[var(--oc-muted)]",

  pillMarked: "inline-flex min-h-7 w-fit items-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-transparent px-2 py-1 text-xs font-medium uppercase leading-normal text-[var(--oc-muted)] oc-x-before",
  pill: "inline-flex min-h-7 w-fit items-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-transparent px-2 py-1 text-xs font-medium uppercase leading-normal text-[var(--oc-muted)]",
  pillSelected: "border-[var(--oc-accent)] bg-[var(--oc-accent-softer)] text-[var(--oc-ink)]",
  detailPane: "h-full min-h-0 min-w-0 overflow-y-auto p-4 max-[1120px]:h-auto max-[1120px]:overflow-visible max-[760px]:p-3",
  reviewBox: "mt-4 border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  ratingGrid: "mt-3 grid grid-cols-4 gap-3 max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1",
  reviewThoughts: "mt-3 leading-normal text-[var(--oc-body)]",
  tablePanel: "mt-4 overflow-hidden border border-[var(--oc-hairline)] bg-[var(--oc-surface)] text-[var(--oc-ink)] p-6 max-[760px]:p-4",
  tableTitle: "pb-3 text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]",
  tableTitleMarked: "pb-3 text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] oc-plus-before",
  tableScroll: "max-h-[460px] overflow-auto border-t border-[var(--oc-hairline)] max-[760px]:max-h-[300px]",
  table: "w-full min-w-[860px] border-collapse text-sm leading-normal text-[var(--oc-body)] [&_td]:border-b [&_td]:border-[var(--oc-hairline)] [&_td]:px-2 [&_td]:py-3 [&_td]:text-left [&_td]:align-middle [&_th]:sticky [&_th]:top-0 [&_th]:z-[1] [&_th]:border-b [&_th]:border-[var(--oc-hairline)] [&_th]:bg-[var(--oc-canvas-deep)] [&_th]:px-2 [&_th]:py-3 [&_th]:text-left [&_th]:align-middle [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:text-[var(--oc-ink)] [&_tbody_tr:nth-child(even)]:bg-white/[0.02]",
  emptyState: "border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-6 text-[var(--oc-muted)] max-[760px]:p-4",
  emptyTableCell: "text-center text-[var(--oc-muted)]",

  exerciseFilterGrid: "mt-4 grid grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(150px,1fr))] gap-3 max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1",
  filterFooter: "mt-4 flex items-center justify-between gap-4 border-t border-[var(--oc-hairline)] pt-3 text-xs uppercase text-[var(--oc-muted)] max-[760px]:flex-col max-[760px]:items-stretch",
  filterFooterBadge: "rounded-[4px] border border-[var(--oc-hairline)] px-2 py-1",
  browserCard: "mt-4 overflow-hidden border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-0 text-[var(--oc-ink)]",
  browserHeader: "flex items-start justify-between gap-4 border-b border-[var(--oc-hairline)] p-6 max-[1120px]:items-stretch max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:p-4",
  exerciseRow: "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-0 border-b border-[var(--oc-hairline)] bg-transparent p-4 text-left text-[var(--oc-body)] transition-colors hover:bg-[var(--oc-surface-soft)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-accent)] [contain:layout_paint_style] [content-visibility:auto] [contain-intrinsic-size:96px]",
  exerciseDetailCard: "min-h-full border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  exerciseBadgeGrid: "mt-4 grid grid-cols-4 gap-3 max-[1120px]:grid-cols-2 max-[760px]:grid-cols-1",
  infoBadge: "min-h-[100px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  infoBadgeValue: "mt-1 text-[15px] font-bold leading-normal text-[var(--oc-ink)]",
  sectionBlock: "mt-6 border-t border-[var(--oc-hairline)] pt-4",
  pillWrap: "mt-2 flex flex-wrap gap-2",
  videoCard: "mt-6 border border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] p-6 text-[var(--oc-ink)] max-[760px]:p-4",
  videoFrame: "relative mt-4 aspect-video overflow-hidden border border-[var(--oc-hairline-strong)] bg-black [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0",
  videoPlaceholder: "grid h-full min-h-[330px] w-full place-items-center rounded-none border-0 bg-black p-6 text-center text-[var(--oc-ink)] whitespace-normal hover:border-0 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-accent)]",
  videoPlaceholderTitle: "mt-2 block text-[clamp(24px,3vw,34px)] font-bold leading-[1.35] text-[var(--oc-ink)]",
  videoPlaceholderCopy: "mt-2 block max-w-[440px] text-sm leading-normal text-[var(--oc-muted)]",
  demoEmpty: "mt-4 border border-dashed border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] p-6 text-[var(--oc-body)] max-[760px]:p-4",

  overlay: "fixed inset-0 z-[60] bg-black/70 motion-safe:animate-[overlayIn_var(--transition-base)_both]",
  drawerPanel: "fixed right-0 top-0 z-[70] flex h-screen w-[min(720px,100%)] flex-col border-l border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas)] p-0 text-[var(--oc-ink)] motion-safe:animate-[drawerIn_var(--transition-base)_both] max-[760px]:border-l-0",
  drawerHeader: "flex items-start justify-between gap-4 border-b border-[var(--oc-hairline)] p-4 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:p-3",
  drawerBody: "flex-1 overflow-auto p-4 max-[760px]:p-3",
  drawerFooter: "flex items-start justify-between gap-4 border-t border-[var(--oc-hairline)] p-4 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:p-3",
  modalOverlay: "fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 motion-safe:animate-[overlayIn_var(--transition-base)_both]",
  modalPanel: "max-h-[min(860px,calc(100vh-48px))] w-[min(760px,100%)] overflow-auto border border-[var(--oc-hairline)] bg-[var(--oc-canvas)] p-6 text-[var(--oc-ink)] motion-safe:animate-[modalIn_var(--transition-base)_both] max-[760px]:p-4",
  modalHeader: "flex items-start justify-between gap-4 border-b border-[var(--oc-hairline)] pb-4 max-[760px]:flex-col max-[760px]:items-stretch",
  modalHeaderPadded: "flex items-start justify-between gap-4 border-b border-[var(--oc-hairline)] pb-4 pr-20 max-[760px]:flex-col max-[760px]:items-stretch max-[520px]:pr-16",
  modalClose: "absolute right-6 top-6 h-11 w-11 p-0 max-[520px]:right-4 max-[520px]:top-4",
  formGrid: "mt-4 grid grid-cols-2 gap-4 max-[760px]:grid-cols-1",
  fullSpan: "col-span-full",
  ratingInput: "grid gap-2 border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] p-3 text-[var(--oc-ink)]",
  ratingRow: "flex items-center gap-3",
  ratingRange: "min-w-0 flex-1 accent-[var(--oc-primary)]",
  ratingNumber: "grid h-[38px] w-[38px] place-items-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] font-bold text-[var(--oc-ink)]",
  modalFooter: "mt-4 flex flex-wrap justify-end gap-2 border-t border-[var(--oc-hairline)] pt-4",
  toast: "fixed bottom-6 right-6 z-[80] w-[min(380px,calc(100%_-_48px))] border border-[var(--oc-hairline-strong)] bg-[var(--oc-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--oc-ink)] motion-safe:animate-[toastIn_var(--transition-base)_both] max-[760px]:bottom-3 max-[760px]:right-3 max-[760px]:w-[calc(100%_-_24px)]",
  toastMarked: "fixed bottom-6 right-6 z-[80] w-[min(380px,calc(100%_-_48px))] border border-[var(--oc-hairline-strong)] bg-[var(--oc-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--oc-ink)] oc-ok-before motion-safe:animate-[toastIn_var(--transition-base)_both] max-[760px]:bottom-3 max-[760px]:right-3 max-[760px]:w-[calc(100%_-_24px)]",
  restAlert: "fixed left-1/2 top-[76px] z-[90] w-[min(460px,calc(100%_-_32px))] -translate-x-1/2 border border-[var(--oc-warning)] bg-[var(--oc-canvas-deep)] p-4 text-[var(--oc-ink)] motion-safe:animate-[restAlertIn_var(--transition-base)_both]",
  restAlertTitle: "mt-2 text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.35] tracking-normal text-[var(--oc-ink)] oc-alert-before",
};

export function buttonClass(variant = "default", extra = "") {
  return cx(
    ui.buttonBase,
    variant === "primary" && ui.buttonPrimary,
    variant === "soft" && ui.buttonSoft,
    variant === "danger" && ui.buttonDanger,
    extra,
  );
}

export function MarkerLabel({ children, marker = "[+]", className = "", as: Tag = "p" }) {
  return (
    <Tag className={cx(ui.label, className)}>
      <span className={ui.marker}>{marker}</span> {children}
    </Tag>
  );
}

export function StatusText({ children, marker = "[status]", className = "" }) {
  return (
    <p className={cx(ui.timerSummary, className)}>
      <span className={ui.marker}>{marker}</span> {children}
    </p>
  );
}

export function MarkedPill({ children, marker = "[x]", selected = false, className = "" }) {
  return (
    <span className={cx(ui.pill, selected && ui.pillSelected, className)}>
      <span className={selected ? "text-current" : ui.marker}>{marker}</span> {children}
    </span>
  );
}

export function SelectField({ label, value, onChange, children, className = "" }) {
  return (
    <label className={cx(ui.filterField, className)}>
      <MarkerLabel as="span">{label}</MarkerLabel>
      <span className={ui.selectWrap}>
        <select className={ui.select} value={value} onChange={onChange}>
          {children}
        </select>
      </span>
    </label>
  );
}

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className={ui.toastMarked} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function EmptyBlock({ children, className = "" }) {
  return (
    <div className={cx(ui.emptyState, className)}>
      <span className={ui.marker}>[-]</span> {children}
    </div>
  );
}
