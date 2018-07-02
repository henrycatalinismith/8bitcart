require("babel-polyfill");

const saferEval = require("safer-eval");
const { throttle } = require("underscore");
const { createWorker } = require("signalbox");

const parse = require("../emulator/parser").default;
const compile = require("../emulator/compiler").default;
const run = require("../emulator/runner").default;
const actions = require("../actions").default;

const tryParse = (dispatch, code) => {
  try {
    return parse(code);
  } catch (e) {
    return dispatch(actions.syntaxError(
      e.line,
      e.column,
      e.message,
    ));
  }
}

createWorker("emulator", {
  [actions.PARSE_CODE](dispatch, action) {
    tryParse(dispatch, action.code);
    dispatch(actions.stopEmulator());
  },

  [actions.START_EMULATOR](dispatch, action) {
    this.ast = tryParse(dispatch, action.code);

    this.code = compile(this.ast);
    this.memory = new Uint8Array(0x8000);

    this.tick = () => dispatch(actions.tickEmulator(this.memory.slice(0x6000)));

    this.tick();
    this.interval = setInterval(this.tick, 16);
    run(this.code, this.memory).then(() => {
      this.tick();
      dispatch(actions.stopEmulator());
    });;

  },
});

