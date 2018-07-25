const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Panes extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    orientation: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { children, width, height, orientation } = this.props;
    const className = classnames({
      "panes": true,
      "panes--landscape": orientation === "landscape",
      "panes--portrait": orientation === "portrait",
    });

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}


