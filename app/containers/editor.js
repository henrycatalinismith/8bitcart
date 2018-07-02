const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { Controlled: CodeMirror } = require("react-codemirror2");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

export class Editor extends React.PureComponent {
  static mapStateToProps = state => ({
    code: select("editor").from(state).code(),
    width: select("editor").from(state).width(),
    height: select("editor").from(state).height(),
    syntaxError: select("editor").from(state).syntaxError(),
  });

  static mapDispatchToProps = dispatch => ({
    changeCode: code => dispatch(actions.changeCode(code)),
  });

  static propTypes = {
    changeCode: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    syntaxError: PropTypes.shape({
      line: PropTypes.number,
      column: PropTypes.number,
      message: PropTypes.string,
    }),
  };

  static codeMirrorOptions = {
    autofocus: false,
    cursorBlinkRate: 500,
    gutters: ["syntaxErrors", "CodeMirror-linenumbers"],
    indentUnit: 2,
    indentWithTabs: false,
    lineNumbers: true,
    mode: "lua",
    //smartIndent: true,
    viewportMargin: Infinity,
  };

  constructor(...props) {
    super(...props);
    this.state = {
      code: props.code,
    };
    this.markers = [];
    this.gutterMarkers = [];
    this.lineWidgets = [];
  }

  editorDidMount = editor => {
    this.editor = editor;
  };

  markError(error) {
    const { line, column, message } = error;

    const from = {
      line: line - 1,
      ch: column - 2,
    };

    const to = {
      line: line - 1,
      ch: column - 1,
    };

    const options = {
      className: 'syntax-error',
    };

    const text = string => {
      const l = document.createElement('div');
      l.className = "annotation";
      l.style.backgroundColor = "#fff";
      l.style.height = "32px";
      l.style.fontSize = "14px";
      l.style.color = "#ed484b";
      l.style.paddingLeft = "4px";
      l.style.paddingRight = "0px";
      l.style.letterSpacing = "0px";
      l.style.transform = "translateY(-3px)";
      l.style.userSelect = "none";
      l.style.cursor = "default";
      //l.textContent = message;
      l.innerHTML = string;
      return l;
    };

    const face = emoji => {
      const m = document.createElement('div');
      m.textContent = emoji;
      m.style.backgroundColor = "#f7f7f7";
      m.style.height = "26px";
      m.style.width = "28px";
      m.style.textAlign = "right";
      m.style.paddingRight = "0px";
      m.style.fontSize = "27px";
      m.style.lineHeight = "52px";
      m.style.textIndent = "8px";
      m.style.transform = "translateY(-12px)";
      return m;
    }

    this.editor.scrollTo(from)
    this.markers.push(this.editor.markText(from, to, options));
    this.gutterMarkers.push(this.editor.setGutterMarker(line - 1, "syntaxErrors", face("😅")));
    this.lineWidgets.push(this.editor.addLineWidget(line - 1, text("&nbsp;".repeat(column-1) + "oops")));
    this.lineWidgets.push(this.editor.addLineWidget(line - 2, text("")));
    setTimeout(() => {
      this.editor.setCursor(from)
    }, 200);

    console.log('markerr');
    this.tick = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (!this.props.syntaxError) {
        return;
      }
      const even = this.tick % 2 === 0;
      const m = face(even ? "🤨" : "😅");
      //this.editor.clearGutter("syntaxErrors");
      this.gutterMarkers[0] = this.editor.setGutterMarker(line - 1, "syntaxErrors", m);
      this.lineWidgets[0].node.innerHTML = "&nbsp;".repeat(column-1) + (even ? "oops" : "lol");
      this.tick += 1;
    }, 1000);
  }

  clearErrors() {
    console.log('clearerr');
    clearInterval(this.interval);
    this.markers.forEach(marker => marker.clear());
    this.markers = [];
    this.gutterMarkers = [];
    this.editor.clearGutter("syntaxErrors");
    this.lineWidgets.forEach(l => this.editor.removeLineWidget(l));
    this.lineWidgets = [];
  }

  render() {
    const { width, height, syntaxError } = this.props;

    console.log(syntaxError, this.markers.length);
    if (syntaxError && this.markers.length < 1) {
      this.markError(syntaxError);
    } else if (!syntaxError && this.markers.length > 0) {
      this.clearErrors();
    }

    const props = {
      className: "editor",
      options: Editor.codeMirrorOptions,
      value: this.state.code,
      editorDidMount: this.editorDidMount,

      onBeforeChange: (editor, data, value) => {
        this.setState({ code: value });
      },

      onChange: (editor, data, value) => {
        this.props.changeCode(value);
      }
    };

    return <CodeMirror {...props} />;
  }
}

export default connect(
  Editor.mapStateToProps,
  Editor.mapDispatchToProps
)(Editor);

