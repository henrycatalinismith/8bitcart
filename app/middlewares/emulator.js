const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let worker;
let screen;
let timeout;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.CHANGE_CODE)](store, action) {
    const code = select("editor").from(store).code();
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      store.dispatch(actions.startEmulator(code));
    }, 2000);
  },

  [before(actions.START_EMULATOR)](store, action) {
    const running = select("emulator").from(store).running();
    if (running) {
      store.dispatch(actions.stopEmulator());
    }
  },

  [after(actions.START_EMULATOR)](store, action) {
    const path = select("emulator").from(store).path();

    if (screen === undefined) {
      screen = new Screen(document.querySelector("canvas"));
    }

    worker = runWorker("emulator", path, action, {
      [actions.SYNTAX_ERROR](dispatch, syntaxError) {
        store.dispatch(syntaxError);
      },

      [actions.TICK_EMULATOR](dispatch, tickEmulator) {
        screen.update(tickEmulator.memory);
      },

      [actions.STOP_EMULATOR](dispatch, stopEmulator) {
        store.dispatch(stopEmulator);
      }
    });

    screen.start();
  },

  [after(actions.SYNTAX_ERROR)](store, action) {
    worker.terminate();
    screen.stop();
  },

  [after(actions.STOP_EMULATOR)](store, action) {
    worker.terminate();
    screen.stop();
  }
}));

export default middleware;

