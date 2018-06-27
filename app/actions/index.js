const editor = require("./editor").default;
const global = require("./global").default;
const viewport = require("./viewport").default;

const actions = Object.assign({},
  editor,
  global,
  viewport,
);

export default actions;
