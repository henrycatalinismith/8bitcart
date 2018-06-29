const saferEval = require("safer-eval");
const { throttle } = require("underscore");
const { createWorker } = require("signalbox");

const parse = require("../emulator/parser").default;
const compile = require("../emulator/compiler").default;
const run = require("../emulator/runner").default;
const actions = require("../actions").default;

createWorker("emulator", {
  [actions.START_EMULATOR](dispatch, action) {
    try {
      this.ast = parse(action.code);
    } catch (e) {
      return dispatch(actions.syntaxError(
        e.line,
        e.column,
        e.message,
      ));
    }

    this.code = compile(this.ast);
    console.log(action.code);
    //console.log(JSON.stringify(this.ast));
    console.log(this.code);

    this.memory = new Uint8Array(0x8000);
    this.memory[0x6800] = 9;

    this.tick = () => dispatch(actions.tickEmulator(this.memory));

    this.tick();
    run(this.code, this.memory);
    this.tick();
    this.interval = setInterval(this.tick, 16);

    dispatch(actions.stopEmulator());
  },
});

