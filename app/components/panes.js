const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Panes extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { children, width, height } = this.props;
    const className = classnames({
      "panes": true,
      "panes--landscape": width >= height,
      "panes--portrait": width < height,
    });

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}


