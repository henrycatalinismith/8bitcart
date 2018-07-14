const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [before(actions.START_EMULATOR)](store, action) {
    const stageHeight = select("layout").from(store).stageHeight();
    if (stageHeight === 0) {
      store.dispatch(actions.showStage());
    }
  },
}));

export default middleware;

