const { createStore, applyMiddleware, combineReducers, compose } = require("redux");
const thunk = require("redux-thunk").default;
const { createSelectors } = require("signalbox");

const middleware = require("../middlewares").default;

const composer = require("./composer");
const emulator = require("./emulator");
const viewport = require("./viewport");

const reducers = {
  composer: composer.reducer,
  emulator: emulator.reducer,
  viewport: viewport.reducer,
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

