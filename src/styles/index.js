import { dataDisplayStyles } from "./dataDisplay";
import { controlStyles } from "./controls";
import { exerciseStyles } from "./exercise";
import { historyStyles } from "./history";
import { layoutStyles } from "./layout";
import { overlayStyles } from "./overlays";
import { settingsStyles } from "./settings";
import { timerStyles } from "./timer";
import { typographyStyles } from "./typography";

export const ui = {
  ...layoutStyles,
  ...typographyStyles,
  ...controlStyles,
  ...dataDisplayStyles,
  ...timerStyles,
  ...historyStyles,
  ...exerciseStyles,
  ...settingsStyles,
  ...overlayStyles,
};
