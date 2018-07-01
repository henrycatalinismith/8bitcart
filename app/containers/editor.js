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
  });

  static mapDispatchToProps = dispatch => ({
    changeCode: code => dispatch(actions.changeCode(code)),
  });

  static propTypes = {
    changeCode: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static codeMirrorOptions = {
    autofocus: false,
    cursorBlinkRate: 500,
    indentUnit: 2,
    indentWithTabs: false,
    lineNumbers: true,
    mode: "lua",
    smartIndent: true,
    viewportMargin: Infinity,
  };

  constructor(...props) {
    super(...props);
    this.state = {
      code: props.code,
    };
  }

  render() {
    const { width, height } = this.props;

    const props = {
      className: "editor",
      options: Editor.codeMirrorOptions,
      value: this.state.code,

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

