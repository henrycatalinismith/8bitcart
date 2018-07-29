const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const FirstImpression = require("../components/first-impression").default;

export class WelcomeIndex extends React.PureComponent {
  static mapStateToProps = state => ({
    //tabs: select("tabs").from(state).all(),
    //trayWidth: select("layout").from(state).trayWidth(),
  });

  static mapDispatchToProps = dispatch => ({
    navigate: path => dispatch(actions.push(path)),
  });

  static propTypes = {
    //selectTab: PropTypes.func,
    //tabs: PropTypes.object,
    //trayWidth: PropTypes.number,
  };

  navigate = path => event => {
    event.preventDefault();
    this.props.navigate(path);
  };

  render() {
    const { tabs, trayWidth } = this.props;
    return (
      <FirstImpression openEditor={this.navigate("/new")} />
    );
  }
}

export default connect(
  WelcomeIndex.mapStateToProps,
  WelcomeIndex.mapDispatchToProps
)(WelcomeIndex);

