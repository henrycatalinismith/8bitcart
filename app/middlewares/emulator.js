const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let worker;
let screen;
let runTimeout;
let parseTimeout;

export const middleware = createMiddleware((cancel, before, after) => ({
  //[after(actions.CHANGE_CODE)](store, action) {
    //const code = select("editor").from(store).code();
    //if (parseTimeout) {
      //clearTimeout(parseTimeout);
    //}
    //if (runTimeout) {
      //clearTimeout(runTimeout);
    //}
    //runTimeout = setTimeout(() => {
      //store.dispatch(actions.parseCode(code));
    //}, 200);
    //runTimeout = setTimeout(() => {
      //store.dispatch(actions.startEmulator(code));
    //}, 2000);
  //},

  [before(actions.START_EMULATOR)](store, action) {
    const running = select("emulator").from(store).running();
    if (running) {
      store.dispatch(actions.stopEmulator());
    }
  },

  [after(actions.PARSE_CODE)](store, action) {
    const path = select("emulator").from(store).path();

    console.log("parse code");
    worker = runWorker("emulator", path, action, {
      [actions.SYNTAX_ERROR](dispatch, syntaxError) {
        store.dispatch(syntaxError);
      },

      [actions.STOP_EMULATOR](dispatch, stopEmulator) {
        store.dispatch(stopEmulator);
      }
    });
  },

  [after(actions.START_EMULATOR)](store, action) {
    const path = select("emulator").from(store).path();
    if (!action.code) {
      action.code = select("editor").from(store).code();
    }

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
    store.dispatch(actions.stopEmulator());
    clearTimeout(runTimeout);
    worker.terminate();
    if (screen) {
      screen.stop();
    }
  },

  [after(actions.STOP_EMULATOR)](store, action) {
    worker.terminate();
    if (screen) {
      screen.stop();
    }
  }
}));

export default middleware;

