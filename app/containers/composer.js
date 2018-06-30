const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers").selectors;
const Viewport = require("../components/viewport").default;

const Editor = require("./editor").default;
const Emulator = require("./emulator").default;

export class Composer extends React.PureComponent {
  static mapStateToProps = state => ({});
  static mapDispatchToProps = dispatch => ({});
  static propTypes = {};

  render() {
    return [
      <Emulator key="emulator" />,
      <Editor key="editor" />,
    ];
  }
}

export default connect(
  Composer.mapStateToProps,
  Composer.mapDispatchToProps
)(Composer);

