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
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const headerHeight = 32;
  const headerWidth = viewportWidth;

  let emulatorWidth;
  let emulatorHeight;

  let separatorHeight;
  let separatorWidth;

  let editorWidth;
  let editorHeight;

  const footerWidth = viewportWidth;
  const footerHeight = 32;

  if (viewportWidth < viewportHeight) {
    separatorHeight = 8;
    separatorWidth = viewportWidth;

    emulatorWidth = viewportWidth;
    emulatorHeight = Math.min(viewportWidth, viewportHeight*0.75);

    editorWidth = viewportWidth;
    editorHeight = (
      viewportHeight
      - headerHeight
      - emulatorHeight
      - separatorHeight
      - footerHeight
    );

  } else {
    separatorHeight = viewportHeight;
    separatorWidth = 8;

    //editorWidth = Math.min(512, viewportWidth - Math.min(viewportHeight, viewportWidth*0.75)) - separatorWidth;
    editorWidth = 410;
    //editorWidth = (
      //viewportWidth
      //- emulatorWidth
      //- separatorWidth
    //);
    editorHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );

    //emulatorWidth = Math.min(viewportHeight, viewportWidth*0.75);
    emulatorWidth = viewportWidth - editorWidth - separatorWidth;
    emulatorHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );


  }


  const initialState = {
    editor: {
      started: new Date,
      updated: undefined,
      width: editorWidth,
      height: editorHeight,
      syntaxErrorLine: undefined,
      syntaxErrorColumn: undefined,
      syntaxErrorMessage: undefined,
    },
    emulator: {
      path: document.querySelector('#emulator').textContent.trim(),
      running: false,
      started: undefined,
      stopped: undefined,
      width: emulatorWidth,
      height: emulatorHeight,
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

