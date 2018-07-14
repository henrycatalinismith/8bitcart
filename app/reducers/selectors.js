const { createSelectors } = require("signalbox");

const editor = require("./editor");
const layout = require("./layout");
const emulator = require("./emulator");

export const select = {
  editor: editor.selectors,
  layout: layout.selectors,
  emulator: emulator.selectors,
};

const selectors = createSelectors(select);

export default selectors;

