const React = require("react");
const ReactDOM = require("react-dom");
const { Provider } = require("react-redux");

const { createActions } = require("signalbox");
const { createApp } = require("signalbox");
const { createSelectors } = require("signalbox");
const { runWorker } = require("signalbox");
const { Screen } = require("emulator");

const Layout = require("../containers/layout").default;
const select = require("../reducers/selectors").default;
const createStore = require("../reducers").default;
const thunks = require("../thunks").default;

const actions = createActions([
  "CHANGE_CODE",
  "START_EMULATOR",
  "STOP_EMULATOR",
  "RESIZE_EMULATOR",
  "SYNTAX_ERROR",
  "TICK_EMULATOR",
  "PARSE_CODE",
  "RESIZE_VIEWPORT",
], types => ({
  changeCode: code => ({
    type: types.CHANGE_CODE,
    editor: { code }
  }),

  startEmulator: code => ({
    type: types.START_EMULATOR,
    code,
  }),

  stopEmulator: () => ({
    type: types.STOP_EMULATOR,
  }),

  syntaxError: (line, column, message) => ({
    type: types.SYNTAX_ERROR,
    line,
    column,
    message,
  }),

  parseCode: code => ({
    type: types.PARSE_CODE,
    code,
  }),

  tickEmulator: memory => ({
    type: types.TICK_EMULATOR,
    memory,
  }),

  resizeEmulator: height => ({
    type: types.RESIZE_EMULATOR,
    emulator: { height },
  }),

  resizeViewport: (width, height) => ({
    type: types.RESIZE_VIEWPORT,
    viewport: { width, height }
  }),
}));

const selectors = {
  editor: {
    started: editor => editor.started,
    updated: editor => editor.updated,
    code: editor => editor.code,
    width: editor => editor.width,
    height: editor => editor.height,
    syntaxError: editor => editor.syntaxErrorMessage ? ({
      line: editor.syntaxErrorLine,
      column: editor.syntaxErrorColumn,
      message: editor.syntaxErrorMessage,
    }) : undefined,
  },

  emulator: {
    path: emulator => emulator.path,
    running: emulator => emulator.running,
    started: emulator => emulator.started,
    stopped: emulator => emulator.stopped,
    width: emulator => emulator.width,
    height: emulator => emulator.height,
  },

  viewport: {
    dimensions: viewport => viewport,
    width: viewport => viewport.width,
    height: viewport => viewport.height,
  },
};


document.addEventListener('DOMContentLoaded', () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const headerHeight = 32;
  const headerWidth = viewportWidth;

  let emulatorWidth;
  let emulatorHeight;

  let separatorHeight;
  let separatorWidth;

  let editorWidth;
  let editorHeight;

  const footerWidth = viewportWidth;
  const footerHeight = 32;

  if (viewportWidth < viewportHeight) {
    separatorHeight = 8;
    separatorWidth = viewportWidth;

    emulatorWidth = viewportWidth;
    emulatorHeight = Math.min(viewportWidth, viewportHeight*0.75);

    editorWidth = viewportWidth;
    editorHeight = (
      viewportHeight
      - headerHeight
      - emulatorHeight
      - separatorHeight
      - footerHeight
    );

  } else {
    separatorHeight = viewportHeight;
    separatorWidth = 8;

    //editorWidth = Math.min(512, viewportWidth - Math.min(viewportHeight, viewportWidth*0.75)) - separatorWidth;
    editorWidth = 410;
    //editorWidth = (
      //viewportWidth
      //- emulatorWidth
      //- separatorWidth
    //);
    editorHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );

    //emulatorWidth = Math.min(viewportHeight, viewportWidth*0.75);
    emulatorWidth = viewportWidth - editorWidth - separatorWidth;
    emulatorHeight = (
      viewportHeight
      - headerHeight
      - footerHeight
    );
  }

  const initialState = {
    editor: {
      started: new Date,
      updated: undefined,
      width: editorWidth,
      height: editorHeight,
      syntaxErrorLine: undefined,
      syntaxErrorColumn: undefined,
      syntaxErrorMessage: undefined,
    },
    emulator: {
      path: document.querySelector('#emulator').textContent.trim(),
      running: false,
      started: undefined,
      stopped: undefined,
      width: emulatorWidth,
      height: emulatorHeight,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  };

  //const store = createStore(initialState);
  const app = createApp(actions, selectors, thunks, initialState, [
    "CHANGE_CODE",
    "START_EMULATOR",
    "STOP_EMULATOR",
    "RESIZE_EMULATOR",
    "SYNTAX_ERROR",
    "TICK_EMULATOR",
    "PARSE_CODE",
    "RESIZE_VIEWPORT",
  ]);

  let worker;
  let screen;

  app.cancel(actions.CHANGE_CODE, action => {
    return action.editor.code === app.store.editor.code;
  });

  app.before(actions.START_EMULATOR, action => {
    if (app.store.emulator.running) {
      app.dispatch.stopEmulator();
    }
  });

  app.on(actions.CHANGE_CODE, {
    editor(editor, action) {
      return {
        ...editor,
        code: action.editor.code,
        updated: new Date,
        syntaxErrorLine: undefined,
        syntaxErrorColumn: undefined,
        syntaxErrorMessage: undefined,
      };
    }
  });

  app.on(actions.SYNTAX_ERROR, {
    editor(editor, action) {
      return {
        ...editor,
        syntaxErrorLine: action.line,
        syntaxErrorColumn: action.column,
        syntaxErrorMessage: action.message,
      };
    }
  });

  app.on(actions.START_EMULATOR, {
    emulator(emulator, action) {
      return {
        ...emulator,
        running: true,
        started: new Date,
      };
    }
  });

  app.on(actions.STOP_EMULATOR, {
    emulator(emulator, action) {
      return {
        ...emulator,
        running: false,
        stopped: new Date,
      };
    }
  });

  app.after(actions.START_EMULATOR, action => {
    const path = app.store.emulator.path;
    const code = app.store.editor.code;
    action.code = code;

    if (screen === undefined) {
      screen = new Screen(document.querySelector("canvas"));
    }

    worker = runWorker("emulator", path, action, {
      [actions.SYNTAX_ERROR](dispatch, syntaxError) {
        app.dispatch.syntaxError(syntaxError);
      },

      [actions.TICK_EMULATOR](dispatch, tickEmulator) {
        screen.update(tickEmulator.memory);
      },

      [actions.STOP_EMULATOR](dispatch, stopEmulator) {
        app.dispatch.stopEmulator();
      }
    });

    screen.start();
  });

  app.after(actions.SYNTAX_ERROR, action => {
    app.dispatch.stopEmulator();
  });

  app.after(actions.STOP_EMULATOR, action => {
    worker.terminate();
    if (screen) {
      screen.stop();
    }
  });

  const root = document.createElement("div");
  root.className = "composer";
  document.body.appendChild(root);
  ReactDOM.render(<Provider store={app.store}><Layout /></Provider>, root);

  window.addEventListener("resize", () => {
    app.dispatch.resizeViewport(
      window.innerWidth,
      window.innerHeight
    );
  });
});

