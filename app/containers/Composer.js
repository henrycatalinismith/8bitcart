const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers").selectors;
const Viewport = require("../components/Viewport").default;

export class Composer extends React.PureComponent {
  static mapStateToProps = state => ({});
  static mapDispatchToProps = dispatch => ({});
  static propTypes = {};

  render() {
    return (
      <Viewport>
        lol
      </Viewport>
    );
  }
}

export default connect(
  Composer.mapStateToProps,
  Composer.mapDispatchToProps
)(Composer);

