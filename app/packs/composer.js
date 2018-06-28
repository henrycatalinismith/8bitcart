const { createApp } = require("signalbox");

const actions = require("../actions").default;
const middlewares = require("../middlewares").default;
const selectors = require("../reducers/selectors").default;
const createStore = require("../reducers").default;
const thunks = require("../thunks").default;

document.addEventListener('DOMContentLoaded', () => {
  const initialState = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  };

  const store = createStore(initialState);
  const app = createApp(store, actions, middlewares, selectors, thunks);

  app.dispatch.start();
});

