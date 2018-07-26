const React = require("react");
const PropTypes = require("prop-types");

export default class MenuItem extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    href: PropTypes.string,
    onClick: PropTypes.func,
  };

  render() {
    const { href, children, onClick } = this.props;
    return (
      <a className="menu-item" href={href} onClick={onClick}>
        {children}
      </a>
    );
  }
}

