const React = require("react");
const PropTypes = require("prop-types");

export default class TabList extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  render() {
    const { children } = this.props;
    return (
      <button className="tab">
        {children}
      </button>
    );
  }
}


