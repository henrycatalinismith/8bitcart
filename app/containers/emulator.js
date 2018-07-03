const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Wrapper = require("../components/emulator").default;
const Canvas = require("../components/canvas").default;

export class Emulator extends React.PureComponent {
  static mapStateToProps = state => ({
    running: select("emulator").from(state).running(),
    width: select("emulator").from(state).width(),
    height: select("emulator").from(state).height(),
  });

  static mapDispatchToProps = dispatch => ({});

  static propTypes = {
    running: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { width, height } = this.props;
    return (
      <Wrapper width={width} height={height}>
        <Canvas width={height - 8} height={height - 8} />
      </Wrapper>
    );
  }
}

export default connect(
  Emulator.mapStateToProps,
  Emulator.mapDispatchToProps
)(Emulator);

