const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Shelf = require("../components/shelf").default;
const PlayButton = require("../components/play-button").default;
//const Separator = require("../components/separator").default;
//const Wrapper = require("../components/panes").default;

export class Playback extends React.PureComponent {
  static mapStateToProps = state => ({
    running: select("emulator").from(state).running(),
  });

  static mapDispatchToProps = (dispatch, props) => ({
    startEmulator: () => dispatch(actions.startEmulator()),
    stopEmulator: () => dispatch(actions.stopEmulator()),
  });

  static propTypes = {
    running: PropTypes.bool,
    startEmulator: PropTypes.func,
    stopEmulator: PropTypes.func,
  };

  onClick = () => {
    console.log(this.props.running);
    if (this.props.running) {
      this.props.stopEmulator();
    } else {
      this.props.startEmulator();
    }
  }

  render() {
    const { running, onClick } = this.props;
    return (
      <Shelf>
        <PlayButton playing={running} onClick={this.onClick} />
      </Shelf>
    );
  }
}

export default connect(
  Playback.mapStateToProps,
  Playback.mapDispatchToProps
)(Playback);

