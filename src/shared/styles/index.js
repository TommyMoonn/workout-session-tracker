import { dataDisplayStyles } from "./dataDisplay";
import { controlStyles } from "./controls";
import { layoutStyles } from "./layout";
import { motionStyles } from "./motion";
import { overlayStyles } from "./overlays";
import { typographyStyles } from "./typography";

export const ui = {
  ...layoutStyles,
  ...motionStyles,
  ...typographyStyles,
  ...controlStyles,
  ...dataDisplayStyles,
  ...overlayStyles,
};
