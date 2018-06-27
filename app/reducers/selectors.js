const { createSelectors } = require("signalbox");

const editor = require("./editor");
const viewport = require("./viewport");

export const select = {
  editor: editor.selectors,
  viewport: viewport.selectors,
};

const selectors = createSelectors(select);
