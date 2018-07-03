const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Header = require("../components/header").default;
const Footer = require("../components/footer").default;
const Pane = require("../components/pane").default;
const Editor = require("./editor").default;
const Emulator = require("./emulator").default;

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({
    editorWidth: select("editor").from(state).width(),
    editorHeight: select("editor").from(state).height(),
    emulatorWidth: select("emulator").from(state).width(),
    emulatorHeight: select("emulator").from(state).height(),
  });

  static mapDispatchToProps = dispatch => ({
    resizeEmulator: height => dispatch(actions.resizeEmulator(height)),
  });

  static propTypes = {
    editorWidth: PropTypes.number,
    editorHeight: PropTypes.number,
    emulatorWidth: PropTypes.number,
    emulatorHeight: PropTypes.number,
  };

  onChange = size => {
    this.props.resizeEmulator(size);
  }

  render() {
    const { editorWidth, editorHeight } = this.props;
    const { emulatorWidth, emulatorHeight } = this.props;

    const totalHeight = editorHeight + emulatorHeight;
    const percent = emulatorHeight / totalHeight * 100;

    return [
      <Header key="header"/>,
      <Pane key="emulator" width={editorWidth} height={editorHeight}>
        <Emulator />
      </Pane>,
      <Pane key="editor" width={emulatorWidth} height={emulatorHeight}>
        <Editor />
      </Pane>,
      <Footer key="footer"/>,
    ];
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

