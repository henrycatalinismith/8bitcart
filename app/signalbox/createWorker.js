exports.createWorker = (name, actions) => {
  const context = {};
  const dispatch = action => postMessage(action);

  onmessage = ({ data: action }) => {
    const callback = actions[action.type];
    if (callback === undefined) {
      return;
    }
    callback.call(context, dispatch, action);
  }
};

