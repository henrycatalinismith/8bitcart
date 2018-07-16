const React = require("react");
const ReactDOM = require("react-dom");
const { Provider } = require("react-redux");
const { createBrowserHistory } = require("history");
const { ConnectedRouter } = require("connected-react-router");
const { Route, Switch } = require("react-router");

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

  let stageWidth;
  let stageHeight;

  let separatorHeight;
  let separatorWidth;

  let trayWidth;
  let trayHeight;

  const footerWidth = viewportWidth;
  const footerHeight = 32;

  if (viewportWidth < viewportHeight) {
    separatorHeight = 8;
    separatorWidth = viewportWidth;

    stageWidth = viewportWidth;
    stageHeight = Math.min(viewportWidth, viewportHeight*0.75);

    trayWidth = viewportWidth;
    trayHeight = (
      viewportHeight
      - headerHeight
      - stageHeight
      - separatorHeight
      - footerHeight
    );

  } else {
    separatorHeight = viewportHeight;
    separatorWidth = 8;

    //trayWidth = Math.min(512, viewportWidth - Math.min(viewportHeight, viewportWidth*0.75)) - separatorWidth;
    trayWidth = 410;
    //trayWidth = (
      //viewportWidth
      //- stageWidth
      //- separatorWidth
    //);
    trayHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );

    //stageWidth = Math.min(viewportHeight, viewportWidth*0.75);
    stageWidth = viewportWidth - trayWidth - separatorWidth;
    stageHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );


  }

  const cartHtml = document.querySelector("#cart");
  const cartJson = cartHtml ? cartHtml.textContent : "{}";
  const cartData = JSON.parse(cartJson);

  const initialState = {
    editor: {
      code: cartData.lua,
      started: new Date,
      updated: undefined,
      width: trayWidth,
      height: trayHeight,
      syntaxErrorLine: undefined,
      syntaxErrorColumn: undefined,
      syntaxErrorMessage: undefined,
    },
    emulator: {
      path: document.querySelector('#emulator').textContent.trim(),
      running: false,
      started: undefined,
      stopped: undefined,
      width: stageWidth,
      height: stageHeight,
    },
    layout: {
      focus: "stage",
      orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
      stageWidth: stageWidth,
      stageHeight: stageHeight,
      trayWidth: trayWidth,
      trayHeight: trayHeight,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    },
    tabs: {
      code: {
        label: "Code",
        active: true,
      },
      help: {
        label: "Help",
        active: false,
      }
    }
  };

  const history = createBrowserHistory();
  const store = createStore(initialState, history);
  const app = createApp(store, actions, middlewares, selectors, thunks);

  const root = document.createElement("div");
  root.className = "composer";
  root.id = "root";
  document.body.appendChild(root);
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" render={() => (
            <Layout />
          )} />
          <Route render={() => (<div>Miss</div>)} />
        </Switch>
      </ConnectedRouter>
    </Provider>,
    root
  );

  window.addEventListener("resize", () => {
    app.dispatch.resizeViewport(
      window.innerWidth,
      window.innerHeight
    );
  });
});

