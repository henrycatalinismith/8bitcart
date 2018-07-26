const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { slide: ReactBurgerMenu } = require("react-burger-menu");

const actions = require("../actions").default;
//const select = require("../reducers/selectors").default;
const MenuItem = require("../components/menu-item").default;

export class Menu extends React.PureComponent {
  static mapStateToProps = state => ({
    //viewportWidth: select("layout").from(state).viewportWidth(),
  });

  static mapDispatchToProps = dispatch => ({
    navigate: path => dispatch(actions.push(path)),
  });

  static propTypes = {
    navigate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  onStateChange = state => {
    this.setState(state);
  };

  navigate = path => event => {
    event.preventDefault();
    this.props.navigate(path);
    this.setState({ isOpen: false });
  };

  render() {
    const menuProps = {
      key: "menu",
      right: true,
      width: 300,
      pageWrapId: "page",
      outerContainerId: "root",
      isOpen: this.state.isOpen,
      onStateChange: this.onStateChange,
    };

    return (
      <ReactBurgerMenu {...menuProps}>
        <MenuItem href="/" onClick={this.navigate("/")}>
          Home
        </MenuItem>
        <MenuItem href="/browse" onClick={this.navigate("/browse")}>
          Browse
        </MenuItem>
      </ReactBurgerMenu>
    );
  }
}

export default connect(
  Menu.mapStateToProps,
  Menu.mapDispatchToProps
)(Menu);

