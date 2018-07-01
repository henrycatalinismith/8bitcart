const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { Controlled: CodeMirror } = require("react-codemirror2");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;
const Wrapper = require("../components/composer").default;

export class Composer extends React.PureComponent {
  static mapStateToProps = state => ({
    code: select("composer").from(state).code(),
  });

  static mapDispatchToProps = dispatch => ({
    changeCode: code => dispatch(actions.changeCode(code)),
  });

  static propTypes = {
    changeCode: PropTypes.func,
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
    const props = {
      options: Composer.codeMirrorOptions,
      value: this.state.code,

      onBeforeChange: (editor, data, value) => {
        this.setState({ code: value });
      },

      onChange: (editor, data, value) => {
        this.props.changeCode(value);
      }
    };

    return (
      <Wrapper>
        <CodeMirror {...props} />
      </Wrapper>
    );
  }
}

export default connect(
  Composer.mapStateToProps,
  Composer.mapDispatchToProps
)(Composer);

