const { createSelectors } = require("signalbox");

const editor = require("./editor");
const emulator = require("./emulator");
const viewport = require("./viewport");

export const select = {
  editor: editor.selectors,
  emulator: emulator.selectors,
  viewport: viewport.selectors,
};

const selectors = createSelectors(select);

export default selectors;

