const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const TabList = require("../components/tab-list").default;
const Tab = require("../components/tab").default;

export class Tabs extends React.PureComponent {
  static mapStateToProps = state => ({
    trayWidth: select("layout").from(state).trayWidth(),
  });

  static propTypes = {
    trayWidth: PropTypes.number,
  };

  render() {
    const { trayWidth } = this.props;
    return (
      <TabList width={trayWidth}>
        <Tab>Code</Tab>
      </TabList>
    );
  }
}

export default connect(
  Tabs.mapStateToProps,
  Tabs.mapDispatchToProps
)(Tabs);

