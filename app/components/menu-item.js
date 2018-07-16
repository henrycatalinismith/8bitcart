const React = require("react");
const PropTypes = require("prop-types");

export default class MenuItem extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    children: PropTypes.any,
  };

  render() {
    const { href, children } = this.props;
    return (
      <a className="menu-item" href={href}>
        {children}
      </a>
    );
  }
}

