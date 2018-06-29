exports.runWorker = (name, path, init, actions) => {
  const worker = new Worker(path);
  const dispatch = action => worker.postMessage(action);

  worker.onmessage = ({ data: action }) => {
    const callback = actions[action.type];
    if (callback === undefined) {
      return;
    }
    callback.call(worker, dispatch, action);
  }

  worker.postMessage(init);
  return worker;
};

