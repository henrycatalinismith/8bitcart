const { createReducer } = require("signalbox");

const actions = require("../actions").default;

export const reducer = createReducer({}, {
  [actions.RESIZE_VIEWPORT](layout, action) {
    return {
      ...layout,
      viewportWidth: action.viewportWidth,
      viewportHeight: action.viewportHeight,
    };
  },

  [actions.HIDE_STAGE](layout, action) {
    return {
      ...layout,
      stageHeight: 0,
      stageHeightBackup: layout.stageHeight,
      trayHeight: layout.trayHeight + layout.stageHeight,
      trayHeightBackup: layout.trayHeight,
    };
  },

  [actions.SHOW_STAGE](layout, action) {
    return {
      ...layout,
      stageHeight: layout.stageHeightBackup,
      stageHeightBackup: undefined,
      trayHeight: layout.trayHeightBackup,
      trayHeightBackup: undefined,
    };
  },
});

export const selectors = {
  viewportWidth: layout => layout.viewportWidth,
  viewportHeight: layout => layout.viewportHeight,
  stageWidth: layout => layout.stageWidth,
  stageHeight: layout => layout.stageHeight,
  trayWidth: layout => layout.trayWidth,
  trayHeight: layout => layout.trayHeight,
};

