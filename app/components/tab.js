const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class TabList extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    active: PropTypes.bool,
  };

  static defaultProps = {
    active: false,
  };

  render() {
    const { children, active } = this.props;

    const className = classnames({
      "tab": true,
      "tab--active": active,
      "tab--inactive": !active,
    });

    return (
      <button className={className}>
        {children}
      </button>
    );
  }
}


