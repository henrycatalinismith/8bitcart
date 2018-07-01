const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Editor = require("./editor").default;
const Emulator = require("./emulator").default;

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({
    editorHeight: select("editor").from(state).height(),
    emulatorHeight: select("emulator").from(state).height(),
  });

  static mapDispatchToProps = dispatch => ({
    resizeEmulator: height => dispatch(actions.resizeEmulator(height)),
  });

  static propTypes = {
    editorHeight: PropTypes.number,
    emulatorHeight: PropTypes.number,
  };

  onChange = size => {
    this.props.resizeEmulator(size);
  }

  render() {
    const { editorHeight, emulatorHeight } = this.props;
    const totalHeight = editorHeight + emulatorHeight;
    const percent = emulatorHeight / totalHeight * 100;

    return [
      <Emulator key="emulator" />,
      <Editor key="editor" />,
    ];
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

