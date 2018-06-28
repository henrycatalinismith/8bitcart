const { createSelectors } = require("signalbox");

const composer = require("./composer");
const viewport = require("./viewport");

export const select = {
  composer: composer.selectors,
  viewport: viewport.selectors,
};

const selectors = createSelectors(select);

export default selectors;

