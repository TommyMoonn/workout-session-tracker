import { dataDisplayStyles } from "./dataDisplay";
import { controlStyles } from "./controls";
import { layoutStyles } from "./layout";
import { overlayStyles } from "./overlays";
import { typographyStyles } from "./typography";

export const ui = {
  ...layoutStyles,
  ...typographyStyles,
  ...controlStyles,
  ...dataDisplayStyles,
  ...overlayStyles,
};
