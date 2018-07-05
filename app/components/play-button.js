const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Pane extends React.Component {
  static propTypes = {
    playing: PropTypes.number,
    onClick: PropTypes.func,
  };

  render() {
    const { playing, onClick } = this.props;
    const className = classnames({
      "play-button": true,
      "play-button--playing": playing,
      "play-button--stopped": !playing,
    });
    //const icon = playing ? "⏹" : "▶️";
    const text = playing ? "⏹ Stop" : "▶️ Run";

    return (
      <button className={className} onClick={onClick}>
        {text}
      </button>
    );
  }
}


