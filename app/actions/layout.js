import { createActions } from "signalbox";

export default createActions([
  "RESIZE_VIEWPORT",
  "HIDE_STAGE",
  "SHOW_STAGE",
  "HIDE_TRAY",
  "SHOW_TRAY",
  "FOCUS_STAGE",
  "BLUR_STAGE",
  "FOCUS_TRAY",
  "BLUR_TRAY",
], types => ({
  resizeViewport: (viewportWidth, viewportHeight) => ({
    type: types.RESIZE_VIEWPORT,
    viewportWidth,
    viewportHeight,
  }),

  hideStage: () => ({ type: types.HIDE_STAGE }),
  showStage: () => ({ type: types.SHOW_STAGE }),

  hideTray: () => ({ type: types.HIDE_TRAY }),
  showTray: () => ({ type: types.SHOW_TRAY }),

  focusStage: () => ({ type: types.FOCUS_STAGE }),
  blurStage: () => ({ type: types.BLUR_STAGE }),

  focusTray: () => ({ type: types.FOCUS_TRAY }),
  blurTray: () => ({ type: types.BLUR_TRAY }),
}));
