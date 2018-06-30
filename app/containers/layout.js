const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Composer = require("./composer").default;
const Emulator = require("./emulator").default;

export class Layout extends React.PureComponent {
  static mapStateToProps = state => ({});
  static mapDispatchToProps = dispatch => ({});
  static propTypes = {};

  render() {
    return [
      <Emulator key="emulator" />,
      <Composer key="composer" />,
    ];
  }
}

export default connect(
  Layout.mapStateToProps,
  Layout.mapDispatchToProps
)(Layout);

