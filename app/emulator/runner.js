const lua2js = require("lua2js");
const saferEval = require("safer-eval");

export default function run(code, memory) {
  const evalContext = {
    __lua: lua2js.stdlib.__lua,
    poke(address, value) {
      memory[address] = value;
    }
  };

  saferEval(code, evalContext)
}

