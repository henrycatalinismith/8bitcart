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
    size: select("layout").from(state).emulatorSize(),
  });

  static mapDispatchToProps = dispatch => ({});

  static propTypes = {
    running: PropTypes.bool,
    size: PropTypes.number,
  };

  render() {
    const { width, height, size } = this.props;
    const min = Math.min(width, height);
    return (
      <Wrapper width={width} height={height}>
        <Canvas width={size} height={size} />
      </Wrapper>
    );
  }
}

export default connect(
  Emulator.mapStateToProps,
  Emulator.mapDispatchToProps
)(Emulator);

