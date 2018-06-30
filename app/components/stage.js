const React = require("react");
const PropTypes = require("prop-types");

export default class Stage extends React.Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div className="stage">
        {this.props.children}
      </div>
    );
  }
}

