const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {
  width: 0,
  height: 0
};

export const reducer = createReducer(initialState, {
  [actions.RESIZE_VIEWPORT](viewport, action) {
    return {
      width: action.viewport.width,
      height: action.viewport.height,
    };
  },
});

export const selectors = {
  dimensions: viewport => viewport,
  width: viewport => viewport.width,
  height: viewport => viewport.height,
};

