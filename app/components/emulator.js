const React = require("react");
const PropTypes = require("prop-types");

export default class Emulator extends React.Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div className="emulator">
        {this.props.children}
      </div>
    );
  }
}

