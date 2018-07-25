const { createActions } = require("signalbox");

export default createActions([
  "PAGE_LOAD",
], types => ({
  pageLoad: (viewportWidth, viewportHeight, pathname) => ({
    type: types.PAGE_LOAD,
    viewportWidth,
    viewportHeight,
    pathname,
  })
}));
