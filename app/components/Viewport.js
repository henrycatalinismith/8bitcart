const React = require("react");
const PropTypes = require("prop-types");

export default class Viewport extends React.PureComponent {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div className="Viewport">
        {this.props.children}
      </div>
    );
  }
}


