const React = require("react");
const PropTypes = require("prop-types");

export default class Viewport extends React.PureComponent {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div className="viewport">
        {this.props.children}
      </div>
    );
  }
}


