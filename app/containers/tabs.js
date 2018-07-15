const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const TabList = require("../components/tab-list").default;
const Tab = require("../components/tab").default;

export class Tabs extends React.PureComponent {
  static mapStateToProps = state => ({
    tabs: select("tabs").from(state).all(),
    trayWidth: select("layout").from(state).trayWidth(),
  });

  static mapDispatchToProps = dispatch => ({
    selectTab: key => dispatch(actions.selectTab(key)),
  });

  static propTypes = {
    selectTab: PropTypes.func,
    tabs: PropTypes.object,
    trayWidth: PropTypes.number,
  };

  render() {
    const { tabs, trayWidth } = this.props;
    return (
      <TabList width={trayWidth}>
        {Object.keys(tabs).map(key => {
          const tab = tabs[key];
          const onClick = this.props.selectTab.bind(null, key);
          return (
            <Tab key={key} active={tab.active} onClick={onClick}>
              {tab.label}
            </Tab>
          );
        })}
      </TabList>
    );
  }
}

export default connect(
  Tabs.mapStateToProps,
  Tabs.mapDispatchToProps
)(Tabs);

