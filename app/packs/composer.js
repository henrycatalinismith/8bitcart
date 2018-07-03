const React = require("react");
const ReactDOM = require("react-dom");
const { Provider } = require("react-redux");

const { createApp } = require("signalbox");
const Layout = require("../containers/layout").default;
const actions = require("../actions").default;
const middlewares = require("../middlewares").default;
const selectors = require("../reducers/selectors").default;
const createStore = require("../reducers").default;
const thunks = require("../thunks").default;

document.addEventListener('DOMContentLoaded', () => {
  const viewportHeight = window.innerHeight;

  const headerHeight = 32;
  const separatorHeight = 8;
  const footerHeight = 32;

  const availableHeight = (
    viewportHeight
    - headerHeight
    - footerHeight
    - separatorHeight
  );

  const initialState = {
    editor: {
      started: new Date,
      updated: undefined,
      width: window.innerWidth,
      height: availableHeight / 2,
      syntaxErrorLine: undefined,
      syntaxErrorColumn: undefined,
      syntaxErrorMessage: undefined,
    },
    emulator: {
      path: document.querySelector('#emulator').textContent.trim(),
      running: false,
      started: undefined,
      stopped: undefined,
      width: window.innerWidth,
      height: availableHeight / 2,
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
  ReactDOM.render(<Provider store={store}><Layout /></Provider>, root);

  window.addEventListener("resize", () => {
    app.dispatch.resizeViewport(
      window.innerWidth,
      window.innerHeight
    );
  });
});

