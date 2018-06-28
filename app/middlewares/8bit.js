const { parse, render } = require("../8bit");

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let canvas;
let workerPath;
let worker;
let raf;
let running = true;
let memory = new Uint8Array(0x8000);

memory[0x7000] = 9; // one yellow pixel halfway down the screen

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START)](store, action) {
    workerPath = document.querySelector('#worker').textContent.trim();
    worker = new Worker(workerPath);
    canvas = document.querySelector('canvas');

    worker.onmessage = ({ data }) => {
      switch (data.type) {
        case 'CODE_FINISHED':
          running = false;
          break;

        case 'POKE':
          //console.log(`${data.address}: ${data.value}`);
          memory[data.address] = data.value;
          break;
      }
    }

    worker.postMessage({
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
    const state = store.getState();
    const code = select("editor").from(state).code();

    let ast;
    try {
      ast = parse(code);
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
    worker.postMessage({
      type: 'RUN_CODE',
      code,
    });
  }
}));

export default middleware;

