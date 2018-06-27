//require("codemirror/mode/lua/lua");
//require("codemirror/addon/edit/closebrackets");

const CodeMirror = require("codemirror");

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START)](store, action) {

    const textarea = document.querySelector('.Cart__textarea');

    const cm = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      //mode: "lua",
      autofocus: true,
      indentWithTabs: false,
      indentSize: 2,
      indentUnit: 1,
      smartIndent: true,
      cursorBlinkRate: 500,
    });

    cm.on("keyup", () => {
      store.dispatch(actions.changeCode(cm.getValue()));
    })
  }
}));

export default middleware;

