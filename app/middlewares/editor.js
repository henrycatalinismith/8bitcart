require("codemirror/mode/lua/lua");
require("codemirror/addon/edit/closebrackets");

const CodeMirror = require("codemirror");

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;

let cm;
const markers = [];

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START)](store, action) {
    const textarea = document.querySelector('.Cart__textarea');

    cm = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: "lua",
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
  },

  [after(actions.CHANGE_CODE)](store, action) {
    markers.forEach(marker => marker.clear());
  },

  [after(actions.SYNTAX_ERROR)](store, action) {
    const line = action.line;
    const column = action.column;

    const from = {
      line: line - 1,
      ch: column - 2,
    }

    const to = {
      line: line - 1,
      ch: column - 1,
    };

    const options = {
      className: 'syntax-error',
    };

    setTimeout(() => {
      markers.push(cm.markText(from, to, options));
    }, 100);
  }
}));

export default middleware;

