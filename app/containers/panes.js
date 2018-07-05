const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Pane = require("../components/pane").default;
const Separator = require("../components/separator").default;
const Wrapper = require("../components/panes").default;

const Playback = require("./playback").default;
const Editor = require("./editor").default;
const Emulator = require("./emulator").default;

export class Panes extends React.PureComponent {
  static mapStateToProps = state => ({
    viewportWidth: select("viewport").from(state).width(),
    viewportHeight: select("viewport").from(state).height(),
    editorWidth: select("editor").from(state).width(),
    editorHeight: select("editor").from(state).height(),
    emulatorWidth: select("emulator").from(state).width(),
    emulatorHeight: select("emulator").from(state).height(),
  });

  static propTypes = {
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    editorWidth: PropTypes.number,
    editorHeight: PropTypes.number,
    emulatorWidth: PropTypes.number,
    emulatorHeight: PropTypes.number,
  };

  render() {
    const { viewportWidth, viewportHeight } = this.props;
    const { editorWidth, editorHeight } = this.props;
    const { emulatorWidth, emulatorHeight } = this.props;

    return (
      <Wrapper width={viewportWidth} height={viewportHeight}>
        <Pane id="stage" width={emulatorWidth} height={emulatorHeight}>
          <Emulator />
        </Pane>
        <Separator width={viewportWidth} height={viewportHeight} />
        <Pane id="tray" width={editorWidth} height={editorHeight}>
          <Playback />
          <Editor />
        </Pane>
      </Wrapper>
    );
  }
}

export default connect(
  Panes.mapStateToProps,
  Panes.mapDispatchToProps
)(Panes);

