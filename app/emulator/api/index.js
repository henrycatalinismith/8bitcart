const peek = require("./peek");
const poke = require("./poke");

export default memory => ({
  peek: peek(memory),
  poke: poke(memory),
});
