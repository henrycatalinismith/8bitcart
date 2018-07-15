const { findKey } = require("underscore");
const { createReducer } = require("signalbox");

const actions = require("../actions").default;

export const reducer = createReducer({}, {
  [actions.SELECT_TAB](tabs, action) {
    const prev = findKey(tabs, tab => tab.active);
    const next = action.tab.key;
    return {
      ...tabs,
      [prev]: {
        ...tabs[prev],
        active: false,
      },
      [next]: {
        ...tabs[next],
        active: true,
      },
    };
  },
});

export const selectors = {
  all: tabs => tabs,
  active: tabs => findKey(tabs, tab => tab.active),
};

