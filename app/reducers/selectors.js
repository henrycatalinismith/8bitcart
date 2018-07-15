const { createSelectors } = require("signalbox");

const editor = require("./editor");
const emulator = require("./emulator");
const layout = require("./layout");
const tabs = require("./tabs");

export const select = {
  editor: editor.selectors,
  layout: layout.selectors,
  emulator: emulator.selectors,
  tabs: tabs.selectors,
};

const selectors = createSelectors(select);

export default selectors;

