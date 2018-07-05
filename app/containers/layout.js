const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Header = require("../components/header").default;
const Panes = require("../containers/panes").default;
const Footer = require("../components/footer").default;

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({
    viewportWidth: select("viewport").from(state).width(),
    viewportHeight: select("viewport").from(state).height(),
    editorWidth: select("editor").from(state).width(),
    editorHeight: select("editor").from(state).height(),
    emulatorWidth: select("emulator").from(state).width(),
    emulatorHeight: select("emulator").from(state).height(),
  });

  static mapDispatchToProps = dispatch => ({
    resizeEmulator: height => dispatch(actions.resizeEmulator(height)),
  });

  static propTypes = {
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    editorWidth: PropTypes.number,
    editorHeight: PropTypes.number,
    emulatorWidth: PropTypes.number,
    emulatorHeight: PropTypes.number,
  };

  onChange = size => {
    this.props.resizeEmulator(size);
  }

  render() {
    return [
      <Header key="header"/>,
      <Panes key="panes"/>,
      <Footer key="footer"/>,
    ];
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

