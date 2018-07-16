const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Menu = require("./menu").default;
const Header = require("../components/header").default;
const Panes = require("../containers/panes").default;
const Footer = require("../components/footer").default;

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({
  });

  static mapDispatchToProps = dispatch => ({
  });

  static propTypes = {
  };

  render() {
    return [
      <Menu key="menu" />,
      <div key="page" id="page">
        <Header key="header"/>
        <Panes key="panes"/>
        <Footer key="footer"/>
      </div>,
    ];
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

