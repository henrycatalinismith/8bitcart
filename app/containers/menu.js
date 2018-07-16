const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { slide: ReactBurgerMenu } = require("react-burger-menu");

//const actions = require("../actions").default;
//const select = require("../reducers/selectors").default;
const MenuItem = require("../components/menu-item").default;

export class Menu extends React.PureComponent {
  static mapStateToProps = state => ({
    //viewportWidth: select("layout").from(state).viewportWidth(),
  });

  static propTypes = {
    //viewportWidth: PropTypes.number,
  };

  render() {
    return (
      <ReactBurgerMenu key="menu" right width={300} pageWrapId="page" outerContainerId="root">
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/sign-up">Sign Up</MenuItem>
      </ReactBurgerMenu>
    );
  }
}

export default connect(
  Menu.mapStateToProps,
  Menu.mapDispatchToProps
)(Menu);

