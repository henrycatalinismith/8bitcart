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
    focusTray: () => dispatch(actions.focusTray()),
  });

  static propTypes = {
    changeCode: PropTypes.func,
    focusTray: PropTypes.func,
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
    //lineNumbers: true,
    mode: "lua",
    //smartIndent: true,
    theme: "8bitcart",
    viewportMargin: Infinity,
  };

  constructor(props) {
    super(props);
    this.state = {
      code: props.code,
    };
    this.errors = [];
    this.markers = [];
    this.gutterMarkers = [];
    this.lineWidgets = [];
  }

  componentDidUpdate() {
    if (this.props.code !== this.state.code) {
      this.setState({ code: this.props.code });
    }
  }

  editorDidMount = editor => {
    this.editor = editor;
    setTimeout(() => this.editor.refresh(), 100);
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

    this.editor.scrollTo(from)
    this.editor.addLineClass(line - 1, 'background', 'syntax-error');
    this.errors.push(line - 1);
  }

  clearErrors() {
    this.errors.forEach(line => {
      this.editor.removeLineClass(line, 'background', 'syntax-error');
    });
    this.errors = [];
  }

  render() {
    const { width, height, syntaxError } = this.props;

    if (syntaxError && this.errors.length < 1) {
      this.markError(syntaxError);
    } else if (!syntaxError && this.errors.length > 0) {
      this.clearErrors();
    }

    const props = {
      className: "editor",
      options: Editor.codeMirrorOptions,
      value: this.state.code,
      editorDidMount: this.editorDidMount,
      resizable: true,

      onBeforeChange: (editor, data, value) => {
        this.setState({ code: value });
      },

      onChange: (editor, data, value) => {
        this.props.changeCode(value);
      },

      onFocus: () => {
        this.props.focusTray();
      },
    };

    return <CodeMirror {...props} />;
  }
}

export default connect(
  Editor.mapStateToProps,
  Editor.mapDispatchToProps
)(Editor);

