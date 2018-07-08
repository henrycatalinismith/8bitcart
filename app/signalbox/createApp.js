const { bindActionCreators, createStore, applyMiddleware, combineReducers, compose } = require("redux");
const { createMiddleware } = require("./createMiddleware");
const { createReducer } = require("./createReducer");
const { createSelectors } = require("./createSelectors");

exports.createApp = (actions, selectors, thunks, initialState, simpleActions = []) => {
  const actionCreators = {};
  const actionTypes = {};
  Object.keys(actions).forEach(key => {
    if (typeof actions[key] === 'function') {
      actionCreators[key] = actions[key];
    } else if (typeof actions[key] === 'string') {
      actionTypes[key] = actions[key];
    }
  });

  simpleActions.forEach(actionType => {
    actionCreators[actionType] = payload => ({
      type: actionType,
      ...payload,
    });
  });

  const middlewares = createMiddleware([]);

  const app = {};
  app.reducers = {};
  Object.keys(initialState).forEach(key => {
    app.reducers[key] = createReducer(initialState[key], {});
  });

  const reducer = combineReducers(app.reducers);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  app.store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(middlewares))
  );

  app.store = new Proxy(app.store, {
    get(target, name, receiver) {
      if (target[name]) {
        return target[name];
      }
      if (app.reducers[name]) {
        return app.store.getState()[name];
      }
    }
  });

  const select = createSelectors(selectors);
  app.actions = actionTypes;
  app.dispatch = bindActionCreators(actionCreators, app.store.dispatch);
  app.select = select.bindStore(app.store);

  app.dispatch2 = (actionType, payload) => {
    console.log(actionType, payload);
  }

  app.on = (actionType, reducerChanges) => {
    Object.keys(reducerChanges).forEach(reducerName => {
      const base = !!app.reducers[reducerName] ? app.reducers[reducerName].actionHandlers : {};
      app.reducers[reducerName] = createReducer({}, {
        ...base,
        [actionType]: reducerChanges[reducerName],
      });
    });
    const newReducer = combineReducers(app.reducers);
    app.store.replaceReducer(newReducer);
  }

  app.before = (actionType, m) => {
    if (!middlewares.befores[actionType]) {
      middlewares.befores[actionType] = [];
    }
    middlewares.befores[actionType].push(m);
  }

  app.after = (actionType, m) => {
    if (!middlewares.afters[actionType]) {
      middlewares.afters[actionType] = [];
    }
    middlewares.afters[actionType].push(m);
  }

  app.cancel = (actionType, m) => {
    if (!middlewares.cancels[actionType]) {
      middlewares.cancels[actionType] = [];
    }
    middlewares.cancels[actionType].push(m);
  }

  app.thunks = bindActionCreators(thunks, app.store.dispatch);

  return app;
};


