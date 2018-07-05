const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class PlayButton extends React.Component {
  static propTypes = {
    playing: PropTypes.bool,
    onClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  onFocus = () => this.setState({ focused: true });
  onBlur = () => this.setState({ focused: false });

  render() {
    const { playing, onClick } = this.props;
    const { focused } = this.state;
    const { onFocus, onBlur } = this;

    const className = classnames({
      "play-button": true,
      "play-button--playing": playing,
      "play-button--stopped": !playing,
      "play-button--focused": focused,
    });

    const text = playing ? "⏹ Stop" : "▶️ Run";

    const props = {
      className,
      onClick,
      onFocus,
      onBlur
    };

    return (
      <button {...props}>
        {text}
      </button>
    );
  }
}


