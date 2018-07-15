const { createStore, applyMiddleware, combineReducers, compose } = require("redux");
const thunk = require("redux-thunk").default;
const { createSelectors } = require("signalbox");

const middleware = require("../middlewares").default;

const editor = require("./editor");
const emulator = require("./emulator");
const layout = require("./layout");
const tabs = require("./tabs");

const reducers = {
  editor: editor.reducer,
  emulator: emulator.reducer,
  layout: layout.reducer,
  tabs: tabs.reducer,
};

export default function (initialState) {
  const reducer = combineReducers(reducers);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(middleware, thunk))
  );

  return store;
}

