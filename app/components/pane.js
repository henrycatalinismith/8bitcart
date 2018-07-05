const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Pane extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { children, id, width, height } = this.props;
    const className = classnames({
      "pane": true,
      [`pane--${id}`]: true,
    });

    const style = {
      width: `${width}px`,
      height: `${height}px`,
    };

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
}


