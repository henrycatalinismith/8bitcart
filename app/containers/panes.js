const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Pane = require("../components/pane").default;
const Separator = require("../components/separator").default;
const Wrapper = require("../components/panes").default;

const Tray = require("./tray").default;

export class Panes extends React.PureComponent {
  static mapStateToProps = state => ({
    orientation: select("layout").from(state).orientation(),
    viewportWidth: select("layout").from(state).viewportWidth(),
    viewportHeight: select("layout").from(state).viewportHeight(),
    trayWidth: select("layout").from(state).trayWidth(),
    trayHeight: select("layout").from(state).trayHeight(),
    trayVisible: select("layout").from(state).trayVisible(),
    stageWidth: select("layout").from(state).stageWidth(),
    stageHeight: select("layout").from(state).stageHeight(),
  });

  static propTypes = {
    children: PropTypes.any,
    orientation: PropTypes.string,
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    trayWidth: PropTypes.number,
    trayHeight: PropTypes.number,
    trayVisible: PropTypes.bool,
    stageWidth: PropTypes.number,
    stageHeight: PropTypes.number,
  };

  render() {
    const { children, showTray, orientation } = this.props;
    const { viewportWidth, viewportHeight } = this.props;
    const { trayWidth, trayHeight, trayVisible } = this.props;
    const { stageWidth, stageHeight } = this.props;

    return (
      <Wrapper width={viewportWidth} height={viewportHeight} orientation={orientation}>
        <Pane id="stage" width={stageWidth} height={stageHeight}>
          {children}
        </Pane>
        {trayVisible && [
          <Separator key="separator" width={viewportWidth} height={viewportHeight} />,
          <Pane key="tray" id="tray" width={trayWidth} height={trayHeight}>
            <Tray />
          </Pane>
        ]}
      </Wrapper>
    );
  }
}

export default connect(
  Panes.mapStateToProps,
  Panes.mapDispatchToProps
)(Panes);

