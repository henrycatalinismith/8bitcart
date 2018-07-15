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

  [before(actions.FOCUS_TRAY)](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "stage") {
      store.dispatch(actions.blurStage());
    }
  },

  [before(actions.START_EMULATOR)](store, action) {
    const layout = select("layout").from(store);
    const mobile = layout.mobile();
    const stageHidden = layout.stageHidden();
    console.log(mobile, stageHidden);
    if (mobile && stageHidden) {
      store.dispatch(actions.showStage());
    }
  },

  [after(actions.FOCUS_TRAY)](store, action) {
    const mobile = select("layout").from(store).mobile();
    console.log(mobile);
    if (mobile) {
      store.dispatch(actions.hideStage());
    }
  },

  [after(actions.SHOW_STAGE)](store, action) {
    const focus = select("layout").from(store).focus();
    if (focus === "tray") {
      store.dispatch(actions.focusStage());
    }
  },
}));

export default middleware;

