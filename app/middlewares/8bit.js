const eightbit = require("../8bit").default;

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.CHANGE_CODE)](store, action) {
    const state = store.getState();
    const canvas = document.querySelector('canvas');
    const code = select("editor").from(state).code();

    eightbit(code, canvas);
  }
}));

export default middleware;

