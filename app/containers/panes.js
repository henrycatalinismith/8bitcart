const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Pane = require("../components/pane").default;
const Separator = require("../components/separator").default;
const Wrapper = require("../components/panes").default;

const Playback = require("./playback").default;
const Editor = require("./editor").default;
const Tabs = require("./tabs").default;
const Emulator = require("./emulator").default;

export class Panes extends React.PureComponent {
  static mapStateToProps = state => ({
    viewportWidth: select("layout").from(state).viewportWidth(),
    viewportHeight: select("layout").from(state).viewportHeight(),
    trayWidth: select("layout").from(state).trayWidth(),
    trayHeight: select("layout").from(state).trayHeight(),
    stageWidth: select("layout").from(state).stageWidth(),
    stageHeight: select("layout").from(state).stageHeight(),
  });

  static propTypes = {
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    trayWidth: PropTypes.number,
    trayHeight: PropTypes.number,
    stageWidth: PropTypes.number,
    stageHeight: PropTypes.number,
  };

  render() {
    const { viewportWidth, viewportHeight } = this.props;
    const { trayWidth, trayHeight } = this.props;
    const { stageWidth, stageHeight } = this.props;

    return (
      <Wrapper width={viewportWidth} height={viewportHeight}>
        <Pane id="stage" width={stageWidth} height={stageHeight}>
          <Emulator />
        </Pane>
        <Separator width={viewportWidth} height={viewportHeight} />
        <Pane id="tray" width={trayWidth} height={trayHeight}>
          <Playback />
          <Editor />
          <Tabs />
        </Pane>
      </Wrapper>
    );
  }
}

export default connect(
  Panes.mapStateToProps,
  Panes.mapDispatchToProps
)(Panes);

