const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let worker;
let screen;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START_COMPOSER)](store, action) {
    screen = new Screen(document.querySelector("canvas"));
  },

  [after(actions.CHANGE_CODE)](store, action) {
    const code = select("composer").from(store).code();
    store.dispatch(actions.startEmulator(code));
  },

  [before(actions.START_EMULATOR)](store, action) {
    const running = select("emulator").from(store).running();
    if (running) {
      store.dispatch(actions.stopEmulator());
    }
    console.log('eee');
  },

  [after(actions.START_EMULATOR)](store, action) {
    const path = document.querySelector('#emulator').textContent.trim();

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

