const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class TabList extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    active: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    active: false,
    onClick: () => {},
  };

  render() {
    const { children, active, onClick } = this.props;

    const className = classnames({
      "tab": true,
      "tab--active": active,
      "tab--inactive": !active,
    });

    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
}


