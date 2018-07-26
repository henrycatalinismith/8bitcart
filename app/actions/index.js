const { push } = require("connected-react-router");
const router = { push };

const editor = require("./editor").default;
const emulator = require("./emulator").default;
const global = require("./global").default;
const layout = require("./layout").default;
const tabs = require("./tabs").default;

const actions = Object.assign({},
  editor,
  emulator,
  global,
  layout,
  router,
  tabs,
);

export default actions;
