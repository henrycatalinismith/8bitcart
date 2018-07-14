const editor = require("./editor").default;
const layout = require("./layout").default;
const emulator = require("./emulator").default;

const actions = Object.assign({},
  editor,
  layout,
  emulator,
);

export default actions;
