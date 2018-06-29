const { createActions } = require("signalbox");

export default createActions(["START_COMPOSER", "CHANGE_CODE"], types => ({
  startComposer: () => ({ type: types.START_COMPOSER }),

  changeCode: code => ({
    type: types.CHANGE_CODE,
    composer: { code }
  })
}));
