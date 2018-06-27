const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START)](store, action) {
    window.addEventListener("resize", () => {
      store.dispatch(actions.resizeViewport(
        window.innerWidth,
        window.innerHeight
      ));
    });
  }
}));

export default middleware;

