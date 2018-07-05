const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Separator extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { children, width, height } = this.props;
    const landscape = width >= height;
    const className = classnames({
      "separator": true,
      "separator--landscape": landscape,
      "separator--portrait": !landscape,
    });

    const style = {
      height: `${(landscape ? height - 64 : 8)}px`,
    }

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
}


