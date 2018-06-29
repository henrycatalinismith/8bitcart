const poke = require("./poke");

export default memory => ({
  poke: poke(memory),
});
