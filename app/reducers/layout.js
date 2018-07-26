const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const o = (w, h) => w > h ? "landscape" : "portrait";

const headerHeight = 32;
const footerHeight = 32;

const trayPathnames = ["/"];

const l = (layout, viewport, pathname) => {
  const { viewportWidth, viewportHeight } = viewport;

  const orientation = o(viewportWidth, viewportHeight);
  const headerWidth = viewportWidth;
  const footerWidth = viewportWidth;
  const trayVisible = trayPathnames.includes(pathname);

  let separatorHeight;
  let separatorWidth;
  let stageHeight;
  let stageWidth;
  let trayHeight;
  let trayWidth;

  if (orientation === "landscape") {
    separatorHeight = viewportHeight;
    separatorWidth = 8;
    trayWidth = trayVisible ? 410 : 0;
    trayHeight = viewportHeight - headerHeight - footerHeight;
    stageWidth = viewportWidth - trayWidth - separatorWidth;
    stageHeight = viewportHeight - headerHeight - footerHeight;
  } else {
    separatorHeight = 8;
    separatorWidth = viewportWidth;
    stageWidth = viewportWidth;
    stageHeight = trayVisible
      ? Math.min(viewportWidth, viewportHeight*0.75)
      : viewportHeight - headerHeight - footerHeight;
    trayWidth = viewportWidth;
    trayHeight = trayVisible ? (
      viewportHeight
      - headerHeight
      - stageHeight
      - separatorHeight
      - footerHeight
    ) : 0;
  }

  return {
    ...layout,
    orientation,
    separatorHeight,
    separatorWidth,
    stageHeight,
    stageWidth,
    trayHeight,
    trayWidth,
    trayVisible,
    viewportHeight: viewportHeight,
    viewportWidth: viewportWidth,
  };
};


export const reducer = createReducer({}, {
  [actions.PAGE_LOAD](layout, action) {
    const newLayout = l(layout, action, action.pathname);
    return {
      ...layout,
      ...newLayout,
    };
  },

  "@@router/LOCATION_CHANGE": (layout, action) => {
    const newLayout = l(layout, layout, action.payload.location.pathname);
    return {
      ...layout,
      ...newLayout,
    };
  },

  [actions.RESIZE_VIEWPORT](layout, action) {
    const newLayout = l(layout, action, layout.pathname);
    return {
      ...layout,
      ...newLayout,
    };
  },

  [actions.HIDE_STAGE](layout, action) {
    switch (layout.orientation) {
      case "landscape":
        return {
          ...layout,
          stageWidth: 0,
          stageWidthBackup: layout.stageWidth,
          trayWidth: layout.trayWidth + layout.stageWidth,
          trayWidthBackup: layout.trayWidth,
        };
        break;

      case "portrait":
        return {
          ...layout,
          stageHeight: 0,
          stageHeightBackup: layout.stageHeight,
          trayHeight: layout.trayHeight + layout.stageHeight,
          trayHeightBackup: layout.trayHeight,
        };
    }
  },

  [actions.SHOW_STAGE](layout, action) {
    switch (layout.orientation) {
      case "landscape":
        return {
          ...layout,
          stageWidth: layout.stageWidthBackup,
          stageWidthBackup: undefined,
          trayWidth: layout.trayWidthBackup,
          trayWidthBackup: undefined,
        };
        break;

      case "portrait":
        return {
          ...layout,
          stageHeight: layout.stageHeightBackup,
          stageHeightBackup: undefined,
          trayHeight: layout.trayHeightBackup,
          trayHeightBackup: undefined,
        };
    }
  },

  [actions.BLUR_STAGE](layout, action) {
    return {
      ...layout,
      focus: undefined,
    };
  },

  [actions.BLUR_TRAY](layout, action) {
    return {
      ...layout,
      focus: undefined,
    };
  },

  [actions.FOCUS_STAGE](layout, action) {
    return {
      ...layout,
      focus: "stage",
    };
  },

  [actions.FOCUS_TRAY](layout, action) {
    return {
      ...layout,
      focus: "tray",
    };
  },
});

export const selectors = {
  focus: layout => layout.focus,
  mobile: layout => Math.max(
    layout.screenWidth,
    layout.screenHeight
  ) <= 980,
  orientation: layout => layout.orientation,
  viewportWidth: layout => layout.viewportWidth,
  viewportHeight: layout => layout.viewportHeight,
  stageWidth: layout => layout.stageWidth,
  stageHeight: layout => layout.stageHeight,
  stageHidden: layout => ({
    landscape: layout.stageWidth === 0,
    portrait: layout.stageHeight === 0,
  })[layout.orientation],
  trayWidth: layout => layout.trayWidth,
  trayHeight: layout => layout.trayHeight,
  trayVisible: layout => layout.trayVisible,
  emulatorSize: layout => Math.min(layout.stageWidth, layout.stageHeight) - 8,
};

