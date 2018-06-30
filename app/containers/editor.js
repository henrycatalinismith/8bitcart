const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;
const Textarea = require("../components/textarea").default;

export class Editor extends React.PureComponent {
  static mapStateToProps = state => ({});

  static mapDispatchToProps = dispatch => ({
    mountTextarea: textarea => dispatch(actions.mountTextarea(textarea)),
  });

  static propTypes = {
    mountTextarea: PropTypes.func,
  };

  onTextareaMount = textarea => {
    this.props.mountTextarea(textarea);
  };

  render() {
    return <Textarea onMount={this.onTextareaMount} />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    mountTextarea: textarea => dispatch(actions.mountTextarea(textarea)),
  };
};

export default connect(
  Editor.mapStateToProps,
  Editor.mapDispatchToProps
)(Editor);

