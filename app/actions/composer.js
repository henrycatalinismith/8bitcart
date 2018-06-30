const { createActions } = require("signalbox");

export default createActions([
  "START_COMPOSER",
  "MOUNT_TEXTAREA",
  "CHANGE_CODE",
], types => ({
  startComposer: () => ({ type: types.START_COMPOSER }),

  mountTextarea: textarea => ({
    type: types.MOUNT_TEXTAREA,
    textarea,
  }),

  changeCode: code => ({
    type: types.CHANGE_CODE,
    composer: { code }
  })
}));
