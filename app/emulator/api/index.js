const memset = require("./memset");
const peek = require("./peek");
const poke = require("./poke");

export default memory => ({
  memset: memset(memory),
  peek: peek(memory),
  poke: poke(memory),
});
