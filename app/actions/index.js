const editor = require("./editor").default;
const eightbit = require("./8bit").default;
const global = require("./global").default;
const viewport = require("./viewport").default;

const actions = Object.assign({},
  editor,
  eightbit,
  global,
  viewport,
);

export default actions;
