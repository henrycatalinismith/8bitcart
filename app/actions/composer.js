const { createActions } = require("signalbox");

export default createActions(["START", "CHANGE_CODE"], types => ({
  start: () => ({ type: types.START }),

  changeCode: code => ({
    type: types.CHANGE_CODE,
    composer: { code }
  })
}));
