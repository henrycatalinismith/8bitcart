const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const o = (w, h) => w > h ? "landscape" : "portrait";

export const reducer = createReducer({}, {
  [actions.RESIZE_VIEWPORT](layout, action) {
    const { viewportWidth, viewportHeight } = action;
    const oldOrientation = layout.orientation;
    const newOrientation = o(viewportWidth, viewportHeight);
    const orientationChange = oldOrientation !== newOrientation;

    const headerHeight = 32;
    const headerWidth = viewportWidth;
    const footerWidth = viewportWidth;
    const footerHeight = 32;

    let separatorHeight;
    let separatorWidth;
    let stageHeight;
    let stageWidth;
    let trayHeight;
    let trayWidth;

    if (newOrientation === "landscape") {
      separatorHeight = viewportHeight;
      separatorWidth = 8;

      //trayWidth = Math.min(512, viewportWidth - Math.min(viewportHeight, viewportWidth*0.75)) - separatorWidth;
      trayWidth = 410;
      //trayWidth = (
        //viewportWidth
        //- stageWidth
        //- separatorWidth
      //);
      trayHeight = (
        viewportHeight
        - headerHeight
        - footerHeight
      );
      //trayWidth = 0;

      stageWidth = viewportWidth - trayWidth - separatorWidth;
      stageHeight = (
        viewportHeight
        - headerHeight
        - footerHeight
      );
    } else {
      separatorHeight = 8;
      separatorWidth = viewportWidth;

      stageWidth = viewportWidth;
      stageHeight = Math.min(viewportWidth, viewportHeight*0.75);

      trayWidth = viewportWidth;
      trayHeight = (
        viewportHeight
        - headerHeight
        - stageHeight
        - separatorHeight
        - footerHeight
      );
    }

    return {
      ...layout,
      orientation: action.viewportWidth > action.viewportHeight
        ? "landscape"
        : "portrait",
      separatorHeight,
      separatorWidth,
      stageHeight,
      stageWidth,
      trayHeight,
      trayWidth,
      viewportHeight: action.viewportHeight,
      viewportWidth: action.viewportWidth,
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
};

