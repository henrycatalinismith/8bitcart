const { createMiddleware, runWorker } = require("signalbox");
const { Screen } = require("emulator");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let worker;
let screen;
let runTimeout;
let parseTimeout;

export const middleware = createMiddleware((cancel, before, after) => ({
}));

export default middleware;

