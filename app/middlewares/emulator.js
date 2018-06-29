const { parse, render } = require("../emulator");

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let canvas;
let emulatorPath;
let emulator;
let raf;
let running = true;
let memory = new Uint8Array(0x8000);

memory[0x7000] = 9; // one yellow pixel halfway down the screen

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START_COMPOSER)](store, action) {
    emulatorPath = document.querySelector('#emulator').textContent.trim();
    emulator = new Worker(emulatorPath);
    canvas = document.querySelector('canvas');

    emulator.onmessage = ({ data }) => {
      switch (data.type) {
        // receive a memory update from the emulator
        case 'MEMORY':
          Object.keys(data.changes).forEach(addr => {
            console.log(addr, data.changes[addr]);
            memory[addr] = data.changes[addr];
          });
          break;

        // the emulator is done!
        case 'CODE_FINISHED':
          running = false;
          break;
      }
    }

    emulator.postMessage({
      type: 'INITIALIZE',
      memory,
    });

    raf = () => {
      render(memory, canvas);
      if (running) {
        requestAnimationFrame(raf);
      } else {
        console.log('stopping');
      }
    };
  },

  [after(actions.CHANGE_CODE)](store, action) {
    // delay here or something?
    // only wanna run the emulator at most like once per second
    const state = store.getState();
    const code = select("composer").from(state).code();
    store.dispatch(actions.startEmulator(code));
  },

  [after(actions.START_EMULATOR)](store, action) {
    const state = store.getState();
    const code = select("composer").from(state).code();

    let ast;

    try {
      ast = parse(action.code);
    } catch (e) {
      store.dispatch(actions.syntaxError(
        e.line,
        e.column,
        e.message,
      ));
      return;
    }

    running = true
    requestAnimationFrame(raf);
    emulator.postMessage({
      type: 'RUN_CODE',
      code: action.code,
    });
  }
}));

export default middleware;

