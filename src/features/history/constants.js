export const historyPageSizes = {
  list: 6,
  card: 9,
};

export function getHistoryPageSize(displayMode) {
  return historyPageSizes[displayMode] ?? historyPageSizes.list;
}
