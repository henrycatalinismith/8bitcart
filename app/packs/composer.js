const React = require("react");
const ReactDOM = require("react-dom");
const { Provider } = require("react-redux");

const { createApp } = require("signalbox");
const Composer = require("../containers/composer").default;
const actions = require("../actions").default;
const middlewares = require("../middlewares").default;
const selectors = require("../reducers/selectors").default;
const createStore = require("../reducers").default;
const thunks = require("../thunks").default;

document.addEventListener('DOMContentLoaded', () => {
  const initialState = {
    composer: {
      lastUpdate: new Date,
    },
    emulator: {
      running: false,
      width: window.innerWidth,
      height: 100,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  };

  const store = createStore(initialState);
  const app = createApp(store, actions, middlewares, selectors, thunks);

  const root = document.createElement("div");
  root.className = "composer";
  document.body.appendChild(root);
  ReactDOM.render(<Provider store={store}><Composer /></Provider>, root);

  app.dispatch.startComposer();
});

