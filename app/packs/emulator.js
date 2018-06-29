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
    console.log(this.code);

    this.memory = new Uint8Array(0x8000);
    this.memory[0x6800] = 9;

    this.tick = () => dispatch(actions.tickEmulator(this.memory));
    this.interval = setInterval(this.tick, 16);

    this.tick();
    run(this.code, this.memory);
    this.tick();

    dispatch(actions.stopEmulator());
  },
});

/*
console.log(pegjs);
const parser = pegjs.buildParser(helpers + grammar);
console.log(parser);

let memory;
let changes;

const update = throttle(() => {
  postMessage({
    type: 'MEMORY',
    changes,
  });
  changes = {};
}, 16);

onmessage = ({ data }) => {
  switch (data.type) {
    case "INITIALIZE":
      memory = data.memory;
      changes = {};
      break;

    case "RUN_CODE":
      const ast = parser.parse(data.code);

      const javascript = escodegen.generate(ast, {
        format: {
          indent: {
            style: "  ",
          }
        }
      }).split("\n");

      javascript.shift();
      javascript.pop();

      const cart = [
        "(function() {",
        javascript.join("\n"),
        "}())",
      ].join("\n");

      const evalContext = {
        __lua: lua2js.stdlib.__lua,
        poke(address, value) {
          memory[address] = value;
          changes[address] = value;
          update();
        }
      };

      changes = {};
      saferEval(cart, evalContext)

      setTimeout(() => {
        postMessage({ type: "CODE_FINISHED" });
      }, 1000);
      break;
  }
};

*/
