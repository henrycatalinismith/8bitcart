const React = require("react");
const PropTypes = require("prop-types");

export default class TabList extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    width: PropTypes.number,
  };

  render() {
    const { children, width } = this.props;
    return (
      <nav className="tab-list" style={{ width: `${width}px` }}>
        {children}
      </nav>
    );
  }
}


