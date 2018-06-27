const { createSelectors } = require("signalbox");

const viewport = require("./viewport");

export const select = {
  viewport: viewport.selectors,
};

const selectors = createSelectors(select);
