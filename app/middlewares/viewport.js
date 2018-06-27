const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START)](store, action) {
    const canvas = document.querySelector('canvas');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener("resize", () => {
      store.dispatch(actions.resizeViewport(
        window.innerWidth,
        window.innerHeight
      ));
    });
  }
}));

export default middleware;

