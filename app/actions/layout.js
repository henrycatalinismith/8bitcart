import { createActions } from "signalbox";

export default createActions([
  "RESIZE_VIEWPORT",
  "HIDE_STAGE",
  "SHOW_STAGE",
  "HIDE_TRAY",
  "SHOW_TRAY",
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
}));
