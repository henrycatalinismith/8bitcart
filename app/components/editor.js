const React = require("react");
const PropTypes = require("prop-types");

export default class Editor extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { children, width, height } = this.props;
    const style = {
      width: `${width}px`,
      height: `${height}px`,
    };

    return (
      <div className="editor" style={style}>
        {children}
      </div>
    );
  }
}

