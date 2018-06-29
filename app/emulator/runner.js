const lua2js = require("lua2js");
const saferEval = require("safer-eval");

const api = require("./api").default;

export default function run(code, memory) {
  const evalContext = {
    __lua: lua2js.stdlib.__lua,
    ...api(memory),
  };

  saferEval(code, evalContext)
}

