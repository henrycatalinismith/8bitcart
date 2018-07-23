const React = require("react");
const PropTypes = require("prop-types");

export default class Canvas extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  };

  setElement = element => {
    this.element = element;
  };

  componentDidUpdate() {
    this.element.width = this.element.offsetWidth;
    this.element.height = this.element.offsetHeight;
    this.element.dispatchEvent(new Event("resize"));
  }

  render() {
    const { width, height } = this.props;
    console.log(width, height);
    return (
      <canvas
        ref={this.setElement}
        className="canvas"
        width={width}
        height={height}
      />
    );
  }
}

