const { createActions } = require("signalbox");

export default createActions([
  "SELECT_TAB",
], types => ({
  selectTab: key => ({
    type: types.SELECT_TAB,
    tab: { key },
  })
}));
