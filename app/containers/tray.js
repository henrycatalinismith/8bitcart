const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");

const actions = require("../actions").default;
const select = require("../reducers/selectors").default;

const Pane = require("../components/pane").default;
const Separator = require("../components/separator").default;
const Wrapper = require("../components/panes").default;
const Help = require("../components/help").default;

const Playback = require("./playback").default;
const Editor = require("./editor").default;
const Tabs = require("./tabs").default;
const Emulator = require("./emulator").default;

export class Tray extends React.PureComponent {
  static mapStateToProps = state => ({
    activeTab: select("tabs").from(state).active(),
  });

  static propTypes = {
    activeTab: PropTypes.string,
  };

  render() {
    const { activeTab } = this.props;

    const Tray = [];

    switch (activeTab) {
      case "code":
        Tray.push(<Playback key="playback" />);
        Tray.push(<Editor key="editor" />);
        break;

      case "help":
        Tray.push(<Help key="help" />);
        break;
    }

    Tray.push(<Tabs key="tabs" />);

    return Tray;
  }
}

export default connect(
  Tray.mapStateToProps,
  Tray.mapDispatchToProps
)(Tray);

