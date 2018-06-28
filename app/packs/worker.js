const escodegen = require("escodegen");
const lua2js = require("lua2js");
const saferEval = require("safer-eval");
const { throttle } = require("underscore");

const eightbit = require("../8bit").default;

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
      const ast = lua2js.parse(data.code);

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

