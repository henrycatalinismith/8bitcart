const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [cancel(actions.HIDE_STAGE)](store, action) {
    const stageHeight = select("layout").from(store).stageHeight();
    return stageHeight === 0;
  },

  [before(actions.START_EMULATOR)](store, action) {
    const stageHidden = select("layout").from(store).stageHidden();
    if (stageHidden) {
      store.dispatch(actions.showStage());
    }
  },
}));

export default middleware;

