const { createSelectors } = require("signalbox");

const composer = require("./composer");
const emulator = require("./emulator");
const viewport = require("./viewport");

export const select = {
  composer: composer.selectors,
  emulator: emulator.selectors,
  viewport: viewport.selectors,
};

const selectors = createSelectors(select);

export default selectors;

