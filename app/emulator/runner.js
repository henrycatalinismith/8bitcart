require("babel-polyfill");
const lua2js = require("lua2js");
const saferEval = require("safer-eval");

const api = require("./api");

export default function run(code, memory) {
  const evalContext = {
    __lua: lua2js.stdlib.__lua,
    ...api(memory),
  };

  delete global['__core-js_shared__'];

  return saferEval(code, evalContext)
}

