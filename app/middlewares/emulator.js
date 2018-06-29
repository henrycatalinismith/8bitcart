const { createMiddleware, runWorker } = require("signalbox");

const { parse, render } = require("../emulator");
const Screen = require("../emulator/screen").default;
const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let worker;
let screen;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START_COMPOSER)](store, action) {
    screen = new Screen(document.querySelector("canvas"));
  },

  [after(actions.CHANGE_CODE)](store, action) {
    // delay here or something?
    // only wanna run the emulator at most like once per second
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
    const code = select("composer").from(store).code();

    const path = document.querySelector('#emulator').textContent.trim();

    worker = runWorker("emulator", path, action, {
      [actions.SYNTAX_ERROR](dispatch, syntaxError) {
        store.dispatch(syntaxError);
      },

      [actions.TICK_EMULATOR](dispatch, tickEmulator) {
        console.log(tickEmulator);
        screen.update(tickEmulator.memory);
      },

      [actions.STOP_EMULATOR](dispatch, stopEmulator) {
        store.dispatch(stopEmulator);
      }
    });

    screen.start();
  },

  [after(actions.SYNTAX_ERROR)](store, action) {
    console.log('stopping (syntax)!');
    worker.terminate();
    screen.stop();
  },

  [after(actions.STOP_EMULATOR)](store, action) {
    console.log('stopping!');
    worker.terminate();
    screen.stop();
  }
}));

/*
    const emulator = new Worker(emulatorPath);
    const canvas = document.querySelector('canvas');

    let running = true;
    let memory = new Uint8Array(0x8000);
    memory[0x7000] = 9; // one yellow pixel halfway down the screen

    emulator.onmessage = ({ data }) => {
      switch (data.type) {
        case actions.TICK_EMULATOR:
          console.log(data);
          break;

        case actions.STOP_EMULATOR:
          console.log('terminate!');
          store.dispatch(data);
          emulator.terminate();
          break;

        // receive a memory update from the emulator
        case 'MEMORY':
          Object.keys(data.changes).forEach(addr => {
            console.log(addr, data.changes[addr]);
            memory[addr] = data.changes[addr];
          });
          break;

      }
    }

    worker.postMessage(action);

    const raf = () => {
      render(memory, canvas);
      if (running) {
        requestAnimationFrame(raf);
      } else {
        console.log('stopping');
      }
    };


  /*
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
      type: 'START_EMULATOR',
      code: action.code,
    });
    */

export default middleware;

