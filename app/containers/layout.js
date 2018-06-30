const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Composer = require("./composer").default;
const Emulator = require("./emulator").default;
const SplitPane = require("react-split-pane").default;

console.log(SplitPane);

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({
    composerHeight: select("composer").from(state).height(),
    emulatorHeight: select("emulator").from(state).height(),
  });

  static mapDispatchToProps = dispatch => ({
    resizeEmulator: height => dispatch(actions.resizeEmulator(height)),
  });

  static propTypes = {
    composerHeight: PropTypes.number,
    emulatorHeight: PropTypes.number,
  };

  onChange = size => {
    this.props.resizeEmulator(size);
  }

  render() {
    const { composerHeight, emulatorHeight } = this.props;
    const totalHeight = composerHeight + emulatorHeight;
    const percent = emulatorHeight / totalHeight * 100;

    return (
      <SplitPane
        split="horizontal"
        defaultSize={`${percent}%`}
        onChange={this.onChange}>
        <Emulator key="emulator" />
        <Composer key="composer" />
      </SplitPane>
    );
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

