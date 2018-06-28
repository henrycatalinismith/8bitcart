const escodegen = require("escodegen");
const lua2js = require("lua2js");
const saferEval = require("safer-eval");

const eightbit = require("../8bit").default;

let memory;

onmessage = ({ data }) => {
  switch (data.type) {
    case "INITIALIZE":
      memory = data.memory;
      break;

    case "RUN_CODE":
      const ast = lua2js.parse(data.code);

      console.log(ast);
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
          postMessage({
            type: "POKE",
            address,
            value,
          });
        }
      };

      saferEval(cart, evalContext)
      console.log(cart);

      setTimeout(() => {
        postMessage({ type: "CODE_FINISHED" });
      }, 1000);
      break;
  }
};

