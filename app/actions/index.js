const editor = require("./editor").default;
const emulator = require("./emulator").default;
const layout = require("./layout").default;
const tabs = require("./tabs").default;

const actions = Object.assign({},
  editor,
  emulator,
  layout,
  tabs,
);

export default actions;
