require("codemirror/mode/lua/lua");
require("codemirror/addon/edit/closebrackets");

const CodeMirror = require("codemirror");

const { createMiddleware } = require("signalbox");
const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

let cm;
const markers = [];
const lineWidgets = [];

export const middleware = createMiddleware((cancel, before, after) => ({
  [after(actions.START_COMPOSER)](store, action) {
    const textarea = document.querySelector('textarea');

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

  [cancel(actions.CHANGE_CODE)](store, action) {
    return action.composer.code === select("composer").from(store).code();
  },

  [after(actions.CHANGE_CODE)](store, action) {
    markers.forEach(marker => marker.clear());
    lineWidgets.forEach(l => cm.removeLineWidget(l));
  },

  [after(actions.SYNTAX_ERROR)](store, action) {
    const line = action.line;
    const column = action.column;
    const message = action.message;

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

    const lineWidget = document.createElement('div');
    lineWidget.style.backgroundColor = "red";
    lineWidget.style.height = "20px";
    lineWidget.textContent = message;

    setTimeout(() => {
      markers.push(cm.markText(from, to, options));
      lineWidgets.push(cm.addLineWidget(line - 1, lineWidget));
    }, 100);
  }
}));

export default middleware;

