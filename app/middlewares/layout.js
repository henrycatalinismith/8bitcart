const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [cancel(actions.FOCUS_TRAY)](store, action) {
    const focus = select("layout").from(store).focus();
    return focus === "tray";
  },

  [cancel(actions.HIDE_STAGE)](store, action) {
    const stageHeight = select("layout").from(store).stageHeight();
    return stageHeight === 0;
  },

  [before("@@router/LOCATION_CHANGE")](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "tray") {
      store.dispatch(actions.focusTray());
    }
  },

  [before(actions.FOCUS_TRAY)](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "stage") {
      store.dispatch(actions.blurStage());
    }
  },

  [before(actions.SELECT_TAB)](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "stage") {
      store.dispatch(actions.focusTray());
    }
  },

  [before(actions.START_EMULATOR)](store, action) {
    const layout = select("layout").from(store);
    const portrait = select("layout").from(store).orientation() === "portrait";
    const stageHidden = layout.stageHidden();
    console.log(portrait, stageHidden);
    if (portrait && stageHidden) {
      store.dispatch(actions.showStage());
    }
  },

  [after(actions.FOCUS_TRAY)](store, action) {
    const orientation = select("layout").from(store).orientation();
    console.log(orientation);
    if (orientation === "portrait") {
      store.dispatch(actions.hideStage());
    }

    const oldHeight = select("layout").from(store).viewportHeight();
    setTimeout(() => {
      const newHeight = window.innerHeight;
      console.log(oldHeight, newHeight);
      window.scroll(0, 0);

      window.scroll(0, 10);
      const keyboard = window.scrollY > 0;
      window.scroll(0, 0);

      if (keyboard) {
        //store.dispatch(actions.resizeViewport(
          //window.innerWidth,
          //window.innerHeight
        //));
      }
    }, 100);
  },

  [after(actions.SHOW_STAGE)](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "tray") {
      store.dispatch(actions.focusStage());
    }
  },
}));

export default middleware;

