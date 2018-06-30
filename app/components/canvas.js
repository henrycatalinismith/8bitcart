const React = require("react");
const PropTypes = require("prop-types");

export default class Canvas extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    return (
      <canvas
        className="canvas"
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

